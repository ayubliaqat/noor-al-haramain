import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getPosts } from "@/actions/posts";
import PostDeleteButton from "@/components/admin/PostDeleteButton";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald/10 text-emerald",
  draft: "bg-gold/10 text-gold",
  scheduled: "bg-deep-teal/10 text-deep-teal",
};

export default async function PostsPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const canDelete = role === "admin" || role === "editor";

  const allPosts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            All Posts
          </h1>

          <p className="mt-1 text-sm text-muted-teal">
            {allPosts.length} post{allPosts.length === 1 ? "" : "s"} total
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-lg bg-emerald px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rich-emerald"
        >
          <Plus className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-soft-beige bg-card">
        {allPosts.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-teal">
            No posts yet.{" "}
            <Link
              href="/admin/posts/new"
              className="text-emerald hover:underline"
            >
              Write your first one
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-soft-beige bg-warm-white">
              <tr>
                <th className="px-5 py-3 font-medium text-muted-teal">
                  Title
                </th>

                <th className="px-5 py-3 font-medium text-muted-teal">
                  Category
                </th>

                <th className="px-5 py-3 font-medium text-muted-teal">
                  Author
                </th>

                <th className="px-5 py-3 font-medium text-muted-teal">
                  Status
                </th>

                <th className="px-5 py-3 font-medium text-muted-teal">
                  Date
                </th>

                <th className="px-5 py-3 text-right font-medium text-muted-teal">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {allPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-soft-beige last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {post.title}

                    {post.featured && (
                      <span className="ml-2 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                        FEATURED
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3 text-muted-teal">
                    {post.categoryName ?? "—"}
                  </td>

                  <td className="px-5 py-3 text-muted-teal">
                    {post.authorName ?? "—"}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        STATUS_STYLES[post.status] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-muted-teal">
                    {new Date(post.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs font-medium text-emerald hover:underline"
                      >
                        Edit
                      </Link>

                      {canDelete && (
                        <PostDeleteButton
                          id={post.id}
                          title={post.title}
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
