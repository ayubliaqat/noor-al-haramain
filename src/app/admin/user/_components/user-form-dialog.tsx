// src/app/admin/user/_components/user-form-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateUserForm } from "./create-user-form";
import { EditUserForm } from "./edit-user-form";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "editor" | "author";
};

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  currentUserRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  currentUserRole: string;
}) {
  const isEdit = !!user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "New user"}</DialogTitle>
        </DialogHeader>

        {isEdit ? (
          <EditUserForm
            user={user!}
            currentUserRole={currentUserRole}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <CreateUserForm
            currentUserRole={currentUserRole}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}