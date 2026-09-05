"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/categories";

export default function DeleteCategoryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}