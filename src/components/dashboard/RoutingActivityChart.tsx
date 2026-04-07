"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { time: '08:00', routes: 120, reroutes: 12 },
  { time: '10:00', routes: 340, reroutes: 45 },
  { time: '12:00', routes: 450, reroutes: 80 },
  { time: '14:00', routes: 380, reroutes: 62 },
  { time: '16:00', routes: 210, reroutes: 18 },
  { time: '18:00', routes: 90, reroutes: 5 },
];

export function RoutingActivityChart() {
  return (
    <Card className="flex flex-col border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800">
        <CardTitle className="font-black uppercase text-sm">
          Routing Engine Activity
        </CardTitle>
      </CardHeader>

      {/* ✅ FIXED */}
      <CardContent className="p-6">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="routes" stroke="#18181b" strokeWidth={3} />
              <Line type="step" dataKey="reroutes" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}