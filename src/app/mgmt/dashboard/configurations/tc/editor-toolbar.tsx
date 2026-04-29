"use client";

import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

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
      onClick={onClick}
      title={title}
      disabled={!editor || editor.isDestroyed}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
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
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
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
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor?.isActive("heading", { level: 1 })}
        title="Heading 1"
      />
      <MenuButton
        icon={Heading2}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor?.isActive("heading", { level: 2 })}
        title="Heading 2"
      />
      <MenuButton
        icon={Heading3}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor?.isActive("heading", { level: 3 })}
        title="Heading 3"
      />
      <div className="w-px h-6 bg-border mx-1 self-center" />
      <MenuButton
        icon={AlignLeft}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        isActive={editor?.isActive({ textAlign: "left" })}
        title="Align Left"
      />
      <MenuButton
        icon={AlignCenter}
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        isActive={editor?.isActive({ textAlign: "center" })}
        title="Align Center"
      />
      <MenuButton
        icon={AlignRight}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        isActive={editor?.isActive({ textAlign: "right" })}
        title="Align Right"
      />
      <MenuButton
        icon={AlignJustify}
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        isActive={editor?.isActive({ textAlign: "justify" })}
        title="Justify"
      />
      <div className="w-px h-6 bg-border mx-1 self-center" />
      <MenuButton
        icon={List}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive("bulletList")}
        title="Bullet List"
      />
      <MenuButton
        icon={ListOrdered}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
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
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        isActive={editor?.isActive("blockquote")}
        title="Blockquote"
      />
      <MenuButton
        icon={Code}
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        isActive={editor?.isActive("codeBlock")}
        title="Code Block"
      />
      <MenuButton
        icon={Minus}
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      />
      <MenuButton
        icon={X}
        onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Clear Formatting"
      />
    </div>
  );
}