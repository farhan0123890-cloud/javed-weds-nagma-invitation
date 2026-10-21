import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/amiri/arabic-400.css";
import "./globals.css";
import { couple } from "@/data/wedding";

const title = `${couple.groom.name} & ${couple.bride.name} — Wedding Invitation`;

export const metadata: Metadata = {
  title,
  description: "You are warmly invited to celebrate our wedding: Manda, Nikkah Ceremony and Reception, 5–7 December 2026.",
  robots: { index: false, follow: false },
  openGraph: { title, type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EAD5CC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
