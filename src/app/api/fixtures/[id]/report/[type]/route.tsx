export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getCurrentUser } from "@/lib/dal";
import { getFixtureDetail } from "@/lib/queries/fixture-detail";
import { GuestListDocument } from "@/lib/pdf/GuestListDocument";
import { CateringBriefDocument } from "@/lib/pdf/CateringBriefDocument";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { id, type } = await params;
  const detail = await getFixtureDetail(id);
  const generatedAt = new Date();

  const doc =
    type === "catering-brief" ? (
      <CateringBriefDocument detail={detail} generatedAt={generatedAt} />
    ) : type === "guest-list" ? (
      <GuestListDocument detail={detail} generatedAt={generatedAt} />
    ) : null;

  if (!doc) return new NextResponse("Unknown report type", { status: 404 });

  const buffer = await renderToBuffer(doc);
  const filename = `${type}-vs-${detail.fixture.opponent.replace(/\s+/g, "-").toLowerCase()}-${detail.fixture.date}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
