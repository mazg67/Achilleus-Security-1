"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SeatGrid } from "@/components/fixtures/seat-grid";
import { MenuTab } from "@/components/fixtures/menu-tab";
import { EmailDraftsTab } from "@/components/fixtures/email-drafts-tab";
import { ReportsTab } from "@/components/fixtures/reports-tab";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";
import type { UserRole } from "@/lib/database.types";
import { permissions } from "@/lib/permissions";

export function FixtureTabs({
  detail,
  role,
  hostName,
  initialTab,
}: {
  detail: FixtureDetail;
  role: UserRole;
  hostName: string;
  initialTab: string;
}) {
  const canEditSeats = permissions.canManageSeats(role);
  const canEditMenu = permissions.canManageMenus(role);

  return (
    <Tabs defaultValue={initialTab} className="gap-4">
      <TabsList>
        <TabsTrigger value="seats">Seat Plan</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="emails">Email Drafts</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="seats">
        <SeatGrid
          fixture={detail.fixture}
          seats={detail.seats}
          allGuests={detail.allGuests}
          staffNames={detail.staffNames}
          canEdit={canEditSeats}
        />
      </TabsContent>

      <TabsContent value="menu">
        <MenuTab fixtureId={detail.fixture.id} menu={detail.menu} canEdit={canEditMenu} />
      </TabsContent>

      <TabsContent value="emails">
        <EmailDraftsTab detail={detail} hostName={hostName} />
      </TabsContent>

      <TabsContent value="reports">
        <ReportsTab detail={detail} />
      </TabsContent>
    </Tabs>
  );
}
