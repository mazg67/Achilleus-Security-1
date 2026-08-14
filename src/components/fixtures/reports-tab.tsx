import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";

function ReportCard({
  title,
  description,
  fixtureId,
  reportType,
}: {
  title: string;
  description: string;
  fixtureId: string;
  reportType: "guest-list" | "catering-brief" | "security-list";
}) {
  return (
    <Card className="p-5 space-y-3">
      <div>
        <h3 className="font-heading text-base">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button
          render={<a href={`/api/fixtures/${fixtureId}/report/${reportType}`} />}
          nativeButton={false}
          className="bg-brand-red hover:bg-brand-red/90 text-white"
        >
          <Download className="size-4" />
          Download PDF
        </Button>
        <Button
          render={<Link href={`/print/${fixtureId}/${reportType}`} target="_blank" />}
          nativeButton={false}
          variant="outline"
        >
          <ExternalLink className="size-4" />
          Print view
        </Button>
      </div>
    </Card>
  );
}

export function ReportsTab({ detail }: { detail: FixtureDetail }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ReportCard
        title="Match Day Guest List"
        description="Team-sheet style seat-by-seat list — print and keep in the box on match day."
        fixtureId={detail.fixture.id}
        reportType="guest-list"
      />
      <ReportCard
        title="Hospitality & Catering Brief"
        description="Summary, dietary requirements, menu, and full arrival times for the venue's catering team."
        fixtureId={detail.fixture.id}
        reportType="catering-brief"
      />
      <ReportCard
        title="Hospitality Security List"
        description="Seat-by-seat list with each guest's security PIN, for venue security to verify identity on match day."
        fixtureId={detail.fixture.id}
        reportType="security-list"
      />
    </div>
  );
}
