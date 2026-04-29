"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, History, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";

import { EditorToolbar } from "../tc/editor-toolbar";
import "../tc/editor.css";

interface PrivacyPolicy {
  _id?: string;
  content: string;
  version: string;
  effectiveDate: Date;
  isActive: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface PrivacyPolicyForm {
  content: string;
  version: string;
  effectiveDate: string;
}

export default function PrivacyPolicyConfig() {
  const [formData, setFormData] = useState<PrivacyPolicyForm>({
    content: "",
    version: "1.0",
    effectiveDate: new Date().toISOString().split('T')[0]
  });
  const [showHistory, setShowHistory] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const queryClient = useQueryClient();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: currentPolicy, isLoading, error } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/privacy-policy");
      return data as PrivacyPolicy;
    }
  });

  const { data: policyHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["privacy-policy-history"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/privacy-policy/history");
      return data as PrivacyPolicy[];
    },
    enabled: showHistory
  });

  const updatePolicyMutation = useMutation({
    mutationFn: async (policyData: PrivacyPolicyForm) => {
      const { data } = await api.post("/configurations/privacy-policy", policyData);
      return data;
    },
    onSuccess: () => {
      toast.success("Privacy policy updated successfully");
      queryClient.invalidateQueries({ queryKey: ["privacy-policy"] });
      queryClient.invalidateQueries({ queryKey: ["privacy-policy-history"] });
      setHasChanges(false);
      setLastSaved(new Date());
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update privacy policy");
    }
  });

  const debouncedSave = useCallback(
    (content: string) => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        if (content !== currentPolicy?.content && content.trim().length > 0) {
          const updatedFormData = { ...formData, content };
          updatePolicyMutation.mutate(updatedFormData);
        }
      }, 3000);
    },
    [formData, currentPolicy?.content, updatePolicyMutation]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      CharacterCount.configure({
        limit: 20000,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({ ...prev, content: html }));
      setHasChanges(true);
      debouncedSave(html);
    },
  });

  useEffect(() => {
    if (currentPolicy) {
      const effectiveDate = new Date(currentPolicy.effectiveDate).toISOString().split('T')[0];
      setFormData({
        content: currentPolicy.content,
        version: currentPolicy.version,
        effectiveDate
      });
      
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(currentPolicy.content);
      }
      
      setHasChanges(false);
    }
  }, [currentPolicy, editor]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleFormChange = (field: keyof PrivacyPolicyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      const updatedFormData = { ...formData, content };
      updatePolicyMutation.mutate(updatedFormData);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load privacy policy configuration. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Policy Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-64" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleFormChange("version", e.target.value)}
                    placeholder="e.g., 1.0, 2.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleFormChange("effectiveDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Privacy Policy Content</Label>
                <div className="border rounded-md overflow-hidden">
                  <EditorToolbar editor={editor} />
                  
                  <div className="bg-white min-h-[400px]">
                    <EditorContent editor={editor} />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground border-t px-3 py-2">
                    <div>
                      {editor && (
                        <>
                          {editor.storage.characterCount.characters()} characters
                          &nbsp;·&nbsp;
                          {editor.storage.characterCount.words()} words
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {updatePolicyMutation.isPending && (
                        <span className="text-blue-600">Saving...</span>
                      )}
                      {lastSaved && (
                        <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                      )}
                    </div>
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
                    disabled={!hasChanges || updatePolicyMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updatePolicyMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {currentPolicy && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Current Version:</span> {currentPolicy.version}
                    </div>
                    <div>
                      <span className="font-medium">Effective Date:</span> {format(new Date(currentPolicy.effectiveDate), "PP")}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {format(new Date(currentPolicy.lastUpdated), "PP")}
                    </div>
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
              Privacy Policy History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : policyHistory && policyHistory.length > 0 ? (
              <div className="space-y-4">
                {policyHistory.map((policy, index) => (
                  <div key={policy._id || index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {index === 0 ? "Current" : `v${policy.version}`}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Effective: {format(new Date(policy.effectiveDate), "PP")}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Updated: {format(new Date(policy.lastUpdated), "PPpp")} by {policy.updatedBy}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-3">
                      <div dangerouslySetInnerHTML={{ __html: policy.content.substring(0, 300) + "..." }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No privacy policy history available
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}