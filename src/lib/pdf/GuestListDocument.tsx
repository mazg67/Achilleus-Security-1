import { Document, Page, View, Text } from "@react-pdf/renderer";
import { PdfHeader, PdfFooter, sharedStyles } from "@/lib/pdf/pdf-shared";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";

const COLS = [
  { key: "seat", label: "Seat No.", width: "10%" },
  { key: "guest", label: "Guest Name", width: "24%" },
  { key: "company", label: "Company", width: "22%" },
  { key: "dietary", label: "Dietary", width: "18%" },
  { key: "host", label: "Host", width: "14%" },
  { key: "arrival", label: "Arrival", width: "12%" },
] as const;

export function GuestListDocument({
  detail,
  generatedAt,
}: {
  detail: FixtureDetail;
  generatedAt: Date;
}) {
  const { fixture, settings, seats } = detail;

  return (
    <Document title={`Match Day Guest List - vs ${fixture.opponent}`}>
      <Page size="A4" style={sharedStyles.page}>
        <PdfHeader fixture={fixture} title="ACHILLEUS SECURITY HOSPITALITY SUITE" />

        <Text style={sharedStyles.sectionTitle}>
          Match Day Guest List — {settings.suite_name}
        </Text>

        <View style={sharedStyles.table}>
          <View style={sharedStyles.tableHeaderRow}>
            {COLS.map((c) => (
              <Text key={c.key} style={[sharedStyles.tableHeaderCell, { width: c.width }]}>
                {c.label}
              </Text>
            ))}
          </View>
          {seats.map((seat, i) => (
            <View
              key={seat.id}
              style={i % 2 === 1 ? [sharedStyles.tableRow, sharedStyles.tableRowAlt] : sharedStyles.tableRow}
            >
              <Text style={[sharedStyles.tableCell, { width: "10%" }]}>{seat.id}</Text>
              <Text style={[sharedStyles.tableCell, { width: "24%" }]}>
                {seat.guest?.name ?? "—"}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: "22%" }]}>
                {seat.guest?.company ?? "—"}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: "18%" }]}>
                {seat.guest?.dietary ?? "—"}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: "14%" }]}>
                {seat.allocation?.host_name ?? "—"}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: "12%" }]}>
                {seat.allocation?.arrival_time?.slice(0, 5) ?? "—"}
              </Text>
            </View>
          ))}
        </View>

        <PdfFooter generatedAt={generatedAt} />
      </Page>
    </Document>
  );
}
