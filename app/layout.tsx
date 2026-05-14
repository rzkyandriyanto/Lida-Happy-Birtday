import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lida's 23rd Birthday Wrapped 🎂",
  description:
    "Rekap perjalanan kita bersama — Selamat Ulang Tahun ke-23, Lida Ismawati!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} antialiased`}>
      <body className="bg-[#0a0a0a] text-[#faf5eb]">{children}</body>
    </html>
  );
}
