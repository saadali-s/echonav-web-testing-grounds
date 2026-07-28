"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Clock, Map } from "lucide-react";

interface MapCardProps {
  title: string;
  updated: string;
  nodes: number;
  edges: number;
  status: string;
  statusColor: string;
}

export default function MapDirectory() {
  return (
    <section
      suppressHydrationWarning
      className="container mx-auto px-6 flex flex-col items-center gap-16"
    >
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white transition-colors">
          Studio Directory
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium transition-colors">
          Manage floor designs, architectural layouts, and spatial routing
          graphs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {[
          {
            title: "Science Block - Floor 2",
            updated: "2 hours ago",
            nodes: 42,
            edges: 68,
            status: "Online",
            statusColor: "bg-emerald-500 dark:bg-emerald-400",
          },
          {
            title: "Engineering Block - Floor 1",
            updated: "30 mins ago",
            nodes: 50,
            edges: 75,
            status: "Online",
            statusColor: "bg-emerald-500 dark:bg-emerald-400",
          },
          {
            title: "Main Building - Floor 3",
            updated: "1 day ago",
            nodes: 60,
            edges: 90,
            status: "Alert",
            statusColor: "bg-amber-500 dark:bg-amber-400",
          },
        ].map((map, i) => (
          <motion.div
            key={map.title}
            custom={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
            }}
            viewport={{ once: true }}
          >
            <MapCard {...map} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MapCard({
  title,
  updated,
  nodes,
  edges,
  status,
  statusColor,
}: MapCardProps) {
  return (
    <Card
      suppressHydrationWarning
      className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full group backdrop-blur-sm"
    >
      <div
        className={`aspect-video flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800/80 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 transition-colors`}
      >
        {/* Minimalist Topographical overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-200/60 dark:from-zinc-800/40 to-transparent opacity-50 transition-colors" />
        <Badge
          variant="secondary"
          className="absolute top-4 left-4 bg-white/80 dark:bg-black/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-md px-2.5 py-1 transition-colors"
        >
          Public Access
        </Badge>
        <Map
          className="w-10 h-10 text-zinc-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-500 z-10"
          strokeWidth={1.5}
        />
      </div>

      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-xl font-bold text-zinc-950 dark:text-white leading-tight transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-2 transition-colors">
          <Clock className="w-3.5 h-3.5" /> Updated {updated}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2 grow">
        <div className="flex items-center justify-around p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800/50 shadow-inner transition-colors">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Nodes
            </span>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                {nodes}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 transition-colors" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Edges
            </span>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                {edges}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 pb-6 px-6 mt-auto">
        <div className="flex items-center gap-2 w-full px-1">
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusColor}`}
          ></span>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors">
            {status}
          </span>
        </div>
        <Button className="w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-none rounded-lg h-11 font-bold text-sm transition-all duration-300">
          Open Architect{" "}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
