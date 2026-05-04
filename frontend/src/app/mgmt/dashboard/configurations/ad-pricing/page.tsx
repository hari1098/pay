"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Save, History, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";

interface AdPricing {
  _id?: string;
  lineAdPrice: number;
  posterAdPrice: number;
  videoAdPrice: number;
  currency: string;
  isActive: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface AdPricingForm {
  lineAdPrice: number;
  posterAdPrice: number;
  videoAdPrice: number;
  currency: string;
}

export default function AdPricingConfig() {
  const [formData, setFormData] = useState<AdPricingForm>({
    lineAdPrice: 0,
    posterAdPrice: 0,
    videoAdPrice: 0,
    currency: "INR"
  });
  const [showHistory, setShowHistory] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const queryClient = useQueryClient();

  const { data: currentPricing, isLoading, error } = useQuery({
    queryKey: ["ad-pricing"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/ad-pricing");
      return data as AdPricing;
    }
  });

  const { data: pricingHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["ad-pricing-history"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/ad-pricing/history");
      return data as AdPricing[];
    },
    enabled: showHistory
  });

  const updatePricingMutation = useMutation({
    mutationFn: async (pricingData: AdPricingForm) => {
      const { data } = await api.post("/configurations/ad-pricing", pricingData);
      return data;
    },
    onSuccess: () => {
      toast.success("Ad pricing updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ad-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["ad-pricing-history"] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update ad pricing");
    }
  });

  useEffect(() => {
    if (currentPricing) {
      setFormData({
        lineAdPrice: currentPricing.lineAdPrice,
        posterAdPrice: currentPricing.posterAdPrice,
        videoAdPrice: currentPricing.videoAdPrice,
        currency: currentPricing.currency
      });
      setHasChanges(false);
    }
  }, [currentPricing]);

  const handleFormChange = (field: keyof AdPricingForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePricingMutation.mutate(formData);
  };

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load ad pricing configuration. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Ad Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Line Ads</p>
                        <p className="text-2xl font-bold text-blue-800">
                          {formatCurrency(currentPricing?.lineAdPrice || 0, currentPricing?.currency)}
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Poster Ads</p>
                        <p className="text-2xl font-bold text-green-800">
                          {formatCurrency(currentPricing?.posterAdPrice || 0, currentPricing?.currency)}
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Video Ads</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {formatCurrency(currentPricing?.videoAdPrice || 0, currentPricing?.currency)}
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lineAdPrice">Line Ad Price</Label>
                    <Input
                      id="lineAdPrice"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.lineAdPrice}
                      onChange={(e) => handleFormChange("lineAdPrice", parseFloat(e.target.value) || 0)}
                      placeholder="Enter line ad price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="posterAdPrice">Poster Ad Price</Label>
                    <Input
                      id="posterAdPrice"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.posterAdPrice}
                      onChange={(e) => handleFormChange("posterAdPrice", parseFloat(e.target.value) || 0)}
                      placeholder="Enter poster ad price"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoAdPrice">Video Ad Price</Label>
                    <Input
                      id="videoAdPrice"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.videoAdPrice}
                      onChange={(e) => handleFormChange("videoAdPrice", parseFloat(e.target.value) || 0)}
                      placeholder="Enter video ad price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleFormChange("currency", value)}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  {showHistory ? "Hide" : "Show"} History
                </Button>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <span className="text-sm text-muted-foreground">
                      Unsaved changes
                    </span>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || updatePricingMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updatePricingMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {currentPricing && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span>
                      Last updated: {format(new Date(currentPricing.lastUpdated), "PPpp")}
                    </span>
                    <span>
                      Updated by: {currentPricing.updatedBy}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Pricing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : pricingHistory && pricingHistory.length > 0 ? (
              <div className="space-y-4">
                {pricingHistory.map((pricing, index) => (
                  <div key={pricing._id || index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {index === 0 ? "Current" : `Version ${pricingHistory.length - index}`}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(pricing.lastUpdated), "PPpp")}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        By: {pricing.updatedBy}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Line Ads:</span> {formatCurrency(pricing.lineAdPrice, pricing.currency)}
                      </div>
                      <div>
                        <span className="font-medium">Poster Ads:</span> {formatCurrency(pricing.posterAdPrice, pricing.currency)}
                      </div>
                      <div>
                        <span className="font-medium">Video Ads:</span> {formatCurrency(pricing.videoAdPrice, pricing.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pricing history available
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}