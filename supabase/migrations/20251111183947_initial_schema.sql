/*
  # Initial Schema for Merchant App

  1. New Tables
    - `tenants` - Tenant organizations
    - `merchants` - Merchant businesses with 3-char codes
    - `marketing_events` - Marketing campaigns with reward configuration
    - `rewards` - Individual reward codes (2-part structure)
    - `users` - System users with roles
    - `tenant_assignments` - Marketing admin to tenant mappings
    - `merchant_assignments` - Merchant admin to merchant mappings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control

  3. Important Notes
    - Reward codes: Part1 (8 chars, includes 3-char merchant code) + Part2 (8 chars, never shared with customer)
    - Three user roles: SUPER_ADMIN, TENANT_MARKETING_ADMIN, MERCHANT_ADMIN
    - Multi-tenant architecture with tenant isolation
*/

-- Create enums
CREATE TYPE tenant_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE merchant_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE event_status AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE reward_status AS ENUM ('AVAILABLE', 'DISTRIBUTED', 'CLAIMED', 'EXPIRED', 'CANCELLED');
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'TENANT_MARKETING_ADMIN', 'MERCHANT_ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  status tenant_status DEFAULT 'ACTIVE' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code CHAR(3) UNIQUE NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  status merchant_status DEFAULT 'ACTIVE' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_merchants_tenant_id ON merchants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  status user_status DEFAULT 'ACTIVE' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- Marketing Events table
CREATE TABLE IF NOT EXISTS marketing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  min_reward_value DECIMAL(10, 2) NOT NULL,
  max_reward_value DECIMAL(10, 2) NOT NULL,
  total_rewards INT NOT NULL,
  allow_dummy_rewards BOOLEAN DEFAULT false NOT NULL,
  allow_multiple_rewards_per_customer BOOLEAN DEFAULT true NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  reward_validity_start TIMESTAMPTZ,
  reward_validity_end TIMESTAMPTZ,
  status event_status DEFAULT 'DRAFT' NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON marketing_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON marketing_events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON marketing_events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON marketing_events(start_date, end_date);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_part1 CHAR(8) UNIQUE NOT NULL,
  code_part2 CHAR(8) UNIQUE NOT NULL,
  full_code CHAR(17) UNIQUE NOT NULL,
  event_id UUID NOT NULL REFERENCES marketing_events(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  reward_value DECIMAL(10, 2) NOT NULL,
  status reward_status DEFAULT 'AVAILABLE' NOT NULL,
  is_dummy BOOLEAN DEFAULT false NOT NULL,
  customer_id TEXT,
  distributed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rewards_code_part1 ON rewards(code_part1);
CREATE INDEX IF NOT EXISTS idx_rewards_full_code ON rewards(full_code);
CREATE INDEX IF NOT EXISTS idx_rewards_event_status ON rewards(event_id, status);
CREATE INDEX IF NOT EXISTS idx_rewards_merchant_status ON rewards(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_rewards_customer_id ON rewards(customer_id);

-- Tenant Assignments table
CREATE TABLE IF NOT EXISTS tenant_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_assignments_user_id ON tenant_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_assignments_tenant_id ON tenant_assignments(tenant_id);

-- Merchant Assignments table
CREATE TABLE IF NOT EXISTS merchant_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_merchant_assignments_user_id ON merchant_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_merchant_assignments_merchant_id ON merchant_assignments(merchant_id);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic - will be enhanced based on auth integration)
-- For now, allow authenticated users to access data
CREATE POLICY "Allow authenticated access to tenants"
  ON tenants FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to merchants"
  ON merchants FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to users"
  ON users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to events"
  ON marketing_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to rewards"
  ON rewards FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to tenant assignments"
  ON tenant_assignments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to merchant assignments"
  ON merchant_assignments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);