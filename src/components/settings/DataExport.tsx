"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapStudioActions } from "@/lib/actions/mapStudio";
import { DownloadCloud, FileJson, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function DataExport() {
  const { activeOrgId } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!activeOrgId) return;
    setIsExporting(true);
    try {
      const blob = await mapStudioActions.downloadExportZip(
        Number(activeOrgId),
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Backup.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export maps. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="rounded-xl p-0 border-2 border-zinc-950 dark:border-zinc-800 dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-indigo-300 dark:bg-indigo-900/50 p-5">
        <CardTitle className="text-sm font-black bg-slate-90 uppercase tracking-wider flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Data Compliance & Export
        </CardTitle>
        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
          Generate backups of floor plans.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 bg-size-[16px_16px]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center shrink-0  dark:shadow-none">
              <FileJson className="h-6 w-6 text-zinc-950 dark:text-zinc-100" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">
                Master System Backup
              </h4>
              <p className="text-[11px] font-bold text-zinc-500 mt-1 max-w-md leading-relaxed uppercase tracking-wider">
                Download backup files of floor plans
              </p>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full sm:w-auto shrink-0 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-950 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-black uppercase tracking-wider h-12 px-6  dark:shadow-none transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none disabled:opacity-50"
          >
            <DownloadCloud className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Trigger Export"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
