-- 1. Buildings (Flattened to include Campus info)
CREATE TABLE public.buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    campus_name TEXT NOT NULL,
    privacy_level TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (privacy_level IN ('PUBLIC', 'PRIVATE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Maps (Flattened to act as Floors/Sections)
CREATE TABLE public.maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    scale_meters_per_pixel NUMERIC(12,6),
    svg_storage_path TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Nodes (The Virtual Graph Points)
CREATE TABLE public.nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES public.maps(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    x NUMERIC(12,4) NOT NULL,
    y NUMERIC(12,4) NOT NULL,
    tts_verbal_guidance TEXT,
    is_hazard BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Edges (The Walkable Paths for Dijkstra)
CREATE TABLE public.edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES public.maps(id) ON DELETE CASCADE,
    from_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    weight_m NUMERIC(12,4) NOT NULL CHECK (weight_m > 0),
    is_hazard BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (from_node_id != to_node_id)
);

-- 5. Beacons (The Physical Hardware)
CREATE TABLE public.beacons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    hardware_uuid TEXT NOT NULL,
    major INT NOT NULL,
    minor INT NOT NULL,
    node_id UUID UNIQUE REFERENCES public.nodes(id) ON DELETE SET NULL,
    calibrated_rssi_baseline NUMERIC(6,2),
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BOUND', 'MAINTENANCE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, hardware_uuid, major, minor)
);

-- 6. Deployment Tasks (Fleet Management)
CREATE TABLE public.deployment_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    map_id UUID NOT NULL REFERENCES public.maps(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    assigned_to_profile_id UUID NOT NULL REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'TO_DO' CHECK (status IN ('TO_DO', 'IN_PROGRESS', 'VERIFIED')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);