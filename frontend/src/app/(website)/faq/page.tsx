"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone, Filter, X } from "lucide-react";
import api from "@/lib/api";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: faqData, isLoading, error } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/faq");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !faqData) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">FAQ information not available at the moment.</p>
        </div>
      </div>
    );
  }

  const filteredQuestions = faqData.questions?.filter((q: any) => {
    if (!q.isActive) return false;
    if (!selectedCategory) return true;
    return q.category === selectedCategory;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const categories = faqData.categories || 
    [...new Set(faqData.questions?.map((q: any) => q.category).filter(Boolean))];

  return (
    <div className="pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>
          </div>
          {faqData.introduction && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {faqData.introduction}
            </p>
          )}
        </div>

        {categories && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Filter by Category</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
                className="mb-2"
              >
                All Categories
              </Button>
              {categories.map((category: string) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2"
                >
                  {category}
                  {selectedCategory === category && (
                    <X 
                      className="ml-2 h-3 w-3" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory("");
                      }}
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {filteredQuestions && filteredQuestions.length > 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredQuestions.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div 
                        className="prose max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {selectedCategory 
                  ? `No questions found in the "${selectedCategory}" category.`
                  : "No FAQ questions available at the moment."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {faqData.contactInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you couldn't find the answer to your question, feel free to contact us directly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqData.contactInfo.email && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Us</p>
                      <a 
                        href={`mailto:${faqData.contactInfo.email}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {faqData.contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {faqData.contactInfo.phone && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Call Us</p>
                      <a 
                        href={`tel:${faqData.contactInfo.phone}`}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        {faqData.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}