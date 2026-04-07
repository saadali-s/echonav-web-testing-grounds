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

export interface FloorPlan {
  id: string;
  name: string;
  building: string;
  updatedAt: string;
}

export function RecentMapsCarousel({ plans }: { plans: FloorPlan[] }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
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
              <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                {/* Mock Map Thumbnail Area */}
                <div className="h-32 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
                  <Map className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                </div>
                
                <CardContent className="p-4 flex flex-col gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium">
                      {plan.building}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">
                      Updated {plan.updatedAt}
                    </p>
                  </div>
                  
                  {/* Quick-action button to jump straight to the editor */}
                  <Button variant="secondary" size="sm" className="w-full text-xs font-semibold" asChild>
                    <Link href={`/map-studio/${plan.id}`}>
                      Open in Editor <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Arrows placed top-right for a clean look */}
        <div className="absolute -top-10 right-12 flex gap-2">
            <CarouselPrevious className="relative top-0 right-0 left-0 transform-none h-8 w-8 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" />
            <CarouselNext className="relative top-0 right-0 left-0 transform-none h-8 w-8 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" />
        </div>
      </Carousel>
    </div>
  );
}