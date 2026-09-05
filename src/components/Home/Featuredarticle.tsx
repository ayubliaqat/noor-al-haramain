import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getFeaturedPost } from "@/lib/queries/posts";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function FeaturedArticle() {
  const post = await getFeaturedPost();

  if (!post) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-soft-beige bg-card text-sm text-muted-teal">
        No featured article yet — mark a published post as &quot;Featured&quot;
        in the admin dashboard.
      </div>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-soft-beige bg-card shadow-sm transition-shadow hover:shadow-md sm:grid-cols-2"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto">
        {post.heroImage ? (
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-deep-teal" />
        )}
      </div>

      <div className="flex flex-col justify-center p-6">
        {post.categoryName && (
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald">
            {post.categoryName}
          </span>
        )}

        <h2 className="mt-2 text-xl font-semibold leading-snug text-charcoal transition-colors group-hover:text-emerald sm:text-2xl">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-muted-teal">
            {post.excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-teal">
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

          <span className="flex items-center gap-1 text-sm font-medium text-emerald">
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}