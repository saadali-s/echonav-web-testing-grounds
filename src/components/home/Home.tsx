import FleetManager from "./FleetManager";
import GlobalFooter from "./GlobalFooter";
import HeroSection from "./HeroSection";
import MapDirectory from "./MapDirectory";

export default function Home() {
  return (
    <div
      suppressHydrationWarning
      className="flex flex-col w-full bg-white dark:bg-black min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300"
    >
      <main className="flex flex-col w-full pt-20">
        <div className="relative overflow-hidden w-full bg-white dark:bg-black transition-colors duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-100 bg-zinc-200/50 dark:bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

          <HeroSection />
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800/50 py-24 shadow-xl dark:shadow-2xl relative z-10 transition-colors duration-300">
          <MapDirectory />
        </div>

        <div className="bg-white dark:bg-black py-24 relative overflow-hidden transition-colors duration-300">
          <div className="absolute bottom-0 right-0 w-150 h-150 bg-zinc-200/50 dark:bg-zinc-900/30 blur-[150px] rounded-full pointer-events-none" />
          <FleetManager />
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}
