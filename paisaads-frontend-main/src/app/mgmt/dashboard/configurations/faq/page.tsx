"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Save, Plus, Trash2, Eye, AlertCircle, ArrowUp, ArrowDown, Tag } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";

interface FaqQuestion {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface Faq {
  _id?: string;
  questions: FaqQuestion[];
  categories: string[];
  introduction: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  isActive: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface FaqForm {
  questions: FaqQuestion[];
  categories: string[];
  introduction: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export default function FaqConfig() {
  const [formData, setFormData] = useState<FaqForm>({
    questions: [],
    categories: ["General"],
    introduction: "",
    contactInfo: {
      email: "",
      phone: ""
    }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [newCategory, setNewCategory] = useState("");

  const queryClient = useQueryClient();

  const { data: currentFaq, isLoading, error } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/faq");
      return data as Faq;
    }
  });

  const updateFaqMutation = useMutation({
    mutationFn: async (faqData: FaqForm) => {
      const { data } = await api.post("/configurations/faq", faqData);
      return data;
    },
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update FAQ");
    }
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: Omit<FaqQuestion, 'order'>) => {
      const { data } = await api.post("/configurations/faq/question", questionData);
      return data;
    },
    onSuccess: () => {
      toast.success("FAQ question added successfully");
      queryClient.invalidateQueries({ queryKey: ["faq"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add FAQ question");
    }
  });

  useEffect(() => {
    if (currentFaq) {
      setFormData({
        questions: currentFaq.questions.sort((a, b) => a.order - b.order),
        categories: currentFaq.categories,
        introduction: currentFaq.introduction,
        contactInfo: currentFaq.contactInfo
      });
      setHasChanges(false);
    }
  }, [currentFaq]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNestedChange = (field: string, nestedField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {

        ...(prev[field as keyof FaqForm] as Record<string, any>),
        [nestedField]: value
      }
    }));
    setHasChanges(true);
  };

  const handleQuestionChange = (index: number, field: keyof FaqQuestion, value: any) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, questions: newQuestions };
    });
    setHasChanges(true);
  };

  const addQuestion = () => {
    const newQuestion: FaqQuestion = {
      question: "",
      answer: "",
      category: formData.categories[0] || "General",
      order: formData.questions.length,
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setHasChanges(true);
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i }))
    }));
    setHasChanges(true);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newQuestions.length) {
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];

        newQuestions.forEach((q, i) => {
          q.order = i;
        });
      }
      
      return { ...prev, questions: newQuestions };
    });
    setHasChanges(true);
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory("");
      setHasChanges(true);
    }
  };

  const removeCategory = (category: string) => {
    if (formData.categories.length > 1) {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== category),
        questions: prev.questions.map(q => 
          q.category === category 
            ? { ...q, category: prev.categories.find(c => c !== category) || "General" }
            : q
        )
      }));
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    updateFaqMutation.mutate(formData);
  };

  const filteredQuestions = selectedCategory === "All" 
    ? formData.questions 
    : formData.questions.filter(q => q.category === selectedCategory);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load FAQ configuration. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            FAQ Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-2">
                <Label>FAQ Page Introduction</Label>
                <Textarea
                  value={formData.introduction}
                  onChange={(e) => handleFormChange("introduction", e.target.value)}
                  placeholder="Welcome to our FAQ section. Here you'll find answers to commonly asked questions..."
                  rows={3}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground">
                  {formData.introduction.length}/500 characters
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map(category => (
                    <div key={category} className="flex items-center gap-1">
                      <Badge variant="secondary">{category}</Badge>
                      {formData.categories.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(category)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCategory}
                    disabled={!newCategory.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Help Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleNestedChange("contactInfo", "email", e.target.value)}
                      placeholder="support@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Phone</Label>
                    <Input
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleNestedChange("contactInfo", "phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">FAQ Questions</h3>
                  <div className="flex items-center gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        {formData.categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addQuestion}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredQuestions.map((question, displayIndex) => {
                    const actualIndex = formData.questions.findIndex(q => q === question);
                    return (
                      <Card key={actualIndex} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">#{question.order + 1}</Badge>
                              <Badge variant="secondary">{question.category}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={question.isActive}
                                  onCheckedChange={(checked) => handleQuestionChange(actualIndex, "isActive", checked)}
                                />
                                <span className="text-sm">Active</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveQuestion(actualIndex, 'up')}
                                disabled={actualIndex === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveQuestion(actualIndex, 'down')}
                                disabled={actualIndex === formData.questions.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(actualIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => handleQuestionChange(actualIndex, "question", e.target.value)}
                                placeholder="Enter the question..."
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Select
                                value={question.category}
                                onValueChange={(value) => handleQuestionChange(actualIndex, "category", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Answer</Label>
                            <Textarea
                              value={question.answer}
                              onChange={(e) => handleQuestionChange(actualIndex, "answer", e.target.value)}
                              placeholder="Enter the detailed answer..."
                              rows={3}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <span className="text-sm text-muted-foreground">
                      Unsaved changes
                    </span>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || updateFaqMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateFaqMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {currentFaq && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span>
                      Last updated: {format(new Date(currentFaq.lastUpdated), "PPpp")}
                    </span>
                    <span>
                      Updated by: {currentFaq.updatedBy}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>FAQ Page Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {formData.introduction && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">{formData.introduction}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-center">
                {formData.categories.map(category => (
                  <Badge key={category} variant="outline">{category}</Badge>
                ))}
              </div>

              {formData.categories.map(category => {
                const categoryQuestions = formData.questions
                  .filter(q => q.category === category && q.isActive)
                  .sort((a, b) => a.order - b.order);

                if (categoryQuestions.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
                    <div className="space-y-3">
                      {categoryQuestions.map((q, index) => (
                        <Card key={index} className="p-4">
                          <h4 className="font-medium mb-2">{q.question}</h4>
                          <p className="text-muted-foreground text-sm">{q.answer}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}

              {(formData.contactInfo.email || formData.contactInfo.phone) && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Still have questions?</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {formData.contactInfo.email && (
                      <div>Email us at: {formData.contactInfo.email}</div>
                    )}
                    {formData.contactInfo.phone && (
                      <div>Call us at: {formData.contactInfo.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}