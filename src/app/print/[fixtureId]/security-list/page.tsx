import { getFixtureDetail } from "@/lib/queries/fixture-detail";
import { SecurityListPrint } from "@/components/reports/security-list-print";
import { PrintButton } from "@/components/reports/print-button";

export default async function SecurityListPrintPage({
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
      <SecurityListPrint detail={detail} generatedAt={new Date()} />
    </div>
  );
}
