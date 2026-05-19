import { GraphEditorComposer } from "@/components/map-studio/editor/GraphEditorComposer";

export default async function MapEditorPage({
  params,
}: {
  params: Promise<{ id: string; mapId: string }>;
}) {
  // Extract the mapId from the URL parameters
  const { mapId } = await params;

  return (
    <div className="h-full -m-6 md:-m-8"> 
      <GraphEditorComposer floorPlanId={mapId} />
    </div>
  );
}