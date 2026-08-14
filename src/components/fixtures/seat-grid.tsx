"use client";

import { useState } from "react";
import { SeatCard } from "@/components/fixtures/seat-card";
import { AssignSeatSheet } from "@/components/fixtures/assign-seat-sheet";
import type { SeatWithAllocation, FixtureDetail } from "@/lib/queries/fixture-detail";

export function SeatGrid({
  fixture,
  seats,
  allGuests,
  staffNames,
  canEdit,
}: {
  fixture: FixtureDetail["fixture"];
  seats: SeatWithAllocation[];
  allGuests: FixtureDetail["allGuests"];
  staffNames: string[];
  canEdit: boolean;
}) {
  const [editingSeatId, setEditingSeatId] = useState<number | null>(null);
  const editingSeat = seats.find((s) => s.id === editingSeatId) ?? null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {seats.map((seat) => (
          <SeatCard
            key={seat.id}
            seat={seat}
            canEdit={canEdit}
            onAssign={() => setEditingSeatId(seat.id)}
          />
        ))}
      </div>

      <AssignSeatSheet
        fixtureId={fixture.id}
        fixtureDate={fixture.date}
        fixtureKickoff={fixture.kickoff_time}
        seat={editingSeat}
        guests={allGuests}
        staffNames={staffNames}
        open={editingSeatId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingSeatId(null);
        }}
      />
    </>
  );
}
