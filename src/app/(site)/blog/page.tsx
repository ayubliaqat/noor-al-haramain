import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries/posts";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const metadata = {
  title: "Blog — Noor Al Haramain",
  description:
    "Practical guides, tips and inspiring stories to help you prepare for Hajj and Umrah with confidence.",
};

export default async function BlogPage() {
  const allPosts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-deep-teal">
          All Articles
        </h1>
        <p className="mt-2 text-sm text-muted-teal">
          {allPosts.length} article{allPosts.length === 1 ? "" : "s"} to guide
          your journey
        </p>
      </div>

      {allPosts.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-soft-beige text-sm text-muted-teal">
          No articles published yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-soft-beige bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[16/10]">
                {post.heroImage ? (
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt ?? post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="h-full w-full bg-deep-teal" />
                )}
              </div>

              <div className="p-5">
                {post.categoryName && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald">
                    {post.categoryName}
                  </span>
                )}

                <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-charcoal transition-colors group-hover:text-emerald">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-teal">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-teal">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                  {post.readTimeMinutes && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTimeMinutes} min read
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}