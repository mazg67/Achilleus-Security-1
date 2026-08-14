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
import { SeatEditDialog } from "@/components/settings/seat-edit-dialog";
import type { SeatConfig, Guest, SeatType } from "@/lib/database.types";

const TYPE_LABELS: Record<SeatType, string> = { fixed: "Fixed", rotating: "Rotating", host: "Host" };

export function SeatConfigTab({
  seats,
  guests,
}: {
  seats: (SeatConfig & { defaultGuestName: string | null })[];
  guests: Guest[];
}) {
  const [editing, setEditing] = useState<SeatConfig | null>(null);

  return (
    <div className="rounded-xl border border-border overflow-x-auto max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default Guest</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seats.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell className="font-medium">{s.label}</TableCell>
              <TableCell>{TYPE_LABELS[s.type]}</TableCell>
              <TableCell className="text-muted-foreground">{s.defaultGuestName ?? "—"}</TableCell>
              <TableCell className="text-right">
                <Button size="icon-sm" variant="ghost" onClick={() => setEditing(s)}>
                  <Pencil className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <SeatEditDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          seat={editing}
          guests={guests}
        />
      )}
    </div>
  );
}
