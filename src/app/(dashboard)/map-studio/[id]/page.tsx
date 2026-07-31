import { BuildingMapsComposer } from "@/components/map-studio/BuildingMapsComposer";

export default async function BuildingDirectoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="h-full">
      <BuildingMapsComposer buildingId={id} />
    </div>
  );
}
