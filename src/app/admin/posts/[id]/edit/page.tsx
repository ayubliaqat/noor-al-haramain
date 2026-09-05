import { notFound } from "next/navigation";
import { getPostById } from "@/actions/posts";
import { getCategories } from "@/actions/categories";
import { getTags, getPostTagIds } from "@/actions/tags";
import PostForm, { type PostInitialData } from "@/components/admin/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    getPostById(id),
    getCategories(),
    getTags(),
  ]);

  if (!post) {
    notFound();
  }

  // Tags aren't joined into getPostById's result, so fetch them separately
  // via the post_tags junction table.
  const tagIds = await getPostTagIds(post.id);

  const initialData: PostInitialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    categoryId: post.categoryId,
    tagIds,
    heroImage: post.heroImage ?? "",
    featured: post.featured,
    status: post.status,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    focusKeyword: post.focusKeyword ?? "",
    canonicalUrl: post.canonicalUrl ?? "",
    ogImage: post.ogImage ?? "",
    noIndex: post.noIndex,
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>
      <PostForm categories={categories} tags={tags} initialData={initialData} />
    </div>
  );
}