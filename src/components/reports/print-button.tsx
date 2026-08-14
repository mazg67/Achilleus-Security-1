"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="bg-brand-red hover:bg-brand-red/90 text-white print:hidden">
      <Printer className="size-4" />
      Print
    </Button>
  );
}
