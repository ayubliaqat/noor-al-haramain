"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Tag,
  TagIcon,
  Users,
  UserPlus,
  Inbox,
  LogOut,
} from "lucide-react";

type SidebarUser = {
  name: string;
  email: string;
  role: string;
};

const CONTENT_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "All Posts", icon: FileText },
  { href: "/admin/posts/new", label: "Add Post", icon: PlusCircle },
];

const TAXONOMY_LINKS = [
  { href: "/admin/categories", label: "All Categories", icon: Tag },
  { href: "/admin/categories/new", label: "Add Category", icon: TagIcon },
];

// Only shown to admins — editors/authors can't manage users.
const PEOPLE_LINKS = [
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/users/new", label: "Add User", icon: UserPlus },
];

const INBOX_LINKS = [
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export default function AdminSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex w-64 flex-col border-r border-soft-beige bg-card">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-soft-beige px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-deep-teal text-sm font-semibold text-gold">
          N
        </div>
        <span className="text-sm font-semibold text-charcoal">
          Noor Al Haramain
        </span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <NavSection title="Content" links={CONTENT_LINKS} isActive={isActive} />
        <NavSection
          title="Taxonomy"
          links={TAXONOMY_LINKS}
          isActive={isActive}
        />
        {user.role === "admin" && (
          <NavSection title="People" links={PEOPLE_LINKS} isActive={isActive} />
        )}
        <NavSection title="Inbox" links={INBOX_LINKS} isActive={isActive} />
      </nav>

      {/* User + logout */}
      <div className="border-t border-soft-beige p-4">
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-xs font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-charcoal">
              {user.name}
            </p>
            <p className="truncate text-xs capitalize text-muted-teal">
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-teal transition-colors hover:bg-warm-white hover:text-charcoal"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavSection({
  title,
  links,
  isActive,
}: {
  title: string;
  links: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];
  isActive: (href: string, exact?: boolean) => boolean;
}) {
  return (
    <div>
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-teal">
        {title}
      </p>
      <div className="space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald text-white"
                  : "text-charcoal hover:bg-warm-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}