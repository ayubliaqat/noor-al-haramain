import { getUsers } from "@/actions/users";
import { getSessionWithRole } from "@/lib/session";
import { UserTable } from "./_components/user-table";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getSessionWithRole();

  if (!session || !["admin", "editor"].includes(session.role ?? "")) {
    redirect("/login");
  }

  const users = await getUsers();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage admin dashboard users and their roles.
          </p>
        </div>
      </div>

      <UserTable
        users={users}
        currentUserId={session.userId}
        currentUserRole={session.role}
      />
    </div>
  );
}