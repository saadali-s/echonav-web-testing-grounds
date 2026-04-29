"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Activity, AlertTriangle, ArrowRight, Map, MapPin, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

// ADDED: address string to the interface
export interface MapData { id: string; name: string; address: string; privacy: "PUBLIC" | "PRIVATE"; stats: { nodes: number; edges: number }; health: "ONLINE" | "MAINTENANCE"; updatedAt: string; }

export function MapCard({ map }: { map: MapData }) {
  const isHealthy = map.health === "ONLINE";
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">(map.privacy);

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 group transition-all">
      <div className="h-40 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center border-b-2 border-zinc-950 dark:border-zinc-800 relative overflow-hidden">
        <Map className="h-12 w-12 text-zinc-950 dark:text-zinc-100 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        <Badge variant={privacy === "PUBLIC" ? "default" : "secondary"} className={`absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-md transition-colors ${privacy === "PRIVATE" ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : ""}`}>
          {privacy === "PRIVATE" && <ShieldAlert className="w-3 h-3 mr-1.5" />}
          {privacy === "PUBLIC" && <Shield className="w-3 h-3 mr-1.5" />}
          {privacy}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 space-y-5">
        <div>
          <h3 className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase truncate tracking-tight">{map.name}</h3>
          {/* ADDED: Address Display */}
          <div className="flex items-start gap-1.5 mt-1 text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="text-[11px] font-bold uppercase tracking-wide leading-tight">{map.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-900 p-3 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none uppercase tracking-wider">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-zinc-500" /><span className="text-lg font-black">{map.stats.nodes}</span> Nodes</div>
          <div className="w-0.5 h-6 bg-zinc-950 dark:bg-zinc-800"></div>
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-zinc-500" /><span className="text-lg font-black">{map.stats.edges}</span> Edges</div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-wider">
            {isHealthy ? (
              <><span className="relative flex h-3.5 w-3.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-zinc-950"></span></span><span className="text-emerald-700 dark:text-emerald-500">Hardware Online</span></>
            ) : (
              <><div className="h-5 w-5 bg-amber-100 border-2 border-amber-900 text-amber-900 flex items-center justify-center rounded-md shrink-0"><AlertTriangle className="h-3 w-3" /></div><span className="text-amber-700 dark:text-amber-500">Maintenance</span></>
            )}
          </div>
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-800">
            <span className={`text-[10px] font-black tracking-widest uppercase ${privacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>{privacy}</span>
            <Switch checked={privacy === "PUBLIC"} onCheckedChange={(checked) => setPrivacy(checked ? "PUBLIC" : "PRIVATE")} className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 scale-75 m-0" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Button className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0" asChild>
          <Link href={`/map-studio/${map.id}`}>OPEN MAPS <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}