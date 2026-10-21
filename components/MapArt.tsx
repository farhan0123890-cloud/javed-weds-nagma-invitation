import { useId } from "react";

/**
 * A stylised, non-geographic map illustration (decorative only). The real
 * location is opened through the "Get Directions" link, never inferred from this art.
 */
export default function MapArt({ roadLabel, variant = 0 }: { roadLabel: string; variant?: 0 | 1 }) {
  const uid = useId().replace(/:/g, "");
  const flip = variant === 1;
  return (
    <div className="map-frame">
      <svg viewBox="0 0 260 210" role="img" aria-label={`Decorative map showing ${roadLabel}`} className="map-art">
        <defs>
          <clipPath id={`${uid}-c`}>
            <path d="M14 210V84C14 40 60 14 130 6C200 14 246 40 246 84V210Z" />
          </clipPath>
          <path id={`${uid}-r`} d={flip ? "M-10 40L270 150" : "M-10 150L270 50"} />
        </defs>
        <g clipPath={`url(#${uid}-c)`}>
          <rect width="260" height="210" fill="#F4E8DC" />
          <g transform={flip ? "translate(260 0) scale(-1 1)" : undefined}>
            <path d="M-10 168C40 150 70 176 120 190C170 204 220 196 280 214V230H-10Z" fill="#DCDFCB" />
            <rect x="22" y="30" width="56" height="34" rx="5" fill="#EBDCCB" />
            <rect x="150" y="26" width="70" height="30" rx="5" fill="#EBDCCB" />
            <rect x="34" y="86" width="40" height="40" rx="5" fill="#EBDCCB" />
            <rect x="176" y="108" width="54" height="36" rx="5" fill="#EBDCCB" />
            <path d="M96 20L120 60L84 70Z" fill="#DCDFCB" />
            <path d="M0 98L260 110M70 0L90 210M200 0L180 210" stroke="#FFF9F4" strokeWidth="5" opacity=".9" />
          </g>
          <use href={`#${uid}-r`} stroke="#D8C2A6" strokeWidth="15" fill="none" />
          <use href={`#${uid}-r`} stroke="#FFF9F4" strokeWidth="12" fill="none" />
          <text fontSize="9" letterSpacing="1.4" fill="#73594D" opacity=".85" fontStyle="italic">
            <textPath href={`#${uid}-r`} startOffset={flip ? "26%" : "8%"}>
              {roadLabel}
            </textPath>
          </text>
          <ellipse cx="130" cy="124" rx="22" ry="8" fill="#73594D" opacity=".12" />
          <circle cx="130" cy="96" r="22" fill="#A8574E" opacity=".1" />
          <path d="M130 124C118 106 112 98 112 88a18 18 0 0 1 36 0c0 10-6 18-18 36Z" fill="#A8574E" />
          <circle cx="130" cy="88" r="6.5" fill="#FFF9F4" />
        </g>
        <path d="M14 210V84C14 40 60 14 130 6C200 14 246 40 246 84V210" fill="none" stroke="#B98D83" strokeWidth="1.4" />
      </svg>
    </div>
  );
}
