"use client";

import { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Quote,
  Minus,
  ChevronDown,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [headingMenuOpen, setHeadingMenuOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-emerald-700 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none min-h-[300px] focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-2 rounded hover:bg-gray-100 ${active ? "bg-gray-200 text-emerald-700" : "text-gray-600"}`;

  const activeHeadingLevel = HEADING_LEVELS.find((level) =>
    editor.isActive("heading", { level })
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 px-2 py-1 relative">
        {/* Paragraph / Heading dropdown (P, H1-H6) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setHeadingMenuOpen((v) => !v)}
            className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 text-sm font-medium min-w-[72px]"
            title="Paragraph style"
          >
            {activeHeadingLevel ? `H${activeHeadingLevel}` : "Paragraph"}
            <ChevronDown size={14} />
          </button>
          {headingMenuOpen && (
            <div className="absolute z-10 top-full left-0 mt-1 w-36 rounded-md border border-gray-200 bg-white shadow-lg py-1">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setHeadingMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
                  editor.isActive("paragraph") ? "text-emerald-700 font-medium" : "text-gray-700"
                }`}
              >
                Paragraph
              </button>
              {HEADING_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level }).run();
                    setHeadingMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
                    editor.isActive("heading", { level })
                      ? "text-emerald-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Heading {level}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={btnClass(editor.isActive("code"))}
          title="Inline code"
        >
          <Code size={16} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          title="Bullet list"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          title="Numbered list"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive("blockquote"))}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass(false)}
          title="Horizontal rule"
        >
          <Minus size={16} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={btnClass(editor.isActive("link"))}
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className={btnClass(false)}
          title="Insert image by URL"
        >
          <ImageIcon size={16} />
        </button>

        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className={btnClass(false)}
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className={btnClass(false)}
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}