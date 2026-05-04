"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Save, Eye, AlertCircle, Type } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";

interface SearchSlogan {
  _id?: string;
  primarySlogan: string;
  secondarySlogan?: string;
  isActive: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface SearchSloganForm {
  primarySlogan: string;
  secondarySlogan: string;
}

export default function SearchSloganConfig() {
  const [formData, setFormData] = useState<SearchSloganForm>({
    primarySlogan: "",
    secondarySlogan: ""
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const queryClient = useQueryClient();

  const { data: currentSlogan, isLoading, error } = useQuery({
    queryKey: ["search-slogan"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/search-slogan");
      return data as SearchSlogan;
    }
  });

  const updateSloganMutation = useMutation({
    mutationFn: async (sloganData: SearchSloganForm) => {
      const { data } = await api.post("/configurations/search-slogan", sloganData);
      return data;
    },
    onSuccess: () => {
      toast.success("Search slogan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["search-slogan"] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update search slogan");
    }
  });

  useEffect(() => {
    if (currentSlogan) {
      setFormData({
        primarySlogan: currentSlogan.primarySlogan,
        secondarySlogan: currentSlogan.secondarySlogan || ""
      });
      setHasChanges(false);
    }
  }, [currentSlogan]);

  const handleFormChange = (field: keyof SearchSloganForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSloganMutation.mutate(formData);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load search slogan configuration. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Page Slogan Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <div className="space-y-6">
              {currentSlogan && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-blue-900">
                      {currentSlogan.primarySlogan}
                    </h2>
                    {currentSlogan.secondarySlogan && (
                      <p className="text-blue-700 text-lg">
                        {currentSlogan.secondarySlogan}
                      </p>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      Current Active Slogan
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primarySlogan" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Primary Slogan
                  </Label>
                  <Input
                    id="primarySlogan"
                    value={formData.primarySlogan}
                    onChange={(e) => handleFormChange("primarySlogan", e.target.value)}
                    placeholder="Enter primary slogan (e.g., 'Find Your Perfect Ad Solution')"
                    maxLength={100}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.primarySlogan.length}/100 characters
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondarySlogan">
                    Secondary Slogan (Optional)
                  </Label>
                  <Textarea
                    id="secondarySlogan"
                    value={formData.secondarySlogan}
                    onChange={(e) => handleFormChange("secondarySlogan", e.target.value)}
                    placeholder="Enter secondary slogan for additional context (e.g., 'Browse thousands of verified listings')"
                    maxLength={200}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.secondarySlogan.length}/200 characters
                  </div>
                </div>
              </div>

              {showPreview && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border rounded-lg p-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formData.primarySlogan || "Your Primary Slogan"}
                      </h2>
                      {formData.secondarySlogan && (
                        <p className="text-gray-700 text-lg">
                          {formData.secondarySlogan}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
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
                    disabled={!hasChanges || updateSloganMutation.isPending || !formData.primarySlogan.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateSloganMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {currentSlogan && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span>
                      Last updated: {format(new Date(currentSlogan.lastUpdated), "PPpp")}
                    </span>
                    <span>
                      Updated by: {currentSlogan.updatedBy}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}