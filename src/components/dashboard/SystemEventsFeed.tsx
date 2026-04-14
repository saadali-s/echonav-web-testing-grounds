import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Link as LinkIcon, RadioTower, UserPlus } from 'lucide-react';
import React from 'react';

export interface SystemEvent {
  id: string;
  type: 'HAZARD' | 'CALIBRATION' | 'BEACON_LINKED' | 'USER_REGISTERED';
  title: string;
  description: string;
  timeAgo: string;
}

const textureStyle = { 
  backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)' 
};

// Helper function to dynamically style the event icons based on their type
const getEventStyling = (type: SystemEvent['type']) => {
  switch (type) {
    case 'HAZARD':
      return {
        icon: <AlertTriangle className="h-5 w-5" />,
        colors: 'bg-amber-100 border-amber-900 text-amber-900 dark:bg-amber-950/50 dark:text-amber-500'
      };
    case 'CALIBRATION':
      return {
        icon: <RadioTower className="h-5 w-5" />,
        colors: 'bg-emerald-100 border-emerald-900 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-500'
      };
    case 'BEACON_LINKED':
      return {
        icon: <LinkIcon className="h-5 w-5" />,
        colors: 'bg-blue-100 border-blue-900 text-blue-900 dark:bg-blue-950/50 dark:text-blue-500'
      };
    case 'USER_REGISTERED':
      return {
        icon: <UserPlus className="h-5 w-5" />,
        colors: 'bg-violet-100 border-violet-900 text-violet-900 dark:bg-violet-950/50 dark:text-violet-500'
      };
    default:
      return {
        icon: <RadioTower className="h-5 w-5" />,
        colors: 'bg-zinc-100 border-zinc-900 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400'
      };
  }
};

export function SystemEventsFeed({ events }: { events: SystemEvent[] }) {
  return (
    <Card className="relative h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none" style={textureStyle} />
      
      <CardHeader className="relative z-10 border-b-2 border-zinc-950 dark:border-zinc-800 bg-rose-100 dark:bg-rose-900 px-5 py-3 shrink-0">
        <CardTitle className="font-black uppercase tracking-wider text-sm text-rose-950 dark:text-rose-100">
          Recent System Events
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 flex-1 overflow-y-auto p-5">
        <div className="space-y-5">
            {events.length > 0 ? (
              events.map((event, index) => {
                const isLast = index === events.length - 1;
                const style = getEventStyling(event.type);
                
                return (
                  <div key={event.id} className={`flex items-start gap-4 ${!isLast ? 'border-b-2 border-zinc-100 dark:border-zinc-800 pb-5' : ''}`}>
                      <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center shrink-0 ${style.colors}`}>
                          {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-zinc-950 dark:text-zinc-100 truncate">{event.title}</p>
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{event.description}</p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-2 uppercase font-bold tracking-widest">{event.timeAgo}</p>
                      </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest">
                No recent activity
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}