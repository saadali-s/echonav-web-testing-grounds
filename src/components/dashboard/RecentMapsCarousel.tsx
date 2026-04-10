import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface FloorPlan {
  id: string;
  name: string;
  building: string;
  updatedAt: string;
}

const textureStyle = { 
  backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)' 
};

export function RecentMapsCarousel({ plans }: { plans: FloorPlan[] }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
          Recently Updated Floor Plans
        </h3>
      </div>
      
      <Carousel
        opts={{ align: "start", loop: false }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {plans.map((plan) => (
            <CarouselItem key={plan.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="overflow-hidden border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 transition-transform hover:-translate-y-1">
                
                {/* Textured Vibrant Map Thumbnail Area */}
                <div className="relative h-32 bg-amber-300 dark:bg-amber-500 flex items-center justify-center border-b-2 border-zinc-950 dark:border-zinc-800">
                  <div className="absolute inset-0 opacity-[0.15] text-zinc-950 pointer-events-none" style={textureStyle} />
                  <div className="relative z-10 h-12 w-12 bg-white border-2 border-zinc-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center transform -rotate-6">
                    <Map className="h-6 w-6 text-zinc-950" />
                  </div>
                </div>
                
                <CardContent className="p-4 flex flex-col gap-3">
                  <div>
                    <h4 className="font-black text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-bold mt-0.5">
                      {plan.building}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase font-black tracking-widest">
                      Updated {plan.updatedAt}
                    </p>
                  </div>
                  
                  <Button className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-black tracking-widest uppercase h-10 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none gap-2 text-[10px]" asChild>
                    <Link href={`/map-studio/${plan.id}`}>
                      Open Editor <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Arrows */}
        <div className="absolute -top-10 right-12 flex gap-2">
            <CarouselPrevious className="relative top-0 right-0 left-0 transform-none h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-950 dark:text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-800" />
            <CarouselNext className="relative top-0 right-0 left-0 transform-none h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-950 dark:text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-800" />
        </div>
      </Carousel>
    </div>
  );
}