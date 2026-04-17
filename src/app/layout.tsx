import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ELEVO — Digitalisierung für den deutschen Mittelstand",
  description:
    "ELEVO digitalisiert mittelständische Unternehmen in Deutschland: professionelle Websites, Prozessautomatisierung und Vertriebsdigitalisierung aus einer Hand.",
  keywords:
    "Digitalisierung, Mittelstand, Deutschland, Webentwicklung, Prozessautomatisierung, Vertriebsdigitalisierung",
  openGraph: {
    title: "ELEVO — Digitalisierung für den deutschen Mittelstand",
    description:
      "Wir digitalisieren mittelständische Unternehmen in Deutschland — mit messbaren Ergebnissen.",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
