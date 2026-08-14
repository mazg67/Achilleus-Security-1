import { ReportHeader, ReportFooter } from "@/components/reports/report-header";
import { SECURITY_CONTACT_NOTE } from "@/lib/reports-constants";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";

export function SecurityListPrint({ detail, generatedAt }: { detail: FixtureDetail; generatedAt: Date }) {
  const { fixture, settings, seats } = detail;

  return (
    <div className="max-w-3xl mx-auto p-8 font-serif text-sm">
      <ReportHeader fixture={fixture} title="ACHILLEUS SECURITY HOSPITALITY SUITE" />

      <h2 className="text-brand-red font-heading text-sm uppercase tracking-wide mb-3">
        Hospitality Security List — {settings.suite_name}
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brand-black text-white text-xs uppercase">
            <th className="text-left px-2 py-2">Seat No.</th>
            <th className="text-left px-2 py-2">Guest Name</th>
            <th className="text-left px-2 py-2">Company</th>
            <th className="text-left px-2 py-2">PIN</th>
            <th className="text-left px-2 py-2">Host</th>
            <th className="text-left px-2 py-2">Arrival</th>
          </tr>
        </thead>
        <tbody>
          {seats.map((seat, i) => (
            <tr key={seat.id} className={i % 2 === 1 ? "bg-muted/50" : undefined}>
              <td className="px-2 py-1.5 border-b border-border">{seat.id}</td>
              <td className="px-2 py-1.5 border-b border-border">{seat.guest?.name ?? "—"}</td>
              <td className="px-2 py-1.5 border-b border-border">{seat.guest?.company ?? "—"}</td>
              <td className="px-2 py-1.5 border-b border-border font-semibold">
                {seat.guest?.security_pin ?? "—"}
              </td>
              <td className="px-2 py-1.5 border-b border-border">{seat.allocation?.host_name ?? "—"}</td>
              <td className="px-2 py-1.5 border-b border-border">
                {seat.allocation?.arrival_time?.slice(0, 5) ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReportFooter generatedAt={generatedAt} contactNote={SECURITY_CONTACT_NOTE} />
    </div>
  );
}
