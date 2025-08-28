// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/app/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata tetap di sini dan akan berfungsi dengan baik
export const metadata = {
  title: "Quran Bersama",
  description: "Aplikasi Belajar Al-Qur'an",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Bungkus children dengan komponen Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}