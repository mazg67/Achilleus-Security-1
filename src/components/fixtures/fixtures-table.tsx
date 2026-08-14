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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ClubBadge } from "@/components/brand/club-badge";
import { FixtureFormSheet } from "@/components/fixtures/fixture-form-sheet";
import { DeleteFixtureDialog } from "@/components/fixtures/delete-fixture-dialog";
import { formatUKDate, formatUKTime } from "@/lib/format";
import type { FixtureWithStats } from "@/lib/queries/dashboard";
import type { Settings, FixtureStatus, Fixture } from "@/lib/database.types";
import { ArrowUpDown, Pencil, Trash2, Plus } from "lucide-react";

type SortKey = "date" | "opponent";

export function FixturesTable({
  fixtures,
  settings,
  canManage,
}: {
  fixtures: FixtureWithStats[];
  settings: Settings;
  canManage: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<FixtureStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [deletingFixture, setDeletingFixture] = useState<FixtureWithStats | null>(null);

  const filtered = useMemo(() => {
    const list = fixtures.filter((f) => statusFilter === "all" || f.status === statusFilter);
    list.sort((a, b) => {
      const cmp =
        sortKey === "date" ? a.date.localeCompare(b.date) : a.opponent.localeCompare(b.opponent);
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [fixtures, statusFilter, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-between">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter((v as typeof statusFilter) ?? "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {canManage && (
          <Button
            size="sm"
            className="bg-brand-red hover:bg-brand-red/90 text-white"
            onClick={() => {
              setEditingFixture(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add Fixture
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => toggleSort("date")}>
                  Date <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => toggleSort("opponent")}>
                  Opponent <ArrowUpDown className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead>KO</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="whitespace-nowrap">{formatUKDate(f.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ClubBadge
                      abbreviation={f.opponent_abbreviation ?? "?"}
                      primary={f.opponent_primary_colour ?? "#666"}
                      secondary={f.opponent_secondary_colour ?? "#fff"}
                      size={26}
                    />
                    <span className="font-medium">{f.opponent}</span>
                  </div>
                </TableCell>
                <TableCell>{formatUKTime(f.kickoff_time)}</TableCell>
                <TableCell>
                  <StatusBadge status={f.status} />
                </TableCell>
                <TableCell>
                  {f.filledSeats} / {settings.total_seats}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button render={<Link href={`/fixtures/${f.id}`} />} nativeButton={false} size="sm" variant="outline">
                      Manage
                    </Button>
                    {canManage && (
                      <>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Edit"
                          onClick={() => {
                            setEditingFixture(f);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Delete"
                          onClick={() => setDeletingFixture(f)}
                        >
                          <Trash2 className="size-3.5 text-brand-red" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {fixtures.length === 0
                    ? "No fixtures yet — an admin can add them, or sync from football-data.org."
                    : "No fixtures match this filter."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {canManage && (
        <FixtureFormSheet open={formOpen} onOpenChange={setFormOpen} fixture={editingFixture} />
      )}
      {deletingFixture && (
        <DeleteFixtureDialog
          open={!!deletingFixture}
          onOpenChange={(open) => !open && setDeletingFixture(null)}
          fixtureId={deletingFixture.id}
          opponent={deletingFixture.opponent}
        />
      )}
    </div>
  );
}
