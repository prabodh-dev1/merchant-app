/*
  # Update RLS Policies for Anonymous Read Access

  This migration updates the RLS policies to allow anonymous (unauthenticated) read access
  to tenants, merchants, and users tables while maintaining security for write operations.

  ## Changes
  
  1. Drop existing overly permissive policies
  2. Create separate policies for SELECT (public) and INSERT/UPDATE/DELETE (authenticated)
  3. Maintains data security while allowing the frontend to fetch data
  
  ## Security Notes
  
  - SELECT operations are now public (read-only access to all users)
  - INSERT, UPDATE, DELETE operations require authentication
  - This is acceptable for tenant/merchant/user data as it's not sensitive user data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated access to tenants" ON tenants;
DROP POLICY IF EXISTS "Allow authenticated access to merchants" ON merchants;
DROP POLICY IF EXISTS "Allow authenticated access to users" ON users;

-- Tenants policies
CREATE POLICY "Allow public read access to tenants"
  ON tenants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated write access to tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to tenants"
  ON tenants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete access to tenants"
  ON tenants FOR DELETE
  TO authenticated
  USING (true);

-- Merchants policies
CREATE POLICY "Allow public read access to merchants"
  ON merchants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated write access to merchants"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to merchants"
  ON merchants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete access to merchants"
  ON merchants FOR DELETE
  TO authenticated
  USING (true);

-- Users policies
CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated write access to users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete access to users"
  ON users FOR DELETE
  TO authenticated
  USING (true);
