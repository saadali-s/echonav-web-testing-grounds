"use client";
import * as React from "react"
import { MapPin, Users, Send } from "lucide-react"

// Assuming these are configured in your shadcn/ui setup
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// --- Mock Data ---
const mockLocations = [
    "SCIENCE BLOCK - FLOOR 2",
    "ADMINISTRATION - GROUND",
    "ART CENTER - FLOOR 1",
]

const mockStaff = [
    "Assign Technician...", // Placeholder
    "Alice Smith",
    "Bob Jones",
    "Charlie Davis",
]

const initialNodes = [
    { id: "1", label: "LAB 202 ENTRY", coordinates: "X:450 Y:120" },
    { id: "2", label: "SCIENCE WING STAIRWELL", coordinates: "X:800 Y:120" },
    { id: "3", label: "AUDITORIUM DOORS", coordinates: "X:450 Y:600" },
    { id: "4", label: "IT SERVER ROOM", coordinates: "X:600 Y:400" }, // Added some extra data for scroll
]

export default function VirtualNodeBrowser() {
    const [nodes, setNodes] = React.useState(initialNodes)
    const [selectedNodes, setSelectedNodes] = React.useState<Record<string, boolean>>({})
    const [selectedStaff, setSelectedStaff] = React.useState(mockStaff[0])

    // --- Handlers ---
    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        const isChecked = checked === true
        const newSelection: Record<string, boolean> = {}
        if (isChecked) {
            nodes.forEach((node) => {
                newSelection[node.id] = true
            })
        }
        setSelectedNodes(newSelection)
    }

    const handleRowSelect = (id: string, isChecked: boolean) => {
        setSelectedNodes((prev) => ({
            ...prev,
            [id]: isChecked,
        }))
    }

    // --- Derived State ---
    const numSelected = Object.values(selectedNodes).filter(Boolean).length
    const allSelected = nodes.length > 0 && numSelected === nodes.length
    const isIndeterminate = numSelected > 0 && numSelected < nodes.length

    const canCreateTasks = numSelected > 0 && selectedStaff !== mockStaff[0]

    return (
        <section className="flex flex-col items-center w-full py-12 px-4 bg-muted/20 min-h-screen antialiased font-sans">
            <div className="text-center mb-10">
                <h1 className="text-[2.5rem] font-bold tracking-[0.05rem] mb-2 font-[family-name:var(--font-sans)] text-black">
                    Fleet Management
                </h1>
                <h2 className="text-2xl text-[color:var(--muted-foreground)]">
                    Manage your fleet and routing graphs
                </h2>
            </div>
            <div className="w-full flex justify-center">
                <Card className="w-full max-w-5xl h-[600px] border-black border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-black py-4 px-6 space-y-0 flex-shrink-0">
                        <div>
                            <CardTitle className="text-xl font-bold uppercase tracking-tight text-black">
                                Virtual Node Browser
                            </CardTitle>
                            <CardDescription className="text-sm font-medium uppercase tracking-wide text-muted-foreground mt-0.5">
                                Select unassigned nodes for deployment.
                            </CardDescription>
                        </div>
                        <Select defaultValue={mockLocations[0]}>
                            <SelectTrigger className="w-[280px] h-11 border-black border-2 rounded-lg font-bold text-base px-5 text-black">
                                <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockLocations.map((loc) => (
                                    <SelectItem key={loc} value={loc} className="font-semibold text-base">
                                        {loc}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-black hover:bg-transparent">
                                    <TableHead className="w-[80px] pl-6 py-5">
                                        <Checkbox
                                            className="h-6 w-6 rounded border-black border-2 data-[state=checked]:bg-black data-[state=checked]:text-white"
                                            checked={allSelected ? true : (isIndeterminate ? 'indeterminate' : false)}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        Node Label
                                    </TableHead>
                                    <TableHead className="text-right text-sm font-bold uppercase tracking-wider text-muted-foreground pr-6">
                                        Coordinates
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nodes.map((node) => {
                                    const isSelected = !!selectedNodes[node.id]
                                    return (
                                        <TableRow
                                            key={node.id}
                                            className={cn(
                                                "border-b border-muted hover:bg-muted/30 transition-colors",
                                                isSelected && "bg-muted/30"
                                            )}
                                        >
                                            <TableCell className="pl-6 py-4">
                                                <Checkbox
                                                    className="h-6 w-6 rounded border-black border-2 data-[state=checked]:bg-black data-[state=checked]:text-white"
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleRowSelect(node.id, checked === true)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 border border-muted rounded-xl flex items-center justify-center bg-white/50">
                                                        <MapPin className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-lg font-bold uppercase text-black">
                                                        {node.label}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="outline" className="font-mono text-sm font-semibold py-1.5 px-3 border border-muted-foreground/30 bg-muted/20 text-muted-foreground/80 rounded-lg">
                                                    {node.coordinates}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center gap-4 border-t border-black py-4 px-6 flex-shrink-0">
                        <div className="flex flex-row flex-1 items-center gap-2">
                            <div className="h-12 w-12 border border-black border-2 rounded-xl flex items-center justify-center bg-white">
                                <Users className="h-6 w-6 text-black" strokeWidth={2} />
                            </div>
                            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                                <SelectTrigger className="flex-1 h-12 border-black border-2 rounded-lg font-semibold text-lg px-5 text-muted-foreground">
                                    <SelectValue placeholder="Assign Technician..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockStaff.map((staff, index) => (
                                        <SelectItem key={staff} value={staff} className="text-base">
                                            {staff}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            size="lg"
                            className={cn(
                                "h-12 px-8 rounded-lg font-bold text-lg border border-black border-2 flex gap-3 transition-colors",
                                canCreateTasks
                                    ? "bg-black text-white hover:bg-black/90 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]"
                                    : "bg-muted-foreground text-white cursor-not-allowed opacity-70"
                            )}
                            disabled={!canCreateTasks}
                        >
                            <Send className="h-5 w-5" />
                            <span>CREATE TASKS ({numSelected})</span>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    )
}