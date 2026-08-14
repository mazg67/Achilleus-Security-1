/**
 * Seeds the three staff accounts, settings row, seat configuration, sample
 * guests, and the 2026/27 fixture list. Safe to re-run — every step checks
 * for existing data first.
 *
 * Usage: npm run seed   (reads .env.local)
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { SEED_FIXTURES, SEED_SEATS, SEED_GUESTS } from "../src/lib/seed-data";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type SeedUser = {
  email: string;
  name: string;
  role: "admin" | "editor";
  password: string;
};

const USERS: SeedUser[] = [
  {
    email: "mario@achilleus-security.co.uk",
    name: "Mario",
    role: "admin",
    password: process.env.SEED_MARIO_PASSWORD || "ChangeMe123!",
  },
  {
    email: process.env.SEED_ADMIN2_EMAIL || "admin2@achilleus-security.co.uk",
    name: process.env.SEED_ADMIN2_NAME || "Admin Two",
    role: "admin",
    password: process.env.SEED_ADMIN2_PASSWORD || "ChangeMe123!",
  },
  {
    email: process.env.SEED_EDITOR_EMAIL || "editor@achilleus-security.co.uk",
    name: process.env.SEED_EDITOR_NAME || "Editor One",
    role: "editor",
    password: process.env.SEED_EDITOR_PASSWORD || "ChangeMe123!",
  },
];

async function seedUsers() {
  console.log("\n-- Staff accounts --");
  const { data: existing } = await supabase.auth.admin.listUsers({ perPage: 200 });

  for (const u of USERS) {
    const found = existing?.users.find(
      (x) => x.email?.toLowerCase() === u.email.toLowerCase(),
    );

    let userId: string;
    if (found) {
      userId = found.id;
      console.log(`  = ${u.email} already exists`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name, role: u.role },
      });
      if (error || !data.user) {
        console.error(`  ! Failed to create ${u.email}:`, error?.message);
        continue;
      }
      userId = data.user.id;
      console.log(`  + created ${u.email} (temporary password — change on first login)`);
    }

    // Upsert the profile in case the auth user existed without one, or the
    // trigger-created row has stale name/role.
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: userId, name: u.name, role: u.role, must_change_password: true },
        { onConflict: "id" },
      );
    if (profileError) console.error(`  ! Failed to upsert profile for ${u.email}:`, profileError.message);
  }
}

async function seedSettings() {
  console.log("\n-- Settings --");
  const { data } = await supabase.from("settings").select("id").eq("id", 1).maybeSingle();
  if (data) {
    console.log("  = settings row already exists");
    return;
  }
  const { error } = await supabase.from("settings").insert({ id: 1 });
  if (error) console.error("  ! Failed to insert settings:", error.message);
  else console.log("  + inserted default settings row");
}

async function seedSeatConfig() {
  console.log("\n-- Seat configuration --");
  const { count } = await supabase
    .from("seat_config")
    .select("id", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`  = ${count} seats already configured`);
    return;
  }
  const { error } = await supabase.from("seat_config").insert(SEED_SEATS);
  if (error) console.error("  ! Failed to insert seat config:", error.message);
  else console.log(`  + inserted ${SEED_SEATS.length} seats`);
}

async function seedGuests() {
  console.log("\n-- Sample guests --");
  const { count } = await supabase
    .from("guests")
    .select("id", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`  = ${count} guests already exist`);
    return;
  }
  const { error } = await supabase.from("guests").insert(SEED_GUESTS);
  if (error) console.error("  ! Failed to insert guests:", error.message);
  else console.log(`  + inserted ${SEED_GUESTS.length} sample guests`);
}

async function seedFixtures() {
  console.log("\n-- Fixtures (2026/27 home Premier League games) --");
  const { count } = await supabase
    .from("fixtures")
    .select("id", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`  = ${count} fixtures already exist`);
    return;
  }
  const rows = SEED_FIXTURES.map((f) => ({ ...f, competition: "Premier League", venue: "Portman Road" }));
  const { error } = await supabase.from("fixtures").insert(rows);
  if (error) console.error("  ! Failed to insert fixtures:", error.message);
  else console.log(`  + inserted ${rows.length} fixtures`);
}

async function main() {
  await seedUsers();
  await seedSettings();
  await seedSeatConfig();
  await seedGuests();
  await seedFixtures();
  console.log("\nSeed complete.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
