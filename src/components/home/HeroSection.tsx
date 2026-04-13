"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { motion } from "framer-motion";
import { ArrowRight, Cpu } from "lucide-react";
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
    routes: { label: "Routes", color: "#ffffff" }, 
    reroutes: { label: "Reroutes", color: "#52525b" }, 
} satisfies ChartConfig;

export default function HeroSection() {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section suppressHydrationWarning className="container mx-auto px-6 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-8 text-center lg:text-left"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur-md shadow-sm">
                    <Cpu className="w-3.5 h-3.5 text-zinc-400" /> Powered by iBeacons
                </div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                    Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">Spatial</span> <br />Intelligence
                </h1>
                <p className="text-lg text-zinc-400 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                    Monitor beacon health and visualize real-time routing engine activity within a professional command center.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Button size="lg" className="h-14 px-8 rounded-lg bg-white text-black hover:bg-zinc-200 transition-all text-base font-bold group shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Launch Dashboard <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 w-full max-w-2xl"
            >
                <Card className="border-zinc-800 shadow-2xl overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl">
                    <CardHeader className="border-b border-zinc-800/80 bg-zinc-950/50 py-5 px-8">
                        <CardTitle className="text-sm font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" /> Live Telemetry
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {isMounted ? (
                            <ChartContainer config={chartConfig} className="h-[320px] w-full">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke="#27272a" strokeDasharray="4 4" />
                                    <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={12} className="text-zinc-500 text-xs font-medium" />
                                    <YAxis axisLine={false} tickLine={false} className="text-zinc-500 text-xs font-medium" />
                                    <ChartTooltip content={<ChartTooltipContent className="bg-zinc-950 border-zinc-800 text-white shadow-2xl rounded-lg" />} />
                                    <Line type="monotone" dataKey="routes" stroke="var(--color-routes)" strokeWidth={3} dot={{ r: 4, fill: "#000", strokeWidth: 2, stroke: "var(--color-routes)" }} activeDot={{ r: 6, fill: "#fff" }} />
                                    <Line type="monotone" dataKey="reroutes" stroke="var(--color-reroutes)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                                </LineChart>
                            </ChartContainer>
                        ) : (
                            <div className="h-[320px] w-full flex items-center justify-center">
                                <span className="text-zinc-600 text-sm font-medium">Loading telemetry...</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    );
}