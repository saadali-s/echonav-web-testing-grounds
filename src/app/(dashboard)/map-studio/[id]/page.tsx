import { BuildingMapsComposer } from "@/components/map-studio/BuildingMapsComposer";

export default async function BuildingDirectoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="h-full">
      {/* Pass the raw ID down to the client component */}
      <BuildingMapsComposer buildingId={id} />
    </div>
  );
}