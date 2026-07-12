import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import React from 'react';

export interface SystemEvent {
  id: string;
  status: 'ACTIVE' | 'RESOLVED';
  hazardType: string;
  nodeLabel: string;
  buildingName: string;
  floorPlanName: string; 
  timestamp: string;
}

export function SystemEventsFeed({ events }: { events: SystemEvent[] }) {
  return (
    <Card className="relative h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      
      <CardHeader className="relative z-10 border-b-2 border-zinc-950 dark:border-zinc-800 bg-rose-100 dark:bg-rose-900 px-5 py-3 shrink-0">
        <CardTitle className="font-black uppercase tracking-wider text-sm text-rose-950 dark:text-rose-100">
          Recent Hazards Log
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 flex-1 overflow-y-auto p-5">
        <div className="space-y-5">
            {events.length > 0 ? (
              events.map((event, index) => {
                const isLast = index === events.length - 1;
                const isActive = event.status === 'ACTIVE';
                
                return (
                  <div key={event.id} className={`flex items-start gap-4 ${!isLast ? 'border-b-2 border-zinc-100 dark:border-zinc-800 pb-5' : ''}`}>
                      <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 ${isActive ? 'bg-amber-100 border-amber-900 text-amber-900 dark:bg-amber-950/50 dark:text-amber-500' : 'bg-emerald-100 border-emerald-900 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-500'}`}>
                          {isActive ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-zinc-950 dark:text-zinc-100">
                            {isActive ? `Hazard - ${event.hazardType} - ${event.timestamp}` : `Hazard resolved - ${event.hazardType} - ${event.timestamp}`}
                          </p>
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                            {event.nodeLabel} - {event.buildingName} - {event.floorPlanName}
                          </p>
                      </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest">
                No active hazards
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}