import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // proxy.ts already blocks unauthenticated requests before they reach here,
  // but this is a second, explicit check at the layout level — never trust
  // routing alone for auth. If there's no session, bounce to login.
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-warm-white">
      <AdminSidebar
        user={{
          name: session.user.name ?? "Admin",
          email: session.user.email ?? "",
          role: (session.user as { role?: string }).role ?? "author",
        }}
      />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}