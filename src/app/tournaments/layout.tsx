import type { Metadata } from "next";
import "@/styles/gradients.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "Турниры - Mafia Game",
  description: "Турниры по игре Мафия",
};

export default function TournamentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#161616]">
      {children}
    </div>
  );
}