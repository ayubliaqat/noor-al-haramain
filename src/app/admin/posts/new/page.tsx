import { getCategories } from "@/actions/categories";
import { getTags } from "@/actions/tags";
import NewPostForm from "@/components/admin/NewPostForm";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Post</h1>
      <NewPostForm categories={categories} tags={tags} />
    </div>
  );
}