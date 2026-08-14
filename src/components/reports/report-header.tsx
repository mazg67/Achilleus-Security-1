import { LogoMark } from "@/components/brand/logo";
import { IpswichBadge } from "@/components/brand/club-badge";
import { formatUKDate, formatKickoff, formatDateTimeStamp } from "@/lib/format";
import type { Fixture } from "@/lib/database.types";

export function ReportHeader({ fixture, title }: { fixture: Fixture; title: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <LogoMark size={48} />
        <h1 className="font-heading text-lg text-center">{title}</h1>
        <IpswichBadge size={48} />
      </div>
      <div className="h-1 bg-brand-red mt-4 mb-4" />
      <p className="text-center font-semibold">
        Ipswich Town FC vs {fixture.opponent} | {formatUKDate(fixture.date)} | {formatKickoff(fixture.kickoff_time)} |{" "}
        {fixture.venue}
      </p>
    </div>
  );
}

export function ReportFooter({ generatedAt }: { generatedAt: Date }) {
  return (
    <div className="mt-8 pt-3 border-t border-border flex items-center justify-between text-xs">
      <span className="font-script text-brand-red text-base">We Go Further To Protect You!</span>
      <span className="text-muted-foreground">
        Achilleus Security Management Limited · Generated {formatDateTimeStamp(generatedAt)}
      </span>
    </div>
  );
}
