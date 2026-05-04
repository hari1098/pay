"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  Quote,
  Code,
  Minus,
  X,
  Save,
} from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";

import "./editor.css";

export default function TermsAndConditionsPage() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialContentRef = useRef<string>("");
  const lastSavedContentRef = useRef<string>("");
  const isFormattingChangeRef = useRef<boolean>(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["terms-and-conditions"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/terms-and-conditions");
      return data;
    },
  });

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post("/configurations/terms-and-conditions", {
        content,
      });
      return data;
    },
    onSuccess: (_, savedContent) => {
      toast.success("Terms and conditions updated successfully");
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastSavedContentRef.current = savedContent;
      refetch();
    },
    onError: () => {
      toast.error("Failed to update terms and conditions");
    },
  });

  const getPlainText = useCallback((html: string) => {
    return html
      .replace(/<[^>]*>/g, "") 
      .replace(/&nbsp;/g, " ") 
      .replace(/\s+/g, " ") 
      .trim();
  }, []);

  const debouncedSave = useCallback(
    (content: string) => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {

        if (isFormattingChangeRef.current) {
          isFormattingChangeRef.current = false;
          setHasUnsavedChanges(false);
          return;
        }

        const currentText = getPlainText(content);
        const lastSavedText = getPlainText(lastSavedContentRef.current);

        if (currentText !== lastSavedText && currentText.length > 0) {
          update(content);
        } else {
          setHasUnsavedChanges(false);
        }
      }, 3000); 
    },
    [update, getPlainText]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
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
        limit: 10000,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const currentText = getPlainText(html);
      const lastSavedText = getPlainText(lastSavedContentRef.current);

      const hasTextChanged = currentText !== lastSavedText;
      setHasUnsavedChanges(hasTextChanged);

      if (hasTextChanged) {
        debouncedSave(html);
      }
    },
  });

  useEffect(() => {
    if (data && editor && !editor.isDestroyed) {
      const content = data.content || "";
      initialContentRef.current = content;
      lastSavedContentRef.current = content;
      editor.commands.setContent(content);
      setHasUnsavedChanges(false);
    }
  }, [data, editor]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleSave = useCallback(() => {
    if (editor && !editor.isDestroyed) {
      const content = editor.getHTML();
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      update(content);
    }
  }, [editor, update]);

  const handleFormattingClick = useCallback((action: () => void) => {
    isFormattingChangeRef.current = true;
    action();
  }, []);

  const MenuButton = ({
    icon: Icon,
    onClick,
    isActive = false,
    title,
  }: {
    icon: any;
    onClick: () => void;
    isActive?: boolean;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`p-1 h-8 ${isActive ? "bg-muted text-primary" : ""}`}
      onClick={() => handleFormattingClick(onClick)}
      title={title}
      disabled={!editor || editor.isDestroyed}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Failed to load terms and conditions
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">
              Unsaved changes
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={isPending || isLoading || !hasUnsavedChanges}
            className="gap-2"
            variant={hasUnsavedChanges ? "default" : "outline"}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-5/6" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-4/5" />
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
                <MenuButton
                  icon={Bold}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  isActive={editor?.isActive("bold")}
                  title="Bold"
                />
                <MenuButton
                  icon={Italic}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  isActive={editor?.isActive("italic")}
                  title="Italic"
                />
                <MenuButton
                  icon={UnderlineIcon}
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                  isActive={editor?.isActive("underline")}
                  title="Underline"
                />
                <MenuButton
                  icon={Strikethrough}
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  isActive={editor?.isActive("strike")}
                  title="Strikethrough"
                />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <MenuButton
                  icon={Heading1}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor?.isActive("heading", { level: 1 })}
                  title="Heading 1"
                />
                <MenuButton
                  icon={Heading2}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor?.isActive("heading", { level: 2 })}
                  title="Heading 2"
                />
                <MenuButton
                  icon={Heading3}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor?.isActive("heading", { level: 3 })}
                  title="Heading 3"
                />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <MenuButton
                  icon={AlignLeft}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor?.isActive({ textAlign: "left" })}
                  title="Align Left"
                />
                <MenuButton
                  icon={AlignCenter}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor?.isActive({ textAlign: "center" })}
                  title="Align Center"
                />
                <MenuButton
                  icon={AlignRight}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor?.isActive({ textAlign: "right" })}
                  title="Align Right"
                />
                <MenuButton
                  icon={AlignJustify}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("justify").run()
                  }
                  isActive={editor?.isActive({ textAlign: "justify" })}
                  title="Justify"
                />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <MenuButton
                  icon={List}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor?.isActive("bulletList")}
                  title="Bullet List"
                />
                <MenuButton
                  icon={ListOrdered}
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor?.isActive("orderedList")}
                  title="Ordered List"
                />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <MenuButton
                  icon={LinkIcon}
                  onClick={() => {
                    const url = window.prompt("URL");
                    if (url) {
                      editor?.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  isActive={editor?.isActive("link")}
                  title="Add Link"
                />
                <MenuButton
                  icon={Quote}
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor?.isActive("blockquote")}
                  title="Blockquote"
                />
                <MenuButton
                  icon={Code}
                  onClick={() =>
                    editor?.chain().focus().toggleCodeBlock().run()
                  }
                  isActive={editor?.isActive("codeBlock")}
                  title="Code Block"
                />
                <MenuButton
                  icon={Minus}
                  onClick={() =>
                    editor?.chain().focus().setHorizontalRule().run()
                  }
                  title="Horizontal Rule"
                />
                <MenuButton
                  icon={X}
                  onClick={() =>
                    editor?.chain().focus().unsetAllMarks().clearNodes().run()
                  }
                  title="Clear Formatting"
                />
              </div>

              <div className="bg-white">
                <EditorContent editor={editor} />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground border-t">
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
            {isPending && <span className="text-blue-600">Saving...</span>}
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}