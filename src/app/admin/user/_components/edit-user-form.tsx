"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  editUserSchema,
  userRoles,
  type EditUserInput,
} from "@/lib/validations/user";
import { editUser } from "@/actions/users";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "editor" | "author";
};

export function EditUserForm({
  user,
  currentUserRole,
  onSuccess,
  onCancel,
}: {
  user: User;
  currentUserRole: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const canAssignAdmin = currentUserRole === "admin";

  const form = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name ?? "",
      role: user.role,
    },
  });

  async function onSubmit(values: EditUserInput) {
    const result = await editUser(values);

    if (result.success) {
      toast.success("User updated.");
      onSuccess();
    } else {
      toast.error(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof EditUserInput, {
            message: messages?.[0],
          });
        }
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user.email} disabled />
        <p className="text-xs text-muted-foreground">
          Email can&apos;t be changed here.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          defaultValue={form.getValues("role")}
          onValueChange={(val) =>
            form.setValue("role", val as EditUserInput["role"])
          }
        >
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {userRoles.map((role) => (
              <SelectItem
                key={role}
                value={role}
                disabled={role === "admin" && !canAssignAdmin}
              >
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}