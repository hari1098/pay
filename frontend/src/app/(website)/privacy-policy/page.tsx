"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Calendar, User, FileText } from "lucide-react";
import api from "@/lib/api";

export default function PrivacyPolicyPage() {
  const { data: privacyData, isLoading, error } = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/privacy-policy");
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

  if (error || !privacyData) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Privacy policy not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {privacyData.version && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Version</p>
                    <p className="font-semibold">{privacyData.version}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {privacyData.effectiveDate && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Effective Date</p>
                    <p className="font-semibold">
                      {new Date(privacyData.effectiveDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {privacyData.lastUpdated && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-semibold">
                      {new Date(privacyData.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            {privacyData.content ? (
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: privacyData.content }}
              />
            ) : (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Privacy policy content is being updated.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Your Privacy Matters</h3>
                <p className="text-sm text-green-800">
                  We are committed to protecting your personal information and your right to privacy. 
                  If you have any questions or concerns about our policy or our practices regarding 
                  your personal information, please contact us.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                By using our service, you acknowledge that you have read and understood this privacy policy.
              </p>
              {privacyData.updatedBy && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>Last updated by: {privacyData.updatedBy}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}