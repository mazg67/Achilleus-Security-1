import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncFixturesFromFootballData } from "@/lib/football-data-sync";

async function isAuthorised(req: NextRequest): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;

  const user = await getCurrentUser();
  if (!user) return false;

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin";
}

export async function GET(req: NextRequest) {
  if (!(await isAuthorised(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: settings } = await admin.from("settings").select("season").eq("id", 1).single();
  const season = Number(settings?.season?.split("/")[0]) || new Date().getFullYear();

  try {
    const result = await syncFixturesFromFootballData(season);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Sync failed" },
      { status: 502 },
    );
  }
}
