import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Sans_Hebrew } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const hebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew",
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NBA Card Album | Legendary Collection",
  description:
    "Private NBA card collection showcase — mint condition, bilingual Hebrew & English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${hebrew.variable} h-full font-sans antialiased`}
    >
      <body className="min-h-full bg-[#070604] text-zinc-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
