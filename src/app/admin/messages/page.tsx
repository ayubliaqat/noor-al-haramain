import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/session";
import { getMessages } from "@/actions/messages";
import InboxList from "@/components/admin/InboxList";

export default async function MessagesPage() {
  const session = await getSessionWithRole();

  if (!session || (session.role !== "admin" && session.role !== "editor")) {
    redirect("/admin");
  }

  const messages = await getMessages();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h1>
      <InboxList
        messages={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          isRead: m.isRead,
          createdAt: m.createdAt.toISOString(),
        }))}
        canDelete={session.role === "admin"}
      />
    </div>
  );
}