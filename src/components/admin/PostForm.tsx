"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPost, updatePost } from "@/actions/posts";
import { uploadImage } from "@/actions/upload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Loader2, Upload, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

// Shape of an existing post, passed in when editing.
// ASSUMPTION: adjust field names here if getPostById() returns different keys.
export interface PostInitialData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  heroImage: string;
  featured: boolean;
  status: "draft" | "published" | "scheduled";
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
  noIndex: boolean;
}

interface PostFormProps {
  categories: Category[];
  tags: Tag[];
  initialData?: PostInitialData;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostForm({ categories, tags, initialData }: PostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(initialData);

  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  // In edit mode, treat the slug as already "touched" so title edits don't silently rewrite it.
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tagIds ?? []);
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(initialData?.status ?? "draft");

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl ?? "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage ?? "");
  const [noIndex, setNoIndex] = useState(initialData?.noIndex ?? false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(slugify(value));
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleHeroImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    setIsUploading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setHeroImage(result.url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tagIds: selectedTagIds,
      heroImage,
      featured,
      status,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      canonicalUrl,
      ogImage: ogImage || heroImage,
      noIndex,
    };

    startTransition(async () => {
      const result = isEditMode
        ? await updatePost({ id: initialData!.id, ...payload })
        : await createPost(payload);

      if (!result.success) {
        setError(result.message ?? `Failed to ${isEditMode ? "update" : "create"} post`);
        return;
      }

      router.push("/admin/posts");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. A Complete Guide to Umrah for First-Timers"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="a-complete-guide-to-umrah"
          />
          <p className="mt-1 text-xs text-gray-500">/blog/{slug || "your-slug-here"}</p>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="A short summary shown on listing pages"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Hero image */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
        <label className="block text-sm font-medium text-gray-700">Hero Image</label>

        {heroImage ? (
          <div className="relative w-full max-w-md">
            <Image
              src={heroImage}
              alt="Hero preview"
              width={480}
              height={270}
              className="rounded-lg object-cover w-full h-auto border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setHeroImage("")}
              className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 w-full max-w-md justify-center"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Click to upload an image
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleHeroImageSelect}
          className="hidden"
        />
      </div>

      {/* Category, tags, featured, status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published" | "scheduled")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500">No tags yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      active
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Featured post
          </label>
        </div>
      </div>

      {/* SEO section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900">SEO</h2>

        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={title || "Defaults to post title"}
          />
        </div>

        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={excerpt || "Defaults to excerpt"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="focusKeyword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Focus Keyword
            </label>
            <input
              id="focusKeyword"
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="canonicalUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Canonical URL
            </label>
            <input
              id="canonicalUrl"
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-1">
            OG Image URL
          </label>
          <input
            id="ogImage"
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={heroImage || "Defaults to hero image"}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="noIndex"
            type="checkbox"
            checked={noIndex}
            onChange={(e) => setNoIndex(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="noIndex" className="text-sm text-gray-700">
            Noindex (hide from search engines)
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Create Post"}
        </button>
      </div>
    </form>
  );
}