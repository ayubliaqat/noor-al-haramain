"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/actions/posts";

type PostDeleteButtonProps = {
  id: string;
  title: string;
};

export default function PostDeleteButton({
  id,
  title,
}: PostDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      try {
        await deletePost(id);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete the post.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <span className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
