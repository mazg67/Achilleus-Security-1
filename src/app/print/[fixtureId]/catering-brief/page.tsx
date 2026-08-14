import { getFixtureDetail } from "@/lib/queries/fixture-detail";
import { CateringBriefPrint } from "@/components/reports/catering-brief-print";
import { PrintButton } from "@/components/reports/print-button";

export default async function CateringBriefPrintPage({
  params,
}: {
  params: Promise<{ fixtureId: string }>;
}) {
  const { fixtureId } = await params;
  const detail = await getFixtureDetail(fixtureId);

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="print:hidden sticky top-0 bg-white border-b border-border p-4 flex justify-end">
        <PrintButton />
      </div>
      <CateringBriefPrint detail={detail} generatedAt={new Date()} />
    </div>
  );
}
