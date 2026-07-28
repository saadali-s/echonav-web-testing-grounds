import { DataExport } from "./DataExport";
import { InstitutionalProfile } from "./InstitutionalProfile";
import React from "react";

export function SettingsComposer() {
  return (
    <div className="space-y-8 flex flex-col h-full">
      {/* Header Section */}
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
              System Settings
            </h1>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
              Manage institutional configurations and data compliance.
            </p>
          </div>
      </div>

      <div className="space-y-10 flex-1 pb-12 max-w-4xl mx-auto w-full">
        <InstitutionalProfile />
        <DataExport />
      </div>
    </div>
  );
}