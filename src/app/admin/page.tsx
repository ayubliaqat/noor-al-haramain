import { auth } from "@/lib/auth";
import StatCard from "@/components/admin/StatCard";

// TODO: once the `posts` and `categories` tables are built, replace these
// placeholders with real Drizzle queries (counts, group by category, etc.)
const PLACEHOLDER_STATS = {
  totalPosts: 0,
  published: 0,
  drafts: 0,
  scheduled: 0,
  totalCategories: 0,
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-teal">
          Welcome back, {name}. Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Content Overview */}
      <div className="rounded-2xl border border-soft-beige bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold text-charcoal">
          Content Overview
        </h2>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-emerald text-center">
            <span className="text-2xl font-bold text-charcoal">
              {PLACEHOLDER_STATS.totalPosts}
            </span>
            <span className="text-[11px] text-muted-teal">Total Posts</span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:max-w-xs">
            <StatCard
              label="Published"
              value={PLACEHOLDER_STATS.published}
              color="emerald"
            />
            <StatCard
              label="Drafts"
              value={PLACEHOLDER_STATS.drafts}
              color="gold"
            />
            <StatCard
              label="Scheduled"
              value={PLACEHOLDER_STATS.scheduled}
              color="deep-teal"
            />
          </div>
        </div>
      </div>

      {/* Posts by Category — placeholder until categories table exists */}
      <div className="rounded-2xl border border-soft-beige bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold text-charcoal">
          Posts by Category
        </h2>
        <p className="text-sm text-muted-teal">
          No categories yet — this will populate once categories are added.
        </p>
      </div>
    </div>
  );
}