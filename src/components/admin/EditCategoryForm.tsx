"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editCategorySchema,
  type EditCategoryInput,
} from "@/lib/validations/category";
import { updateCategory } from "@/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default function EditCategoryForm({
  category,
}: {
  category: Category;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCategoryInput>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
    },
  });

  async function onSubmit(data: EditCategoryInput) {
    setServerError(null);
    setIsSubmitting(true);

    const result = await updateCategory(data);

    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-soft-beige bg-card p-6"
    >
      <input type="hidden" {...register("id")} />

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-lg border border-soft-beige bg-warm-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          Slug
        </label>
        <input
          id="slug"
          type="text"
          {...register("slug")}
          className="w-full rounded-lg border border-soft-beige bg-warm-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          Description{" "}
          <span className="font-normal text-muted-teal">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="w-full rounded-lg border border-soft-beige bg-warm-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rich-emerald disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-lg border border-soft-beige px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-warm-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}