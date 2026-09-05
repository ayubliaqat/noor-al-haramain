"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markMessageAsRead, markMessageAsUnread, deleteMessage } from "@/actions/messages";
import { ChevronDown, ChevronUp, Trash2, Loader2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MessagesListProps {
  messages: Message[];
  canDelete: boolean;
}

export default function InboxList({ messages, canDelete }: MessagesListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleExpand(msg: Message) {
    const opening = expandedId !== msg.id;
    setExpandedId(opening ? msg.id : null);

    // Mark as read the moment it's opened, if it wasn't already.
    if (opening && !msg.isRead) {
      startTransition(async () => {
        await markMessageAsRead(msg.id);
        router.refresh();
      });
    }
  }

  function toggleRead(e: React.MouseEvent, msg: Message) {
    e.stopPropagation();
    startTransition(async () => {
      if (msg.isRead) {
        await markMessageAsUnread(msg.id);
      } else {
        await markMessageAsRead(msg.id);
      }
      router.refresh();
    });
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!window.confirm("Delete this message? This can't be undone.")) return;

    startTransition(async () => {
      await deleteMessage(id);
      router.refresh();
    });
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
      {messages.map((msg) => {
        const isExpanded = expandedId === msg.id;
        return (
          <div key={msg.id}>
            <button
              type="button"
              onClick={() => toggleExpand(msg)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                !msg.isRead ? "bg-emerald-50/50" : ""
              }`}
            >
              <span className="flex-shrink-0">
                {msg.isRead ? (
                  <MailOpen size={16} className="text-gray-400" />
                ) : (
                  <Mail size={16} className="text-emerald-600" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!msg.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                    {msg.name}
                  </span>
                  <span className="text-xs text-gray-400">{msg.email}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {msg.subject || "(no subject)"}
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
              {isExpanded ? (
                <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pl-11">
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{msg.message}</p>
                <div className="flex items-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={(e) => toggleRead(e, msg)}
                    disabled={isPending}
                    className="text-emerald-700 hover:underline disabled:opacity-50"
                  >
                    Mark as {msg.isRead ? "unread" : "read"}
                  </button>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-emerald-700 hover:underline"
                  >
                    Reply by email
                  </a>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, msg.id)}
                      disabled={isPending}
                      className="flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                    >
                      {isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}