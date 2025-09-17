import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/gradients.css";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Админ панель - Mafia Game",
  description: "Административная панель Mafia Game",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 