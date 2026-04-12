import { Beacon } from "@/lib/models/Hardware";
import { createClient } from "@/lib/supabase/server";

// A strict type for the complex relational join
export interface PopulatedTask {
  id: string;
  status: string;
  nodes: { id: string; label: string; is_hazard: boolean } | null;
  maps: {
    name: string;
    buildings: { name: string; campus_name: string } | null;
  } | null;
}

export class FleetService {
  /**
   * 1. Dashboard Overview (System Health)
   * Aggregates data for the Web Admin top row cards.
   */
  static async getOverview(
    organizationId: string,
  ): Promise<{ activeBeacons: number | null; pendingTasks: number | null }> {
    const supabase = await createClient();

    const { count: activeBeacons } = await supabase
      .from("beacons")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "BOUND");

    const { count: pendingTasks } = await supabase
      .from("deployment_tasks")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .neq("status", "VERIFIED");

    return { activeBeacons, pendingTasks };
  }

  /**
   * 2. Bulk Create Deployment Tasks (Web Admin)
   * Admins select nodes and assign them to a technician.
   */
  static async createDeploymentTasks(
    orgId: string,
    mapId: string,
    nodeIds: string[],
    staffId: string,
  ): Promise<boolean> {
    const supabase = await createClient();

    const tasks = nodeIds.map((nodeId) => ({
      organization_id: orgId,
      map_id: mapId,
      node_id: nodeId,
      assigned_to_profile_id: staffId,
      status: "TO_DO",
    }));

    const { error } = await supabase.from("deployment_tasks").insert(tasks);
    if (error) throw new Error(`Failed to create tasks: ${error.message}`);
    return true;
  }

  /**
   * 3. Fetch Staff Tasks (Expo Mobile App)
   * Pulls the Kanban-style tickets for the logged-in technician.
   */
  static async getStaffTasks(staffId: string): Promise<PopulatedTask[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deployment_tasks")
      .select(
        `
        id, status, 
        nodes ( id, label, is_hazard ),
        maps ( name, buildings ( name, campus_name ) )
      `,
      )
      .eq("assigned_to_profile_id", staffId)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch tasks.");
    return data as unknown as PopulatedTask[];
  }

  /**
   * 4. Step 1 of Checklist: Bind Hardware (Expo Mobile App)
   * Staff scans a beacon. We upsert the hardware and move the task to IN_PROGRESS.
   */
  static async bindBeaconToNode(
    taskId: string,
    orgId: string,
    nodeId: string,
    hardwareUuid: string,
    major: number,
    minor: number,
  ): Promise<Beacon> {
    const supabase = await createClient();

    // Upsert the physical beacon (creates it if new, updates node_id if existing)
    const { data: beacon, error: beaconError } = await supabase
      .from("beacons")
      .upsert(
        {
          organization_id: orgId,
          hardware_uuid: hardwareUuid,
          major,
          minor,
          node_id: nodeId,
          status: "BOUND",
        },
        { onConflict: "organization_id, hardware_uuid, major, minor" },
      )
      .select()
      .single();

    if (beaconError)
      throw new Error(`Hardware bind failed: ${beaconError.message}`);

    // Update the task status to indicate the scan is complete, awaiting calibration
    await supabase
      .from("deployment_tasks")
      .update({ status: "IN_PROGRESS", updated_at: new Date().toISOString() })
      .eq("id", taskId);

    return beacon as Beacon;
  }

  /**
   * 5. Step 2 of Checklist: 1-Meter Calibration (Expo Mobile App)
   * Saves the smoothed Kalman RSSI baseline and marks the task VERIFIED.
   */
  static async calibrateBeacon(
    taskId: string,
    beaconId: string,
    baselineRssi: number,
  ): Promise<boolean> {
    const supabase = await createClient();

    // Save the baseline to the physical beacon
    const { error: beaconError } = await supabase
      .from("beacons")
      .update({ calibrated_rssi_baseline: baselineRssi })
      .eq("id", beaconId);

    if (beaconError) throw new Error("Failed to save calibration data.");

    // Finalize the task
    await supabase
      .from("deployment_tasks")
      .update({
        status: "VERIFIED",
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    return true;
  }

  /**
   * 6. Mark Hazard (Web Admin & PsyCaD Panic Button)
   * Instantly disables a node, forcing the Dijkstra engine to route around it.
   */
  static async toggleNodeHazard(
    nodeId: string,
    isHazard: boolean,
  ): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("nodes")
      .update({ is_hazard: isHazard })
      .eq("id", nodeId);

    if (error) throw new Error("Failed to toggle hazard status.");
    return true;
  }

  /**
   * 7. Method for retrieval of the hardware overview
   */
  static async getVerifiedHardware(orgId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("beacons")
      .select("id, hardware_uuid, calibrated_rssi_baseline, nodes ( label )")
      .eq("organization_id", orgId)
      .eq("status", "BOUND");

    if (error) throw new Error(error.message);
    return data;
  }
}
