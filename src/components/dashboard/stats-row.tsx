import { Card } from "@/components/ui/card";
import { formatUKDate } from "@/lib/format";
import type { DashboardData } from "@/lib/queries/dashboard";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-heading text-2xl mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </Card>
  );
}

export function StatsRow({ stats }: { stats: DashboardData["stats"] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <StatCard label="Home Fixtures" value={String(stats.totalFixtures)} />
      <StatCard label="Completed" value={String(stats.completedFixtures)} />
      <StatCard label="Guests Hosted" value={String(stats.guestsHostedThisSeason)} sub="this season" />
      <StatCard
        label="Next Match"
        value={stats.nextFixture ? stats.nextFixture.opponent : "—"}
        sub={stats.nextFixture ? formatUKDate(stats.nextFixture.date) : "Season complete"}
      />
      <StatCard label="Seats Remaining" value={String(stats.seatsRemainingUpcoming)} sub="upcoming fixtures" />
    </div>
  );
}
