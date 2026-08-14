# Achilleus Security Hospitality Suite Manager

Internal tool for managing the Achilleus Security Management Limited hospitality box at Portman Road
(Ipswich Town FC) for the 2026/27 Premier League season — seat allocations, guest database, per-match
menus, branded email drafts, and printable/downloadable match-day reports, kept in sync in real time
across the three staff members who use it.

**Stack:** Next.js 16 (App Router) · Supabase (Postgres + Auth + Realtime) · Tailwind CSS v4 · shadcn/ui
(Base UI) · `@react-pdf/renderer` for PDF reports · football-data.org for the live Premier League fixture
feed.

---

## 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is fine)
- A free [football-data.org](https://www.football-data.org/client/register) API key (for the fixture sync — optional, the app works fine without it using the seeded fixture list)

## 2. Create the Supabase project

1. Create a new project at [supabase.com](https://supabase.com/dashboard).
2. In **Project Settings → API**, copy the **Project URL**, **anon public key**, and **service_role key** (keep the service role key secret — it's server-only).
3. Open the **SQL Editor** and run the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). This creates every table, the `is_admin()`/`current_role()` helper functions, all Row Level Security policies, and enables Realtime on `seat_allocations` and `guests`.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (server-only, never expose to the browser) |
| `SEED_MARIO_PASSWORD`, `SEED_ADMIN2_*`, `SEED_EDITOR_*` | Temporary passwords/names/emails for the three seeded accounts — change on first login (the app forces this automatically) |
| `FOOTBALL_DATA_API_KEY` | [football-data.org](https://www.football-data.org/client/register) free tier — optional |
| `CRON_SECRET` | Any random string (`openssl rand -base64 32`) — must match what you set in Vercel's cron config |

## 4. Install dependencies and seed the database

```bash
npm install
npm run seed
```

The seed script is idempotent (safe to re-run) — it checks for existing data before inserting anything. It creates:

- The three staff auth accounts (Mario + two more, from your `.env.local`) with `must_change_password` set, so each is prompted to set a real password on first login
- The default `settings` row
- The 14-seat configuration (2 fixed, 10 rotating, 2 host)
- 10 sample guests
- All 19 Ipswich Town home Premier League fixtures for 2026/27

## 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with one of the seeded accounts.

## 6. The live fixture feed

Fixtures are seeded from the published 2026/27 schedule, but kick-off times and TV picks move. The
**Fixtures** page has a **Sync Fixtures** button (admin only) that pulls the current Premier League
schedule from football-data.org and updates date/kick-off/status on any matched fixture — it never
creates, deletes, or touches opponent colours/badges, so your hand-curated fixture list stays intact.

For automatic daily syncing in production, `vercel.json` schedules `/api/cron/sync-fixtures` to run once
a day. Set `CRON_SECRET` in your Vercel project's environment variables — Vercel automatically sends it
as a bearer token, which the route checks before running.

## 7. Deploy to Vercel

```bash
npm i -g vercel   # if you don't have it
vercel
```

Or connect the repo in the Vercel dashboard. Either way, add the same environment variables from step 3
to the Vercel project (**Settings → Environment Variables**) before the first deploy.

## Project structure

```
src/
  app/
    (auth)/login/          Sign-in page
    (app)/                 Authenticated shell (sidebar/topbar) + dashboard, fixtures, guests, settings
    api/cron/sync-fixtures/ football-data.org sync (cron + manual admin trigger)
    api/fixtures/[id]/report/[type]/  PDF report generation (@react-pdf/renderer)
    print/[fixtureId]/     Print-ready HTML report views
  components/               UI, organized by feature (brand, dashboard, fixtures, guests, settings, reports)
  lib/
    actions/                Server actions (auth, guests, seats, menus, settings)
    queries/                Server-side data-fetching helpers
    pdf/                    @react-pdf/renderer document definitions
    supabase/               Browser/server/admin Supabase clients
    football-data*.ts       football-data.org client + sync reconciliation
supabase/
  migrations/0001_init.sql  Full schema, RLS policies, triggers
  seed.ts                   Seed script (npm run seed)
```

## Notes

- Roles: **Admin** (full access, incl. deleting fixtures/guests and managing users), **Editor**
  (day-to-day operations, no destructive actions), **Viewer** (read-only, reserved for future use).
  Enforced both in the UI and via Postgres RLS policies — never trust the client alone.
- Email drafts are generated as editable text and copied to the clipboard — the app never sends email
  on its own behalf.
- The 14-seat total is fixed for this season by design; it isn't dynamic.
