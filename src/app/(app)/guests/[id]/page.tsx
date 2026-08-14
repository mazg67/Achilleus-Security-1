import Link from "next/link";
import { getGuestProfile } from "@/lib/queries/guests";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DietaryBadge } from "@/components/guests/dietary-badge";
import { ClubBadge, IpswichBadge } from "@/components/brand/club-badge";
import { initials } from "@/lib/initials";
import { formatUKDate, formatUKTime } from "@/lib/format";
import { ArrowLeft } from "lucide-react";
import { RealtimeRefresher } from "@/components/realtime-refresher";

export default async function GuestProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { guest, appearances } = await getGuestProfile(id);

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-4xl mx-auto">
      <RealtimeRefresher tables={["guests", "seat_allocations"]} />
      <Button render={<Link href="/guests" />} nativeButton={false} variant="ghost" size="sm" className="-ml-2">
        <ArrowLeft className="size-4" />
        Back to guests
      </Button>

      <Card className="p-6 flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="bg-brand-amber/30 text-brand-black text-lg font-semibold">
            {initials(guest.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="font-heading text-xl">{guest.name}</h1>
          <p className="text-sm text-muted-foreground">{guest.company ?? "No company on file"}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {guest.email && <span>{guest.email}</span>}
            {guest.phone && <span>{guest.phone}</span>}
          </div>
        </div>
        <DietaryBadge dietary={guest.dietary} />
      </Card>

      {guest.notes && (
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm">{guest.notes}</p>
        </Card>
      )}

      <div>
        <h2 className="font-heading text-lg mb-3">
          Match history <span className="text-muted-foreground font-normal">({appearances.length})</span>
        </h2>

        {appearances.length === 0 ? (
          <p className="text-sm text-muted-foreground">This guest hasn&rsquo;t attended any fixtures yet.</p>
        ) : (
          <div className="space-y-2">
            {appearances.map(({ fixture, seat, allocation }) => (
              <Card key={allocation.id} className="p-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <IpswichBadge size={32} />
                  <ClubBadge
                    abbreviation={fixture.opponent_abbreviation ?? "?"}
                    primary={fixture.opponent_primary_colour ?? "#666"}
                    secondary={fixture.opponent_secondary_colour ?? "#fff"}
                    size={32}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">vs {fixture.opponent}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatUKDate(fixture.date)} · {seat.label}
                    {allocation.host_name && ` · Host: ${allocation.host_name}`}
                  </p>
                </div>
                {allocation.arrival_time && (
                  <span className="text-xs text-muted-foreground">
                    Arrived {formatUKTime(allocation.arrival_time)}
                  </span>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
