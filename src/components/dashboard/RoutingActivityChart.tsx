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

const textureStyle = { 
  backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)' 
};

export function RoutingActivityChart() {
  return (
    <Card className="relative flex flex-col border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none overflow-hidden h-full">
      <div className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none" style={textureStyle} />
      
      <CardHeader className="relative z-10 border-b-2 border-zinc-950 dark:border-zinc-800 bg-violet-100 dark:bg-violet-900 px-5 py-3 shrink-0">
        <CardTitle className="font-black uppercase text-sm tracking-wider text-violet-950 dark:text-violet-100">
          Routing Engine Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 p-6 flex-1 min-h-0">
        <div className="w-full h-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#a1a1aa" opacity={0.4} />
              <XAxis dataKey="time" tick={{ fill: '#71717a', fontWeight: 'bold', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#71717a', fontWeight: 'bold', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', color: '#fff', border: '2px solid #000', borderRadius: '8px', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="routes" name="Successful Routes" stroke="#8b5cf6" strokeWidth={4} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              <Line type="step" dataKey="reroutes" name="Reroutes (Hazards)" stroke="#f43f5e" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}