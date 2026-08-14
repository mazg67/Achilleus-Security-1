"use client";

import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Check, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest } from "@/lib/database.types";

export function GuestPicker({
  guests,
  value,
  onChange,
  onAddNew,
}: {
  guests: Guest[];
  value: string | null;
  onChange: (guestId: string | null) => void;
  onAddNew?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = guests.find((g) => g.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) => g.name.toLowerCase().includes(q) || g.company?.toLowerCase().includes(q),
    );
  }, [guests, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-between font-normal" type="button" />
        }
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? `${selected.name}${selected.company ? ` · ${selected.company}` : ""}` : "Select a guest…"}
        </span>
        <ChevronsUpDown className="size-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-2 border-b border-border">
          <Input
            autoFocus
            placeholder="Search guests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          <button
            type="button"
            className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted text-left"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Unassigned
          </button>
          {filtered.map((g) => (
            <button
              key={g.id}
              type="button"
              className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-muted text-left"
              onClick={() => {
                onChange(g.id);
                setOpen(false);
              }}
            >
              <Check className={cn("size-4 shrink-0", g.id === value ? "opacity-100" : "opacity-0")} />
              <span className="truncate">
                {g.name}
                {g.company && <span className="text-muted-foreground"> · {g.company}</span>}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-2.5 py-3 text-sm text-muted-foreground">No guests found.</p>
          )}
        </div>
        {onAddNew && (
          <div className="border-t border-border p-1">
            <button
              type="button"
              className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-brand-red hover:bg-muted text-left font-medium"
              onClick={() => {
                setOpen(false);
                onAddNew();
              }}
            >
              <UserPlus className="size-4" />
              Add new guest
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
