"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartData = [
  { time: "08:00", routes: 120, reroutes: 73 },
  { time: "10:00", routes: 180, reroutes: 91 },
  { time: "12:00", routes: 140, reroutes: 82 },
  { time: "14:00", routes: 220, reroutes: 54 },
  { time: "16:00", routes: 160, reroutes: 46 },
  { time: "18:00", routes: 260, reroutes: 20 },
];

const chartConfig = {
  routes: { label: "Routes", theme: { light: "#000000", dark: "#ffffff" } },
  reroutes: { label: "Reroutes", theme: { light: "#a1a1aa", dark: "#52525b" } },
} satisfies ChartConfig;

export default function HeroSection() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section
      suppressHydrationWarning
      className="container mx-auto px-6 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16 relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 space-y-8 text-center lg:text-left"
      >
        
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.05] transition-colors">
          Enterprise{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-600 via-zinc-400 to-zinc-500 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-600">
            Spatial
          </span>{" "}
          <br />
          Intelligence
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0 transition-colors">
          Monitor beacon health and visualize real-time routing engine activity
          within a professional command center.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <Button
            size="lg"
            className="h-14 px-8 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all text-base font-bold group shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Launch Dashboard{" "}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 w-full max-w-2xl"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl overflow-hidden rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl transition-colors">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 py-5 px-8 transition-colors">
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:shadow-[0_0_10px_rgba(255,255,255,0.8)]" />{" "}
              Live Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {isMounted ? (
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    className="text-zinc-500 text-xs font-medium"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-zinc-500 text-xs font-medium"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-black dark:text-white shadow-xl rounded-lg" />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="routes"
                    stroke="var(--color-routes)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--color-routes)", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reroutes"
                    stroke="var(--color-reroutes)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-80 w-full flex items-center justify-center">
                <span className="text-zinc-500 text-sm font-medium">
                  Loading telemetry...
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
