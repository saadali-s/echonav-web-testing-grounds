import { DataExport } from "./DataExport";
import { InstitutionalProfile } from "./InstitutionalProfile";

export function SettingsComposer() {
  return (
    <div className="space-y-8 flex flex-col h-full max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="shrink-0 border-b-2 border-zinc-950 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">System Settings</h1>
        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">Manage institutional configurations and data compliance.</p>
      </div>

      <div className="space-y-10 flex-1 pb-12">
        <InstitutionalProfile />
        <DataExport />
      </div>
    </div>
  );
}