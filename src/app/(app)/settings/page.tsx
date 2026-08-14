import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/dal";
import { getUsersForSettings, getSeatConfigWithGuests, getSettingsRow } from "@/lib/queries/settings";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UsersTab } from "@/components/settings/users-tab";
import { ClubVenueTab } from "@/components/settings/club-venue-tab";
import { SeatConfigTab } from "@/components/settings/seat-config-tab";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const [users, seats, settings, { data: guests }] = await Promise.all([
    getUsersForSettings(),
    getSeatConfigWithGuests(),
    getSettingsRow(),
    supabase.from("guests").select("*").order("name", { ascending: true }),
  ]);

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage users, venue details, and seat configuration.</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="club">Club &amp; Venue</TabsTrigger>
          <TabsTrigger value="seats">Seat Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTab users={users} />
        </TabsContent>
        <TabsContent value="club">
          <ClubVenueTab settings={settings} />
        </TabsContent>
        <TabsContent value="seats">
          <SeatConfigTab seats={seats} guests={guests ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
