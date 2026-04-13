import FleetManager from "./FleetManager";
import GlobalFooter from "./GlobalFooter";
import HeroSection from "./HeroSection";
import MapDirectory from "./MapDirectory";
import NavigationBar from "./NavigationBar";

export default function Home() {
  return (
    <div suppressHydrationWarning className="flex flex-col w-full bg-black min-h-screen text-zinc-50 font-sans selection:bg-zinc-800">
      <NavigationBar />
      <main className="flex flex-col w-full pt-20"> 
        {/* Premium stark ambient background */}
        <div className="relative overflow-hidden w-full bg-black">
            {/* Subtle top spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Grid pattern overlay for structural tech feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <HeroSection />
        </div>
        
        {/* Directory Section */}
        <div className="bg-zinc-950 border-y border-zinc-800/50 py-24 shadow-2xl relative z-10">
            <MapDirectory />
        </div>
        
        {/* Fleet Manager Section */}
        <div className="bg-black py-24 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-zinc-900/30 blur-[150px] rounded-full pointer-events-none" />
            <FleetManager />
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}