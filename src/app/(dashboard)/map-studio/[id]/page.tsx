import { BuildingMapsComposer } from "@/components/map-studio/BuildingMapsComposer";

// Ideally, move this to @/lib/mock-data.ts so it's shared across the app
const mockBuildings = [
  { id: "b-1", name: "A Les", address: "123 University Rd, Johannesburg, 2092" },
  { id: "b-2", name: "B Les", address: "45 Academic Ave, Johannesburg, 2092" },
  { id: "b-3", name: "C Les", address: "78 Tech Blvd, Johannesburg, 2092" },
  { id: "b-4", name: "D Les", address: "10 Campus Walk, Johannesburg, 2092" },
  { id: "b-5", name: "Madibeng", address: "1 University Way, Johannesburg, 2092" },
];

export default async function BuildingDirectoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params to get the ID from the URL
  const { id } = await params;
  
  // Find the building matching the URL ID (e.g., "b-1")
  const selectedBuilding = mockBuildings.find((b) => b.id === id);

  if (!selectedBuilding) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Building Not Found</h1>
          <p className="font-bold text-zinc-500">The ID "{id}" does not exist.</p>
          <div className="pt-4">
             <a href="/map-studio" className="text-xs font-black uppercase underline">Return to Directory</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <BuildingMapsComposer building={selectedBuilding} />
    </div>
  );
}