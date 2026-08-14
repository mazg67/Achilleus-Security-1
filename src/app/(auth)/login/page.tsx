import Image from "next/image";
import { Tagline } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/brand/logo-yellow-stacked.png"
            alt="Achilleus Security"
            width={953}
            height={967}
            priority
            className="w-40 h-auto"
          />
          <p className="text-sm text-offwhite/60 text-center mt-3">
            Hospitality Suite Manager · 2026/27 Season
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="font-heading text-lg mb-6">Sign in</h2>
          <LoginForm next={next ?? "/dashboard"} />
        </div>

        <Tagline className="text-center mt-6 text-offwhite/80" />
      </div>
    </div>
  );
}
