import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Yana's Summer Maths Adventure",
  description:
    "A playful summer maths tracker — tick off each day, earn stars, and grow your kitten to maths champion!",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Yana Maths" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // allow pinch-zoom (a11y) but stop iOS auto-zoom surprises
  viewportFit: "cover", // let us paint into the Dynamic Island / home-indicator safe areas
  themeColor: "#5a4be7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
