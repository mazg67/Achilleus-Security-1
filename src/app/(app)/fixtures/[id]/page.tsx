import { getFixtureDetail } from "@/lib/queries/fixture-detail";
import { getCurrentProfile } from "@/lib/dal";
import { FixtureTabs } from "@/components/fixtures/fixture-tabs";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { IpswichBadge, ClubBadge } from "@/components/brand/club-badge";
import { formatUKDate, formatKickoff } from "@/lib/format";
import { RealtimeRefresher } from "@/components/realtime-refresher";

export default async function FixtureDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const [detail, profile] = await Promise.all([getFixtureDetail(id), getCurrentProfile()]);
  const { fixture } = detail;

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-6xl mx-auto">
      <RealtimeRefresher tables={["seat_allocations", "guests"]} />
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <IpswichBadge size={48} />
          <span className="text-sm font-semibold text-muted-foreground">vs</span>
          <ClubBadge
            abbreviation={fixture.opponent_abbreviation ?? "?"}
            primary={fixture.opponent_primary_colour ?? "#666"}
            secondary={fixture.opponent_secondary_colour ?? "#fff"}
            size={48}
          />
          <div>
            <h1 className="font-heading text-xl">{fixture.opponent}</h1>
            <p className="text-sm text-muted-foreground">
              {formatUKDate(fixture.date)} · {formatKickoff(fixture.kickoff_time)} · {fixture.venue}
            </p>
          </div>
        </div>
        <StatusBadge status={fixture.status} />
      </div>

      <FixtureTabs detail={detail} role={profile.role} hostName={profile.name} initialTab={tab ?? "seats"} />
    </div>
  );
}
