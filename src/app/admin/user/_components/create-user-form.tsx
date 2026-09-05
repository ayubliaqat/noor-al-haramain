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
  createUserSchema,
  userRoles,
  type CreateUserInput,
} from "@/lib/validations/user";
import { createUser } from "@/actions/users";
import { toast } from "sonner";

export function CreateUserForm({
  currentUserRole,
  onSuccess,
  onCancel,
}: {
  currentUserRole: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const canAssignAdmin = currentUserRole === "admin";

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "author" },
  });

  async function onSubmit(values: CreateUserInput) {
    const result = await createUser(values);

    if (result.success) {
      toast.success("User created.");
      onSuccess();
    } else {
      toast.error(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof CreateUserInput, {
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
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          defaultValue={form.getValues("role")}
          onValueChange={(val) =>
            form.setValue("role", val as CreateUserInput["role"])
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
          {form.formState.isSubmitting ? "Saving..." : "Create user"}
        </Button>
      </DialogFooter>
    </form>
  );
}