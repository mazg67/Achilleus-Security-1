"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DietaryBadge } from "@/components/guests/dietary-badge";
import { GuestFormSheet } from "@/components/guests/guest-form-sheet";
import { DeleteGuestDialog } from "@/components/guests/delete-guest-dialog";
import { initials } from "@/lib/initials";
import { ArrowUpDown, Pencil, Trash2, Plus, Search } from "lucide-react";
import type { GuestWithAppearances } from "@/lib/queries/guests";
import type { UserRole, Guest } from "@/lib/database.types";
import { permissions } from "@/lib/permissions";

type SortKey = "name" | "company" | "appearances";

export function GuestsTable({
  guests,
  role,
}: {
  guests: GuestWithAppearances[];
  role: UserRole;
}) {
  const [query, setQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestWithAppearances | null>(null);

  const canManage = permissions.canManageGuests(role);
  const canDelete = permissions.canDeleteGuests(role);

  const dietaryOptions = useMemo(
    () => Array.from(new Set(guests.map((g) => g.dietary))).sort(),
    [guests],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = guests.filter((g) => {
      const matchesQuery =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.company?.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q);
      const matchesDietary = dietaryFilter === "all" || g.dietary === dietaryFilter;
      return matchesQuery && matchesDietary;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "appearances") cmp = a.appearances - b.appearances;
      else cmp = (a[sortKey] ?? "").toString().localeCompare((b[sortKey] ?? "").toString());
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [guests, query, dietaryFilter, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search name, company, email…"
              className="pl-8 w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={dietaryFilter} onValueChange={(v) => setDietaryFilter(v ?? "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Dietary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dietary needs</SelectItem>
              {dietaryOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {canManage && (
          <Button
            className="bg-brand-red hover:bg-brand-red/90 text-white"
            onClick={() => {
              setEditingGuest(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add Guest
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => toggleSort("name")}>
                  Name <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => toggleSort("company")}>
                  Company <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Dietary</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => toggleSort("appearances")}>
                  Appearances <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-brand-amber/30 text-brand-black text-xs font-semibold">
                      {initials(g.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/guests/${g.id}`} className="hover:text-brand-red">
                    {g.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{g.company ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{g.email ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{g.phone ?? "—"}</TableCell>
                <TableCell>
                  <DietaryBadge dietary={g.dietary} />
                </TableCell>
                <TableCell>{g.appearances}</TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title="Edit"
                        onClick={() => {
                          setEditingGuest(g);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      {canDelete && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Delete"
                          onClick={() => setDeletingGuest(g)}
                        >
                          <Trash2 className="size-3.5 text-brand-red" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={canManage ? 8 : 7} className="text-center text-muted-foreground py-8">
                  {guests.length === 0
                    ? "No guests added yet — add your first guest to get started."
                    : "No guests match your search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {canManage && (
        <GuestFormSheet open={formOpen} onOpenChange={setFormOpen} guest={editingGuest} />
      )}
      {deletingGuest && (
        <DeleteGuestDialog
          open={!!deletingGuest}
          onOpenChange={(open) => !open && setDeletingGuest(null)}
          guestId={deletingGuest.id}
          guestName={deletingGuest.name}
        />
      )}
    </div>
  );
}
