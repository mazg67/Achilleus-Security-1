import { getDashboardData } from "@/lib/queries/dashboard";
import { getCurrentProfile } from "@/lib/dal";
import { FixturesTable } from "@/components/fixtures/fixtures-table";
import { RealtimeRefresher } from "@/components/realtime-refresher";
import { SyncFixturesButton } from "@/components/fixtures/sync-fixtures-button";
import { permissions } from "@/lib/permissions";

export default async function FixturesListPage() {
  const [{ fixtures, settings }, profile] = await Promise.all([getDashboardData(), getCurrentProfile()]);

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-6xl mx-auto">
      <RealtimeRefresher tables={["seat_allocations"]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl">Fixtures</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All {fixtures.length} home fixtures for the {settings.season} season.
          </p>
        </div>
        {profile.role === "admin" && <SyncFixturesButton />}
      </div>
      <FixturesTable fixtures={fixtures} settings={settings} canManage={permissions.canManageFixtures(profile.role)} />
    </div>
  );
}
