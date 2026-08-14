import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { formatUKDate, formatKickoff, formatDateTimeStamp } from "@/lib/format";
import type { Fixture } from "@/lib/database.types";

export const colours = {
  red: "#cb2026",
  amber: "#f1ae54",
  black: "#050505",
  offwhite: "#f9f8f4",
};

export const sharedStyles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: colours.black,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  headerCentre: { alignItems: "center" },
  headerTitle: { fontFamily: "Helvetica-Bold", fontSize: 13, letterSpacing: 0.5 },
  redBar: { height: 4, backgroundColor: colours.red, marginBottom: 14 },
  matchLine: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 14,
    color: colours.black,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: colours.red,
    marginBottom: 8,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: { borderTopWidth: 1, borderTopColor: "#ddd" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: colours.black,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#fff",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableRowAlt: { backgroundColor: "#faf9f6" },
  tableCell: { fontSize: 9.5 },
  footerTagline: { fontFamily: "Times-Italic", fontSize: 9, color: colours.red },
  footerMeta: { fontSize: 8, color: "#666" },
  footerNote: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: colours.black,
    marginBottom: 6,
    textAlign: "center",
  },
});

export function PdfHeader({
  fixture,
  title,
  origin,
}: {
  fixture: Fixture;
  title: string;
  origin: string;
}) {
  return (
    <View fixed>
      <View style={sharedStyles.headerRow}>
        <Image src={`${origin}/brand/achilleus-report-logo.png`} style={{ width: 38, height: 42 }} />
        <View style={sharedStyles.headerCentre}>
          <Text style={sharedStyles.headerTitle}>{title}</Text>
        </View>
        <Image src={`${origin}/brand/ipswich-crest.png`} style={{ width: 34, height: 42 }} />
      </View>
      <View style={sharedStyles.redBar} />
      <Text style={sharedStyles.matchLine}>
        Ipswich Town FC vs {fixture.opponent} | {formatUKDate(fixture.date)} | {formatKickoff(fixture.kickoff_time)} |{" "}
        {fixture.venue}
      </Text>
    </View>
  );
}

export function PdfFooter({
  generatedAt,
  contactNote,
}: {
  generatedAt: Date;
  contactNote?: string;
}) {
  return (
    <View style={{ position: "absolute", bottom: 20, left: 36, right: 36 }} fixed>
      {contactNote && <Text style={sharedStyles.footerNote}>{contactNote}</Text>}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          paddingTop: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={sharedStyles.footerTagline}>We Go Further To Protect You!</Text>
        <Text style={sharedStyles.footerMeta}>
          Achilleus Security Management Limited · Generated {formatDateTimeStamp(generatedAt)}
        </Text>
      </View>
    </View>
  );
}
