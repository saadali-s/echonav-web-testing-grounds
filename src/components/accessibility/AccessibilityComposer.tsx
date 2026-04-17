import { ActivePin, ActivePinsTable } from "./ActivePinsTable";
import { PinGeneratorCard } from "./PinGeneratorCard";

// --- Mock Data ---
const mockActivePins: ActivePin[] = [
  { id: "p1", codeMasked: "812 ***", generatedBy: "Sarah Jenkins", timeRemaining: "04:12", status: "AWAITING_DEVICE" },
  { id: "p2", codeMasked: "491 ***", generatedBy: "Dr. Mabaso", timeRemaining: "01:45", status: "AWAITING_DEVICE" },
  { id: "p3", codeMasked: "--- ---", generatedBy: "Michael Chen", timeRemaining: "00:00", status: "CONSUMED" },
];
// -----------------

export function AccessibilityComposer() {
  return (
    <div className="space-y-8 flex flex-col h-full">
      <div className="shrink-0 border-b-2 border-zinc-950 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">Accessibility Desk</h1>
        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">Manage mobile device provisioning for visually impaired students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pb-8">
        {/* The Generator Card takes up 5 columns on large screens */}
        <div className="lg:col-span-5 h-125 lg:h-full">
          <PinGeneratorCard />
        </div>
        
        {/* The Table takes up the remaining 7 columns */}
        <div className="lg:col-span-7 h-100 lg:h-full">
          <ActivePinsTable pins={mockActivePins} />
        </div>
      </div>
    </div>
  );
}