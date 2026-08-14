"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <AlertTriangle className="size-10 text-brand-red" />
      <div>
        <h2 className="font-heading text-lg">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <Button onClick={reset} className="bg-brand-red hover:bg-brand-red/90 text-white">
        Try again
      </Button>
    </div>
  );
}
