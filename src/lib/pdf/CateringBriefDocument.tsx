import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfHeader, PdfFooter, sharedStyles, colours } from "@/lib/pdf/pdf-shared";
import { boxOpensTime, boxClosesTime, formatKickoff } from "@/lib/format";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";

const styles = StyleSheet.create({
  summaryBox: {
    flexDirection: "row",
    backgroundColor: "#faf6ea",
    borderWidth: 1,
    borderColor: colours.amber,
    borderRadius: 4,
    marginBottom: 16,
    padding: 10,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Helvetica-Bold", fontSize: 13, color: colours.red },
  summaryLabel: { fontSize: 8, color: "#555", marginTop: 2, textAlign: "center" },
  menuLine: { fontSize: 10, marginBottom: 3 },
  dietaryRow: { flexDirection: "row", marginBottom: 3 },
  section: { marginBottom: 16 },
});

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const FULL_COLS = [
  { key: "name", label: "Name", width: "22%" },
  { key: "company", label: "Company", width: "20%" },
  { key: "dietary", label: "Dietary", width: "18%" },
  { key: "arrival", label: "Arrival", width: "12%" },
  { key: "seat", label: "Seat", width: "10%" },
  { key: "notes", label: "Notes", width: "18%" },
] as const;

export function CateringBriefDocument({
  detail,
  generatedAt,
  origin,
}: {
  detail: FixtureDetail;
  generatedAt: Date;
  origin: string;
}) {
  const { fixture, settings, seats, menu } = detail;
  const guestSeats = seats.filter((s) => s.guest);
  const dietarySeats = guestSeats.filter((s) => s.guest!.dietary.toLowerCase() !== "none");
  const opens = boxOpensTime(fixture.date, fixture.kickoff_time, settings.box_opens_before_ko);
  const closes = boxClosesTime(fixture.date, fixture.kickoff_time, settings.box_closes_after_ko);

  return (
    <Document title={`Hospitality & Catering Brief - vs ${fixture.opponent}`}>
      <Page size="A4" style={sharedStyles.page}>
        <PdfHeader fixture={fixture} title="HOSPITALITY & CATERING BRIEF" origin={origin} />

        <View style={styles.summaryBox}>
          <Summary label="Total Guests" value={String(guestSeats.length)} />
          <Summary label="Dietary Requirements" value={String(dietarySeats.length)} />
          <Summary label="Box Opens" value={opens} />
          <Summary label="Dining From" value={opens} />
          <Summary label="Kick-off" value={formatKickoff(fixture.kickoff_time).replace("KO: ", "")} />
          <Summary label="Box Closes" value={`~${closes}`} />
        </View>

        <View style={styles.section}>
          <Text style={sharedStyles.sectionTitle}>Dietary Requirements</Text>
          {dietarySeats.length === 0 ? (
            <Text style={styles.menuLine}>No special dietary requirements recorded for this fixture.</Text>
          ) : (
            dietarySeats.map((s) => (
              <View key={s.id} style={styles.dietaryRow}>
                <Text style={[styles.menuLine, { fontFamily: "Helvetica-Bold", width: "40%" }]}>
                  {s.guest!.name}
                </Text>
                <Text style={styles.menuLine}>{s.guest!.dietary}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={sharedStyles.sectionTitle}>Match Day Menu</Text>
          {menu?.welcome_drinks && <Text style={styles.menuLine}>Welcome drinks: {menu.welcome_drinks}</Text>}
          {menu?.starter && <Text style={styles.menuLine}>Starter: {menu.starter}</Text>}
          {menu?.main_course && <Text style={styles.menuLine}>Main course: {menu.main_course}</Text>}
          {menu?.dessert && <Text style={styles.menuLine}>Dessert: {menu.dessert}</Text>}
          {menu?.drinks_included && <Text style={styles.menuLine}>Drinks included: {menu.drinks_included}</Text>}
          {menu?.additional_notes && <Text style={styles.menuLine}>Notes: {menu.additional_notes}</Text>}
          {!menu && <Text style={styles.menuLine}>Menu not yet confirmed.</Text>}
        </View>

        <View style={styles.section}>
          <Text style={sharedStyles.sectionTitle}>Full Guest List with Arrival Times</Text>
          <View style={sharedStyles.table}>
            <View style={sharedStyles.tableHeaderRow}>
              {FULL_COLS.map((c) => (
                <Text key={c.key} style={[sharedStyles.tableHeaderCell, { width: c.width }]}>
                  {c.label}
                </Text>
              ))}
            </View>
            {guestSeats.map((s, i) => (
              <View
                key={s.id}
                style={i % 2 === 1 ? [sharedStyles.tableRow, sharedStyles.tableRowAlt] : sharedStyles.tableRow}
              >
                <Text style={[sharedStyles.tableCell, { width: "22%" }]}>{s.guest!.name}</Text>
                <Text style={[sharedStyles.tableCell, { width: "20%" }]}>{s.guest!.company ?? "—"}</Text>
                <Text style={[sharedStyles.tableCell, { width: "18%" }]}>{s.guest!.dietary}</Text>
                <Text style={[sharedStyles.tableCell, { width: "12%" }]}>
                  {s.allocation?.arrival_time?.slice(0, 5) ?? "—"}
                </Text>
                <Text style={[sharedStyles.tableCell, { width: "10%" }]}>{s.id}</Text>
                <Text style={[sharedStyles.tableCell, { width: "18%" }]}>{s.allocation?.notes ?? "—"}</Text>
              </View>
            ))}
            {guestSeats.length === 0 && (
              <View style={sharedStyles.tableRow}>
                <Text style={sharedStyles.tableCell}>No guests assigned to this fixture yet.</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={{ fontSize: 8, color: "#666" }}>
          Contact: {settings.box_office_location} · {settings.stadium_address}
        </Text>

        <PdfFooter generatedAt={generatedAt} />
      </Page>
    </Document>
  );
}
