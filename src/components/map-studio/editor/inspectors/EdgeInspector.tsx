import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EdgeInspector({ meters }: { meters?: number | null }) {
  return (
    <div className="p-5 space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase tracking-widest">Calculated Distance</Label>
        <div className="flex items-center gap-3">
          <Input readOnly value={meters ? meters.toFixed(2) : "--"} className="text-xl font-black bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 rounded-xl w-28 h-14 text-center" />
          <span className="text-sm font-black uppercase tracking-widest">Meters</span>
        </div>
      </div>
    </div>
  );
}