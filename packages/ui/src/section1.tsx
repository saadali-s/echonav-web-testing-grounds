"use client";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, YAxis } from "recharts";
import styles from "./styles/section1.module.css"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart"

const chartData = [
    { time: "08:00", routes: 120, reroutes: 73 },
    { time: "10:00", routes: 180, reroutes: 91 },
    { time: "12:00", routes: 140, reroutes: 82 },
    { time: "14:00", routes: 220, reroutes: 54 },
    { time: "16:00", routes: 160, reroutes: 46 },
    { time: "18:00", routes: 260, reroutes: 20 },
]
const charData2 = [
    { time: "08:00", routes: 100, reroutes: 15 },
    { time: "10:00", routes: 300, reroutes: 30 },
    { time: "12:00", routes: 400, reroutes: 60 },
    { time: "14:00", routes: 350, reroutes: 50 },
    { time: "16:00", routes: 200, reroutes: 10 },
    { time: "18:00", routes: 80, reroutes: 3 },
]
const chartConfig = {
    routes: {
        label: "Routes",
        color: `blue`,
    },
    reroutes: {
        label: "Reroutes",
        color: "red",
    },
} satisfies ChartConfig;

export default function Section1() {
    return (
        <section className="flex items-center justify-center flex-col gap-6">
            <h1 className={styles.h1}>
                Your Ultimate Beacon Management Solution
            </h1>
            <h2 className={styles.h2}>
                Keep track of your beacons' efficiency and performance
            </h2>
            <div className="flex flex-row items-center gap-6">
            <ChartContainer config={chartConfig} className={`h-[400px] w-[800px] ${styles.chartContainer} border border-primary rounded-lg p-10`}>
                <LineChart margin={{ left: 12, right: 12 }} data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                        type="monotone"
                        dataKey="routes"
                        stroke="var(--color-routes)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "white", stroke: "black", strokeWidth: 2 }}
                    />
                    <Line
                        type="stepAfter"
                        dataKey="reroutes"
                        stroke="var(--color-reroutes)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "white", stroke: "red", strokeWidth: 2 }}
                    />
                </LineChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className={`h-[400px] w-[800px] ${styles.chartContainer} border border-primary rounded-lg p-10`}>
                <LineChart margin={{ left: 12, right: 12 }} data={charData2}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                        type="monotone"
                        dataKey="routes"
                        stroke="var(--color-routes)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "white", stroke: "black", strokeWidth: 2 }}
                    />
                    <Line
                        type="stepAfter"
                        dataKey="reroutes"
                        stroke="var(--color-reroutes)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "white", stroke: "red", strokeWidth: 2 }}
                    />
                </LineChart>
            </ChartContainer>
            </div>
        </section>
    )
}