import { Building, Edge, Node } from '@/lib/models/Spatial';
import { createClient } from '@/lib/supabase/server';

export interface EchomapBundle {
  version: string;
  mapInfo: {
    id: string;
    name: string;
    scale: number | null;
    updatedAt: string;
  };
  nodes: Node[];
  edges: Edge[];
}

export class MapStudioService {
  
  /**
   * 1. Fetch Buildings (Lobby UI)
   * If isPublic is true, it only returns public venues for the mobile app default tab.
   */
  static async getBuildings(isPublic: boolean = false): Promise<Building[]> {
    const supabase = await createClient();
    let query = supabase.from('buildings').select('*');
    
    if (isPublic) {
      query = query.eq('privacy_level', 'PUBLIC');
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch buildings: ${error.message}`);
    return data as Building[];
  }

  /**
   * 2. Save the Mathematical Scale
   * Converts the admin's UI pixel distance into real-world meters.
   */
  static async saveMapScale(mapId: string, scaleMetersPerPixel: number): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('maps')
      .update({ scale_meters_per_pixel: scaleMetersPerPixel })
      .eq('id', mapId);

    if (error) throw new Error('Failed to save map scale.');
    return true;
  }

  /**
   * 3. Save the Graph (Figma-Style Editor)
   * Uses UPSERT for nodes to ensure we don't accidentally delete beacon hardware bindings.
   */
  static async saveGraph(mapId: string, nodes: Partial<Node>[], edges: Partial<Edge>[]): Promise<boolean> {
    const supabase = await createClient();

    // Upsert Nodes (Updates existing ones, inserts new ones based on ID)
    const { error: nodeError } = await supabase
      .from('nodes')
      .upsert(nodes.map(n => ({ ...n, map_id: mapId })));
    
    if (nodeError) throw new Error(`Node save failed: ${nodeError.message}`);

    // Edges don't hold hardware, so it's safer to wipe and replace them on save
    await supabase.from('edges').delete().eq('map_id', mapId);
    
    const { error: edgeError } = await supabase
      .from('edges')
      .insert(edges.map(e => ({ ...e, map_id: mapId })));

    if (edgeError) throw new Error(`Edge save failed: ${edgeError.message}`);

    return true;
  }

  /**
   * 4. Publish the .echomap Bundle
   * Gathers the relational data and serializes it into the high-speed routing format.
   */
  static async publishMap(mapId: string): Promise<EchomapBundle> {
    const supabase = await createClient();

    // Fetch the map, nodes, and edges
    const { data: mapData } = await supabase.from('maps').select('*').eq('id', mapId).single();
    const { data: nodes } = await supabase.from('nodes').select('*').eq('map_id', mapId);
    const { data: edges } = await supabase.from('edges').select('*').eq('map_id', mapId);

    if (!mapData || !nodes || !edges) throw new Error('Failed to compile map data.');

    // Construct the flat JSON bundle
    const echomapBundle: EchomapBundle = {
      version: "1.0",
      mapInfo: {
        id: mapData.id,
        name: mapData.name,
        scale: mapData.scale_meters_per_pixel,
        updatedAt: new Date().toISOString()
      },
      nodes: nodes as Node[],
      edges: edges as Edge[]
    };

    // Update the map status to PUBLISHED
    const { error } = await supabase
      .from('maps')
      .update({ 
        status: 'PUBLISHED',
        // In a full production app, you would save echomapBundle to AWS S3 / Supabase Storage.
        // For this MVP, we can keep it dynamic or store it in a JSONB column if added later.
      })
      .eq('id', mapId);

    if (error) throw new Error('Failed to publish map.');

    return echomapBundle;
  }
}