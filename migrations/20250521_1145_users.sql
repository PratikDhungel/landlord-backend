CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    -- Basic Identity
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,

    -- Authentication
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',

    -- Status & Account Metadata
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Audit Trail
    created_by UUID,
    updated_by UUID,
);



CREATE TABLE user_tokens (
    id BIGSERIAL PRIMARY KEY,
    
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Token Storage
    jwt_token TEXT, 
    refresh_token TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);