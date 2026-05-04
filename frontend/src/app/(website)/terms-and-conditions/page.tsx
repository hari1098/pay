"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Calendar, User } from "lucide-react";
import api from "@/lib/api";

export default function TermsAndConditionsPage() {
  const { data: termsData, isLoading, error } = useQuery({
    queryKey: ["termsAndConditions"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/terms-and-conditions");
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
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !termsData) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600">Terms and conditions not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ScrollText className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Terms and Conditions
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {termsData.version && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Version</p>
                    <p className="font-semibold">{termsData.version}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {termsData.effectiveDate && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Effective Date</p>
                    <p className="font-semibold">
                      {new Date(termsData.effectiveDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {termsData.lastUpdated && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-semibold">
                      {new Date(termsData.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            {termsData.content ? (
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: termsData.content }}
              />
            ) : (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Terms and conditions content is being updated.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                By using our service, you agree to these terms and conditions.
              </p>
              {termsData.updatedBy && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>Last updated by: {termsData.updatedBy}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}