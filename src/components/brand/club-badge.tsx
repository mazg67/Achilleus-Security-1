import Image from "next/image";

export function ClubBadge({
  abbreviation,
  primary,
  secondary = "#FFFFFF",
  size = 44,
}: {
  abbreviation: string;
  primary: string;
  secondary?: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-heading shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: primary,
        color: secondary,
        border: `2px solid ${secondary}`,
        fontSize: size * 0.28,
      }}
    >
      {abbreviation}
    </div>
  );
}

export function IpswichBadge({ size = 44 }: { size?: number }) {
  return (
    <div className="shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <Image
        src="/brand/ipswich-crest.png"
        alt="Ipswich Town FC"
        width={1774}
        height={2178}
        style={{ width: "auto", height: "100%", maxWidth: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
