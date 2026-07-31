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

const textureStyle = {
  backgroundImage:
    "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)",
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
            <CarouselItem
              key={plan.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="overflow-hidden p-0 border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none bg-white dark:bg-zinc-950 transition-transform hover:-translate-y-1">
                <div className="relative h-32 bg-amber-300 dark:bg-amber-500 flex items-center justify-center border-b-2 border-zinc-950 dark:border-zinc-800">
                  <div className="relative z-10 h-12 w-12 bg-white border-2 border-zinc-950 rounded-xl  flex items-center justify-center transform -rotate-6">
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

                  <Button
                    className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0"
                    asChild
                  >
                    <Link href={`/map-studio/${plan.id}`}>
                      Open Editor <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute -top-10 right-12 flex gap-2">
          <CarouselPrevious className="relative top-0 right-0 left-0 transform-none h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-950 dark:text-white  dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-800" />
          <CarouselNext className="relative top-0 right-0 left-0 transform-none h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-950 dark:text-white  dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-800" />
        </div>
      </Carousel>
    </div>
  );
}
