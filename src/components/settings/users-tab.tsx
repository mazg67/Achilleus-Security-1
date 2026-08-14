"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { UserEditDialog } from "@/components/settings/user-edit-dialog";
import type { UserRow } from "@/lib/queries/settings";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-brand-red text-white",
  editor: "bg-brand-amber text-brand-black",
  viewer: "bg-muted text-muted-foreground",
};

export function UsersTab({ users }: { users: UserRow[] }) {
  const [editing, setEditing] = useState<UserRow | null>(null);

  return (
    <div className="rounded-xl border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell className="text-muted-foreground">{u.email}</TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[u.role]}`}>
                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button size="icon-sm" variant="ghost" onClick={() => setEditing(u)}>
                  <Pencil className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <UserEditDialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)} user={editing} />
      )}
    </div>
  );
}
