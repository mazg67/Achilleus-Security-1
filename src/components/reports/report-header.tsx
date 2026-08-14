import Image from "next/image";
import { formatUKDate, formatKickoff, formatDateTimeStamp } from "@/lib/format";
import type { Fixture } from "@/lib/database.types";

export function ReportHeader({ fixture, title }: { fixture: Fixture; title: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Image
          src="/brand/achilleus-report-logo.png"
          alt="Achilleus Security"
          width={176}
          height={196}
          className="h-14 w-auto"
        />
        <h1 className="font-heading text-lg text-center">{title}</h1>
        <Image
          src="/brand/ipswich-crest.png"
          alt="Ipswich Town FC"
          width={1774}
          height={2178}
          className="h-14 w-auto"
        />
      </div>
      <div className="h-1 bg-brand-red mt-4 mb-4" />
      <p className="text-center font-semibold">
        Ipswich Town FC vs {fixture.opponent} | {formatUKDate(fixture.date)} | {formatKickoff(fixture.kickoff_time)} |{" "}
        {fixture.venue}
      </p>
    </div>
  );
}

export function ReportFooter({
  generatedAt,
  contactNote,
}: {
  generatedAt: Date;
  contactNote?: string;
}) {
  return (
    <div className="mt-8 pt-3 border-t border-border text-xs">
      {contactNote && <p className="font-semibold text-center mb-3">{contactNote}</p>}
      <div className="flex items-center justify-between">
        <span className="font-script text-brand-red text-base">We Go Further To Protect You!</span>
        <span className="text-muted-foreground">
          Achilleus Security Management Limited · Generated {formatDateTimeStamp(generatedAt)}
        </span>
      </div>
    </div>
  );
}
