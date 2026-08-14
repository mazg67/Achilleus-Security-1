import { cn } from "@/lib/utils";

const LEAF_LEFT_ANGLES = [180, 160, 140, 120, 100, 80, 62, 46];
const LEAF_RIGHT_ANGLES = [198, 218, 238, 258, 278, 298, 316, 332];

/** Achilleus Security mark: Spartan helmet + laurel wreath, built from primitives (no external image). */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Achilleus Security"
    >
      {/* Laurel wreath */}
      {[...LEAF_LEFT_ANGLES, ...LEAF_RIGHT_ANGLES].map((angle) => (
        <ellipse
          key={angle}
          cx="100"
          cy="26"
          rx="9"
          ry="21"
          fill="#f1ae54"
          stroke="#050505"
          strokeWidth="1.5"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}

      {/* Helmet dome + face, side profile facing right */}
      <path
        d="M72,138
           C58,122 60,82 85,62
           C100,50 118,52 128,65
           C136,75 138,85 134,95
           L130,120
           C128,128 124,132 118,133
           C122,140 118,148 105,150
           C90,150 78,146 72,138 Z"
        fill="#f1ae54"
        stroke="#050505"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Eye slit */}
      <ellipse cx="108" cy="90" rx="5" ry="8" fill="#050505" />

      {/* Crest / plume */}
      <path
        d="M95,55
           C80,50 60,55 50,75
           C45,90 48,105 58,118
           C64,112 62,98 68,85
           C74,72 84,62 95,55 Z"
        fill="#cb2026"
        stroke="#050505"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LogoLockup({
  size = 40,
  variant = "dark",
  className,
}: {
  size?: number;
  variant?: "dark" | "light";
  className?: string;
}) {
  const textColor = variant === "dark" ? "text-offwhite" : "text-brand-black";
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark size={size} />
      <div className="leading-tight">
        <div className={`font-heading text-sm ${textColor}`}>ACHILLEUS</div>
        <div className={`font-heading text-sm ${textColor} -mt-1`}>SECURITY</div>
      </div>
    </div>
  );
}

export function Tagline({ className }: { className?: string }) {
  return (
    <p className={cn("font-script text-brand-red text-lg italic", className)}>
      We Go Further To Protect You!
    </p>
  );
}
