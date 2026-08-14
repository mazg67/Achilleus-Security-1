import { ReportHeader, ReportFooter } from "@/components/reports/report-header";
import { boxOpensTime, boxClosesTime, formatKickoff } from "@/lib/format";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="font-heading text-brand-red text-lg">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function CateringBriefPrint({ detail, generatedAt }: { detail: FixtureDetail; generatedAt: Date }) {
  const { fixture, settings, seats, menu } = detail;
  const guestSeats = seats.filter((s) => s.guest);
  const dietarySeats = guestSeats.filter((s) => s.guest!.dietary.toLowerCase() !== "none");
  const opens = boxOpensTime(fixture.date, fixture.kickoff_time, settings.box_opens_before_ko);
  const closes = boxClosesTime(fixture.date, fixture.kickoff_time, settings.box_closes_after_ko);

  return (
    <div className="max-w-3xl mx-auto p-8 font-serif text-sm">
      <ReportHeader fixture={fixture} title="HOSPITALITY & CATERING BRIEF" />

      <div className="flex border border-brand-amber bg-brand-amber/10 rounded-lg p-4 mb-6">
        <SummaryStat label="Total Guests" value={String(guestSeats.length)} />
        <SummaryStat label="Dietary Requirements" value={String(dietarySeats.length)} />
        <SummaryStat label="Box Opens" value={opens} />
        <SummaryStat label="Dining From" value={opens} />
        <SummaryStat label="Kick-off" value={formatKickoff(fixture.kickoff_time).replace("KO: ", "")} />
        <SummaryStat label="Box Closes" value={`~${closes}`} />
      </div>

      <section className="mb-6">
        <h2 className="text-brand-red font-heading text-sm uppercase tracking-wide mb-2">Dietary Requirements</h2>
        {dietarySeats.length === 0 ? (
          <p className="text-muted-foreground">No special dietary requirements recorded for this fixture.</p>
        ) : (
          <ul className="space-y-1">
            {dietarySeats.map((s) => (
              <li key={s.id}>
                <span className="font-semibold">{s.guest!.name}</span> — {s.guest!.dietary}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-brand-red font-heading text-sm uppercase tracking-wide mb-2">Match Day Menu</h2>
        {menu ? (
          <div className="space-y-1">
            {menu.welcome_drinks && <p>Welcome drinks: {menu.welcome_drinks}</p>}
            {menu.starter && <p>Starter: {menu.starter}</p>}
            {menu.main_course && <p>Main course: {menu.main_course}</p>}
            {menu.dessert && <p>Dessert: {menu.dessert}</p>}
            {menu.drinks_included && <p>Drinks included: {menu.drinks_included}</p>}
            {menu.additional_notes && <p>Notes: {menu.additional_notes}</p>}
          </div>
        ) : (
          <p className="text-muted-foreground">Menu not yet confirmed.</p>
        )}
      </section>

      <section>
        <h2 className="text-brand-red font-heading text-sm uppercase tracking-wide mb-2">
          Full Guest List with Arrival Times
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-black text-white text-xs uppercase">
              <th className="text-left px-2 py-2">Name</th>
              <th className="text-left px-2 py-2">Company</th>
              <th className="text-left px-2 py-2">Dietary</th>
              <th className="text-left px-2 py-2">Arrival</th>
              <th className="text-left px-2 py-2">Seat</th>
              <th className="text-left px-2 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {guestSeats.map((s, i) => (
              <tr key={s.id} className={i % 2 === 1 ? "bg-muted/50" : undefined}>
                <td className="px-2 py-1.5 border-b border-border">{s.guest!.name}</td>
                <td className="px-2 py-1.5 border-b border-border">{s.guest!.company ?? "—"}</td>
                <td className="px-2 py-1.5 border-b border-border">{s.guest!.dietary}</td>
                <td className="px-2 py-1.5 border-b border-border">
                  {s.allocation?.arrival_time?.slice(0, 5) ?? "—"}
                </td>
                <td className="px-2 py-1.5 border-b border-border">{s.id}</td>
                <td className="px-2 py-1.5 border-b border-border">{s.allocation?.notes ?? "—"}</td>
              </tr>
            ))}
            {guestSeats.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-4 text-center text-muted-foreground">
                  No guests assigned to this fixture yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-muted-foreground mt-4">
        Contact: {settings.box_office_location} · {settings.stadium_address}
      </p>

      <ReportFooter generatedAt={generatedAt} />
    </div>
  );
}
