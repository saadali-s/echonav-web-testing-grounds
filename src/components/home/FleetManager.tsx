"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Send, Users } from "lucide-react";
import * as React from "react";

const mockLocations = [
  "Science Block - Floor 2",
  "Administration - Ground",
  "Art Center - Floor 1",
];
const mockStaff = [
  "Assign Technician...",
  "Alice Smith",
  "Bob Jones",
  "Charlie Davis",
];
const initialNodes = [
  { id: "1", label: "Lab 202 Entry", coordinates: "450, 120" },
  { id: "2", label: "Science Wing Stairwell", coordinates: "800, 120" },
  { id: "3", label: "Auditorium Doors", coordinates: "450, 600" },
  { id: "4", label: "IT Server Room", coordinates: "600, 400" },
];

export default function FleetManager() {
  const [selectedNodes, setSelectedNodes] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedStaff, setSelectedStaff] = React.useState(mockStaff[0]);

  const numSelected = Object.values(selectedNodes).filter(Boolean).length;
  const canCreateTasks = numSelected > 0 && selectedStaff !== mockStaff[0];

  return (
    <section
      suppressHydrationWarning
      className="container mx-auto px-6 relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14 space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white transition-colors">
          Fleet Management
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium transition-colors">
          Coordinate node deployment and field technician tasks.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Card className="w-full p-0 max-w-5xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-black backdrop-blur-xl transition-colors">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 py-6 px-8 transition-colors">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-zinc-950 dark:text-white transition-colors">
                Virtual Node Browser
              </CardTitle>
              <CardDescription className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors">
                Select hardware nodes to assign for regional maintenance.
              </CardDescription>
            </div>
            <Select defaultValue={mockLocations[0]}>
              <SelectTrigger className="w-full sm:w-65 h-10 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white transition-colors font-medium text-sm rounded-lg focus:ring-zinc-300 dark:focus:ring-zinc-500">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg shadow-xl">
                {mockLocations.map((loc) => (
                  <SelectItem
                    key={loc}
                    value={loc}
                    className="text-sm font-medium cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-zinc-900 dark:focus:text-white"
                  >
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-0 max-h-112.5 overflow-y-auto bg-transparent scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <Table>
              <TableHeader className="bg-white/90 dark:bg-zinc-950/90 sticky top-0 z-10 backdrop-blur-md transition-colors">
                <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800 transition-colors">
                  <TableHead className="w-15 pl-8">
                    <Checkbox className="rounded-sm border-zinc-300 dark:border-zinc-600 data-[state=checked]:bg-black data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black dark:data-[state=checked]:border-white" />
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-zinc-500 h-12">
                    Node Identity
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-zinc-500 pr-8 h-12">
                    Spatial Coordinates
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialNodes.map((node) => (
                  <TableRow
                    key={node.id}
                    className="border-b border-zinc-100 dark:border-zinc-800/50 group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors h-16"
                  >
                    <TableCell className="pl-8">
                      <Checkbox
                        className="rounded-sm border-zinc-300 dark:border-zinc-600 data-[state=checked]:bg-black data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black dark:data-[state=checked]:border-white transition-all"
                        checked={!!selectedNodes[node.id]}
                        onCheckedChange={(val) =>
                          setSelectedNodes((prev) => ({
                            ...prev,
                            [node.id]: val === true,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:border-zinc-300 dark:group-hover:border-zinc-500 group-hover:bg-white dark:group-hover:bg-zinc-900 transition-all shadow-sm">
                          <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                          {node.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs font-medium py-1 px-2.5 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-500 rounded-md group-hover:border-zinc-300 dark:group-hover:border-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors"
                      >
                        {node.coordinates}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center gap-4 border-t border-zinc-200 dark:border-zinc-800/80 py-5 px-8 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors">
            <div className="flex-1 flex w-full items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-colors">
                <Users className="h-4 w-4 text-zinc-400" />
              </div>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-full max-w-70 h-10 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white font-medium text-sm rounded-lg focus:ring-zinc-300 dark:focus:ring-zinc-500 transition-colors">
                  <SelectValue placeholder="Assign Technician..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg shadow-xl">
                  {mockStaff.map((staff) => (
                    <SelectItem
                      key={staff}
                      value={staff}
                      className="text-sm cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-zinc-900 dark:focus:text-white"
                    >
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className={cn(
                "w-full sm:w-auto h-10 px-8 rounded-lg font-bold text-sm transition-all duration-300",
                canCreateTasks
                  ? "bg-black text-white hover:bg-zinc-800 shadow-md dark:bg-white dark:hover:bg-zinc-200 dark:text-black "
                  : "bg-zinc-100 text-zinc-400 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800 cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-900",
              )}
              disabled={!canCreateTasks}
            >
              <Send className="h-3.5 w-3.5 mr-2" /> Create Tasks ({numSelected})
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}
