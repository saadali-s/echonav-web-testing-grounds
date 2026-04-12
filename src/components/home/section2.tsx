import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, ArrowRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Section2() {
    return (
        <section className="flex flex-col items-center gap-4">
            <h1 className="text-[2.5rem] font-bold tracking-[0.05rem] mb-2 font-[family-name:var(--font-sans)] text-black">
                A Studio Directory Catered to Your Needs
            </h1>
            <h2 className="text-2xl text-[color:var(--muted-foreground)]">
                Manage your studio floor designs and routing graphs
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 p-10 border border-black rounded-[1.25rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <MapCard Title="Science Block - Floor 2" Updated="Updated 2 hours ago" Nodes={42} Edges={68} Status="All Hardware Online" BackgroundColor="bg-green-500" Color="text-green-500" />
                <MapCard Title="Engineering Block - Floor 1" Updated="Updated 30 minutes ago" Nodes={50} Edges={75} Status="All Hardware Online" BackgroundColor="bg-green-500" Color="text-green-500" />
                <MapCard Title="Main Building - Floor 3" Updated="Updated 1 day ago" Nodes={60} Edges={90} Status="Maintenance Required" BackgroundColor="bg-red-500" Color="text-red-500" />
            </div>
        </section>
    )
}

export function MapCard({Title = " ", Updated = " ", Nodes = 0, Edges = 0, Status = " ", BackgroundColor = " ", Color = " "} : {Title?: string, Updated?: string, Nodes?: number, Edges?: number, Status?: string, BackgroundColor?: string, Color?: string}) {
  return (
    <Card className="flex flex-col overflow-hidden bg-white border-[2px] border-black rounded-[1.25rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[450px]">
      <div className="relative flex items-center justify-center min-h-[180px] bg-[#ffffff] border-b-2 border-black">
        <Badge className="absolute top-4 left-4 bg-black text-white hover:bg-black rounded-[5px] px-4 font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
          PUBLIC
        </Badge>
        <Map className="w-16 h-16 text-black stroke-[1.5]" />
      </div>
      <CardContent className="p-6">
        <div className="space-y-1">
          <CardHeader className="text-2xl font-black uppercase tracking-tight text-black relative left-[-18px] top-[-2px]">
            {Title}
          </CardHeader>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {Updated}
          </p>
        </div>
        <CardContent className="flex items-center justify-between px-4 py-3 my-6 border-2 border-black rounded-xl">
          <CardDescription className="flex items-center gap-2 text-black">
            <Activity className="w-4 h-4 text-zinc-400" />
            <span className="text-xl font-black">{Nodes}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Nodes</span>
          </CardDescription>
          <div className="w-[2px] h-6 bg-zinc-200" />
          <CardDescription className="flex items-center gap-2 text-black">
            <Activity className="w-4 h-4 text-zinc-400" />
            <span className="text-xl font-black">{Edges}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Edges</span>
          </CardDescription>
        </CardContent>

        <CardFooter className="flex items-center gap-2 mb-6 bg-white border-none">
          <div className={`w-3 h-3 rounded-full ${BackgroundColor} border-[1.5px] border-black`} />
          <span className={`text-[10px] font-black ${Color} uppercase tracking-wider`}>
            {Status}
          </span>
        </CardFooter>
        <button className="flex items-center justify-center w-full gap-2 p-4 font-black text-white uppercase transition-colors bg-black rounded-xl hover:bg-zinc-800">
          Open Architect <ArrowRight className="w-4 h-4" />
        </button>
      </CardContent>
    </Card>
  );
}