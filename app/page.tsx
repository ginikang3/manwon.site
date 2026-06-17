import Navbar from "@/components/layout/Navbar";
import ToolSection from "@/components/sections/ToolSection";
// import InfoSection from "@/components/sections/InfoSection"; // 추후 구현

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-[#050706]">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lime-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-emerald-400/10 blur-[140px] rounded-full" />
      </div>

      <Navbar />
      <div className="relative max-w-4xl mx-auto px-4">
        <ToolSection />
        {/* <InfoSection /> */}
      </div>
    </main>
  );
}