-- 6. Staff Invites (The Invite Engine)
CREATE TABLE public.staff_invites (
    invite_code TEXT PRIMARY KEY DEFAULT upper(substring(gen_random_uuid()::text, 1, 8)),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'TECHNICIAN')),
    generated_by_profile_id UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'USED', 'EXPIRED')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '7 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);