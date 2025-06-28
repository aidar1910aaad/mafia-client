import HeroSection from "@/components/Hero/HeroSection";
import Leaderboards from "@/components/Leaderboards/Leaderboards";
import AuthGuard from "@/components/Auth/AuthGuard";

export default function Home() {
  return (
    <AuthGuard requireAuth={false} requireAdmin={false}>
      <div className="bg-[#161616]">
        <HeroSection />
        <Leaderboards />
      </div>
    </AuthGuard>
  );
}