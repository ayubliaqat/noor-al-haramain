import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import EditCategoryForm from "@/components/admin/EditCategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">
          Edit Category
        </h1>
        <p className="mt-1 text-sm text-muted-teal">
          Update details for &quot;{category.name}&quot;.
        </p>
      </div>

      <EditCategoryForm category={category} />
    </div>
  );
}