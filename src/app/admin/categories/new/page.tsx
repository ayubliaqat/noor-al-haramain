"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { createCategory } from "@/actions/categories";

type FormData = {
  name: string;
  slug: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewCategoryPage() {
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const nameValue = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    if (!slugManuallyEdited) {
      setValue("slug", slugify(nameValue ?? ""), {
        shouldValidate: true,
      });
    }
  }, [nameValue, slugManuallyEdited, setValue]);

  async function onSubmit(data: FormData) {
    setServerError("");

    try {
      await createCategory(data);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/categories"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-soft-beige bg-card text-muted-teal transition-colors hover:bg-warm-white hover:text-charcoal"
          aria-label="Back to categories"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            New Category
          </h1>
          <p className="mt-1 text-sm text-muted-teal">
            Create a new category for your posts.
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-2xl border border-soft-beige bg-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-charcoal"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter category name"
              {...register("name", {
                required: "Category name is required",
                minLength: {
                  value: 2,
                  message: "Category name must be at least 2 characters.",
                },
              })}
              className="w-full rounded-lg border border-soft-beige bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-muted-teal/60 focus:border-emerald"
            />

            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-medium text-charcoal"
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              placeholder="category-slug"
              {...register("slug", {
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message:
                    "Slug can only contain lowercase letters, numbers, and hyphens.",
                },
                onChange: () => {
                  setSlugManuallyEdited(true);
                },
              })}
              className="w-full rounded-lg border border-soft-beige bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-muted-teal/60 focus:border-emerald"
            />

            {errors.slug && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.slug.message}
              </p>
            )}

            <p className="mt-1.5 text-xs text-muted-teal">
              The slug is generated automatically from the category name.
            </p>
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-soft-beige pt-5">
            <Link
              href="/admin/categories"
              className="rounded-lg border border-soft-beige bg-white px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-warm-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rich-emerald disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
