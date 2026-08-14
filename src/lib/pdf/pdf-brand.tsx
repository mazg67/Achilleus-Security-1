import { Svg, Path, Ellipse, View, Text } from "@react-pdf/renderer";

const LEAF_LEFT_ANGLES = [180, 160, 140, 120, 100, 80, 62, 46];
const LEAF_RIGHT_ANGLES = [198, 218, 238, 258, 278, 298, 316, 332];

function rotatePoint(x: number, y: number, angleDeg: number, cx = 100, cy = 100) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return {
    x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

/** PDF (react-pdf) version of the Achilleus Security mark — same geometry as the web SVG. */
export function PdfLogoMark({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {[...LEAF_LEFT_ANGLES, ...LEAF_RIGHT_ANGLES].map((angle) => {
        const { x, y } = rotatePoint(100, 26, angle);
        return <Ellipse key={angle} cx={x} cy={y} rx="7" ry="10" fill="#f1ae54" stroke="#050505" strokeWidth={1} />;
      })}
      <Path
        d="M72,138 C58,122 60,82 85,62 C100,50 118,52 128,65 C136,75 138,85 134,95 L130,120 C128,128 124,132 118,133 C122,140 118,148 105,150 C90,150 78,146 72,138 Z"
        fill="#f1ae54"
        stroke="#050505"
        strokeWidth={2.5}
      />
      <Ellipse cx="108" cy="90" rx="5" ry="8" fill="#050505" />
      <Path
        d="M95,55 C80,50 60,55 50,75 C45,90 48,105 58,118 C64,112 62,98 68,85 C74,72 84,62 95,55 Z"
        fill="#cb2026"
        stroke="#050505"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export function PdfClubBadge({
  abbreviation,
  primary,
  secondary = "#FFFFFF",
  size = 32,
}: {
  abbreviation: string;
  primary: string;
  secondary?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: primary,
        borderWidth: 1.5,
        borderColor: secondary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: secondary, fontSize: size * 0.26, fontFamily: "Helvetica-Bold" }}>
        {abbreviation}
      </Text>
    </View>
  );
}
