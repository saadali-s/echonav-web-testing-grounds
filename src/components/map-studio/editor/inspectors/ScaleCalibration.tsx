import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ScaleCalibration({ pixelDistance, onCalibrate }: { pixelDistance?: number | null; onCalibrate?: (s: number) => void; }) {
  const [meters, setMeters] = useState("");
  
  const handleCalibrate = () => {
    if (!pixelDistance || !meters) return;
    const parsedMeters = parseFloat(meters);
    if (isNaN(parsedMeters) || parsedMeters <= 0) return;
    onCalibrate?.(parsedMeters / pixelDistance);
  };

  return (
    <div className="p-5 space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase">Raw Pixel Distance</Label>
        <div className="text-xl font-black bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-950 p-3 text-center rounded-xl">
          {pixelDistance ? `${pixelDistance.toFixed(2)} px` : "Draw a line..."}
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase">Real-World Distance (Meters)</Label>
        <Input type="number" value={meters} onChange={(e) => setMeters(e.target.value)} placeholder="e.g., 1.5" className="text-center font-bold border-2 border-zinc-950 rounded-xl h-12" />
      </div>
      <Button onClick={handleCalibrate} disabled={!pixelDistance || !meters} className="w-full bg-indigo-600 text-white font-black uppercase h-12 rounded-xl border-2 border-zinc-950">Calibrate</Button>
    </div>
  );
}