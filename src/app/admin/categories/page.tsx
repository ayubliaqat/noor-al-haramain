import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCategories } from "@/actions/categories";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function CategoriesPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const canDelete = role === "admin";

  const allCategories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            All Categories
          </h1>
          <p className="mt-1 text-sm text-muted-teal">
            {allCategories.length} categor
            {allCategories.length === 1 ? "y" : "ies"} total
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 rounded-lg bg-emerald px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rich-emerald"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-soft-beige bg-card">
        {allCategories.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-teal">
            No categories yet.{" "}
            <Link href="/admin/categories/new" className="text-emerald hover:underline">
              Create your first one
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-soft-beige bg-warm-white">
              <tr>
                <th className="px-5 py-3 font-medium text-muted-teal">Name</th>
                <th className="px-5 py-3 font-medium text-muted-teal">Slug</th>
                <th className="px-5 py-3 font-medium text-muted-teal">
                  Description
                </th>
                <th className="px-5 py-3 text-right font-medium text-muted-teal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-soft-beige last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {category.name}
                  </td>
                  <td className="px-5 py-3 text-muted-teal">
                    /{category.slug}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-muted-teal">
                    {category.description || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-xs font-medium text-emerald hover:underline"
                      >
                        Edit
                      </Link>
                      {canDelete && (
                        <DeleteCategoryButton
                          id={category.id}
                          name={category.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}