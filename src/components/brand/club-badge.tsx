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
  return <ClubBadge abbreviation="ITFC" primary="#0057B8" secondary="#FFFFFF" size={size} />;
}
