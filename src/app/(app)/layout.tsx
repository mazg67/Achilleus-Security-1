import { getCurrentProfile } from "@/lib/dal";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={profile.role} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Topbar name={profile.name} role={profile.role} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <MobileNav role={profile.role} />
      <ChangePasswordDialog open={profile.must_change_password} />
    </div>
  );
}
