import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IpswichBadge, ClubBadge } from "@/components/brand/club-badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  formatUKDate,
  formatKickoff,
  boxOpensTime,
  boxClosesTime,
} from "@/lib/format";
import type { FixtureWithStats } from "@/lib/queries/dashboard";
import type { Settings } from "@/lib/database.types";
import { FileText, MapPin } from "lucide-react";

export function FixtureCard({
  fixture,
  settings,
}: {
  fixture: FixtureWithStats;
  settings: Settings;
}) {
  const opens = boxOpensTime(fixture.date, fixture.kickoff_time, settings.box_opens_before_ko);
  const closes = boxClosesTime(fixture.date, fixture.kickoff_time, settings.box_closes_after_ko);
  const pct = Math.round((fixture.filledSeats / settings.total_seats) * 100);

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IpswichBadge size={40} />
          <span className="text-xs font-semibold text-muted-foreground">vs</span>
          <ClubBadge
            opponent={fixture.opponent}
            abbreviation={fixture.opponent_abbreviation ?? "?"}
            primary={fixture.opponent_primary_colour ?? "#666"}
            secondary={fixture.opponent_secondary_colour ?? "#fff"}
            size={40}
          />
        </div>
        <StatusBadge status={fixture.status} />
      </div>

      <div>
        <h3 className="font-heading text-lg leading-tight">{fixture.opponent}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {formatUKDate(fixture.date)} · {formatKickoff(fixture.kickoff_time)}
        </p>
      </div>

      <div className="text-sm space-y-1 text-muted-foreground">
        <p>
          Opens: <span className="text-foreground font-medium">{opens}</span> · Closes: ~
          <span className="text-foreground font-medium">{closes}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {settings.suite_name} · {settings.box_office_location.split(",")[0]}
          </span>
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium">
            {fixture.filledSeats} / {settings.total_seats} seats
          </span>
          <span className="text-muted-foreground">{fixture.filledSeats} bookings</span>
        </div>
        <Progress value={pct} />
      </div>

      <div className="flex gap-2 mt-auto pt-1">
        <Button
          render={<Link href={`/fixtures/${fixture.id}`} />}
          nativeButton={false}
          size="sm"
          className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white"
        >
          Manage Fixture
        </Button>
        <Button
          render={<Link href={`/fixtures/${fixture.id}?tab=reports`} />}
          nativeButton={false}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <FileText className="size-3.5" />
          Report
        </Button>
      </div>
    </Card>
  );
}
