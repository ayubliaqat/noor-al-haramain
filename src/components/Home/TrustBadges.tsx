import {
  ShieldCheck,
  BookOpenCheck,
  ListChecks,
  UserCheck,
  RefreshCcw,
} from "lucide-react";

type Accent = "emerald" | "gold";

type Badge = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  accent: Accent;
};

const badges: Badge[] = [
  {
    icon: ShieldCheck,
    title: "Authentic Sources",
    description: "Carefully researched from trusted Islamic references",
    accent: "emerald",
  },
  {
    icon: BookOpenCheck,
    title: "Qur'an & Sunnah",
    description: "Guidance based on the Qur'an and authentic Sunnah",
    accent: "gold",
  },
  {
    icon: ListChecks,
    title: "Practical Guidance",
    description: "Clear, step-by-step help for every stage",
    accent: "emerald",
  },
  {
    icon: UserCheck,
    title: "Reviewed by Experts",
    description: "Content reviewed for accuracy and clarity",
    accent: "gold",
  },
  {
    icon: RefreshCcw,
    title: "Clear & Verified",
    description: "Important guidance is carefully checked",
    accent: "emerald",
  },
];

const ACCENT_STYLES: Record<
  Accent,
  { bg: string; icon: string; ring: string }
> = {
  emerald: {
    bg: "bg-emerald/10",
    icon: "text-emerald",
    ring: "group-hover:ring-emerald/20",
  },
  gold: {
    bg: "bg-gold/10",
    icon: "text-gold",
    ring: "group-hover:ring-gold/20",
  },
};

export function TrustBadges() {
  return (
    <section className="bg-warm-white py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-5">
        {badges.map(({ icon: Icon, title, description, accent }, index) => {
          const styles = ACCENT_STYLES[accent];
          const lift = index % 2 === 1 ? "lg:-translate-y-1.5" : "";

          return (
            <div
              key={title}
              className={`group flex flex-col items-center rounded-xl border border-soft-beige bg-card px-3 py-4 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.09)] ${styles.ring} ${lift}`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${styles.bg} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-4 w-4 ${styles.icon}`} />
              </div>

              <p className="mt-2 text-xs font-semibold text-charcoal">
                {title}
              </p>

              <p className="mt-0.5 text-[11px] leading-snug text-muted-teal">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}