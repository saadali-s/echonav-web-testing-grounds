"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BatteryWarning, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Healthy (>50%)', value: 110, color: '#18181b' }, 
  { name: 'Warning (15-50%)', value: 25, color: '#a1a1aa' },
  { name: 'Critical (<15%)', value: 7, color: '#ef4444' },
];

// Extended mock data to demonstrate pagination
const criticalReplacements = [
  { id: '1', label: 'UUID-8X92 (Lib)', battery: '8%' },
  { id: '2', label: 'UUID-4B11 (Sci)', battery: '12%' },
  { id: '3', label: 'UUID-9A33 (Gym)', battery: '14%' },
  { id: '4', label: 'UUID-2C22 (Caf)', battery: '9%' },
  { id: '5', label: 'UUID-7Y88 (Art)', battery: '11%' },
];

const ITEMS_PER_PAGE = 2;

export function HardwareHealthChart() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(criticalReplacements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = criticalReplacements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pb-4">
        <CardTitle className="font-black uppercase tracking-wider text-sm">Hardware Health</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5 flex flex-col items-center">
        <div className="h-[160px] w-full relative mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="dark:opacity-80" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#09090b', color: '#fff', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
            <span className="text-2xl font-black">142</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Beacons</span>
          </div>
        </div>
        
        {/* Paginated Critical Replacements List */}
        <div className="w-full space-y-2 border-t-2 border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black text-red-600 dark:text-red-500 uppercase tracking-wider flex items-center gap-1.5">
              <BatteryWarning className="h-3.5 w-3.5" /> Critical ({criticalReplacements.length})
            </h4>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-5 w-5 rounded border-2 border-zinc-200 dark:border-zinc-700" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-[9px] font-bold text-zinc-500 w-4 text-center">{currentPage}</span>
              <Button variant="outline" size="icon" className="h-5 w-5 rounded border-2 border-zinc-200 dark:border-zinc-700" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 min-h-[68px]">
            {currentItems.map(item => (
              <div key={item.id} className="text-[10px] font-bold flex justify-between bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30 text-zinc-700 dark:text-zinc-300">
                <span className="truncate pr-2">{item.label}</span> 
                <span className="text-red-600 dark:text-red-400">{item.battery}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}