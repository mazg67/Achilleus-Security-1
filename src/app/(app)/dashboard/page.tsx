import { getDashboardData } from "@/lib/queries/dashboard";
import { StatsRow } from "@/components/dashboard/stats-row";
import { FixtureCard } from "@/components/dashboard/fixture-card";
import { RealtimeRefresher } from "@/components/realtime-refresher";

export default async function DashboardPage() {
  const { settings, fixtures, stats } = await getDashboardData();

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-7xl mx-auto">
      <RealtimeRefresher tables={["seat_allocations"]} />
      <div>
        <h1 className="font-heading text-2xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {settings.suite_name} · {settings.season} Season
        </p>
      </div>

      <StatsRow stats={stats} />

      {fixtures.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No fixtures yet — an admin can add them from the Fixtures page.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fixtures.map((fixture) => (
            <FixtureCard key={fixture.id} fixture={fixture} settings={settings} />
          ))}
        </div>
      )}
    </div>
  );
}
