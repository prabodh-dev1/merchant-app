export type UserRole = 'SUPER_ADMIN' | 'TENANT_MARKETING_ADMIN' | 'MERCHANT_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type TenantStatus = 'ACTIVE' | 'INACTIVE';
export type MerchantStatus = 'ACTIVE' | 'INACTIVE';
export type EventStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type RewardStatus = 'AVAILABLE' | 'DISTRIBUTED' | 'CLAIMED' | 'EXPIRED' | 'CANCELLED';

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  code: string;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  name: string;
  code: string;
  tenant_id: string;
  status: MerchantStatus;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
}

export interface MarketingEvent {
  id: string;
  name: string;
  tenant_id: string;
  merchant_id: string;
  min_reward_value: number;
  max_reward_value: number;
  total_rewards: number;
  allow_dummy_rewards: boolean;
  allow_multiple_rewards_per_customer: boolean;
  start_date: string;
  end_date: string;
  reward_validity_start?: string;
  reward_validity_end?: string;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
  merchant?: Merchant;
  creator?: User;
}

export interface Reward {
  id: string;
  code_part1: string;
  code_part2: string;
  full_code: string;
  event_id: string;
  merchant_id: string;
  reward_value: number;
  status: RewardStatus;
  is_dummy: boolean;
  customer_id?: string;
  distributed_at?: string;
  claimed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  event?: MarketingEvent;
  merchant?: Merchant;
}

export interface TenantAssignment {
  id: string;
  user_id: string;
  tenant_id: string;
  assigned_by: string;
  assigned_at: string;
}

export interface MerchantAssignment {
  id: string;
  user_id: string;
  merchant_id: string;
  assigned_by: string;
  assigned_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
