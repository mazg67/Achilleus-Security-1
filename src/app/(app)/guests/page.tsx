import { getGuestsWithAppearances } from "@/lib/queries/guests";
import { getCurrentProfile } from "@/lib/dal";
import { GuestsTable } from "@/components/guests/guests-table";
import { RealtimeRefresher } from "@/components/realtime-refresher";

export default async function GuestsPage() {
  const [guests, profile] = await Promise.all([getGuestsWithAppearances(), getCurrentProfile()]);

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-6xl mx-auto">
      <RealtimeRefresher tables={["guests", "seat_allocations"]} />
      <div>
        <h1 className="font-heading text-2xl">Guests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{guests.length} guests in the client database.</p>
      </div>
      <GuestsTable guests={guests} role={profile.role} />
    </div>
  );
}
