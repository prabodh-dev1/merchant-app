# bolt.new Build Guide - Merchant App

This document provides prescriptive, implementation-level details for building the Merchant App using bolt.new.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Routing & Pages](#routing--pages)
3. [Component Hierarchy](#component-hierarchy)
4. [Form Specifications](#form-specifications)
5. [Seed Data](#seed-data)
6. [Implementation Order](#implementation-order)

---

## Project Structure

```
merchant-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js 15 App Router
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Main dashboard
│   │   │   ├── events/
│   │   │   │   ├── page.tsx   # Event list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── rewards/
│   │   │   │   ├── page.tsx   # Rewards dashboard
│   │   │   │   └── claim/
│   │   │   │       └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── tenants/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── rewards/
│   │       │   ├── available/
│   │       │   │   └── route.ts
│   │       │   └── claim/
│   │       │       └── route.ts
│   │       ├── events/
│   │       │   └── route.ts
│   │       └── callbacks/
│   │           └── reward-claimed/
│   │               └── route.ts
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── EventList.tsx
│   │   │   └── EventStats.tsx
│   │   ├── rewards/
│   │   │   ├── RewardCard.tsx
│   │   │   ├── RewardsList.tsx
│   │   │   ├── ClaimRewardForm.tsx
│   │   │   └── RewardStats.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── QuickActions.tsx
│   │   └── charts/
│   │       ├── BarChart.tsx
│   │       ├── PieChart.tsx
│   │       └── LineChart.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── redis.ts           # Redis client
│   │   ├── firebase.ts        # Firebase config
│   │   ├── auth.ts            # Auth utilities
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # Helper functions
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   └── useRewards.ts
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.local
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Routing & Pages

### Route Groups & Layout Strategy

#### 1. Authentication Routes `(auth)`

**Layout**: Minimal layout without sidebar/navbar

##### `/login` - Login Page

**File**: `app/(auth)/login/page.tsx`

**Purpose**: User authentication

**Components**:
- `LoginForm` component
- Firebase authentication integration

**UI Elements**:
- Email input field
- Password input field
- "Login" button
- Error message display
- "Forgot password" link (optional)

**Logic**:
- On successful login, redirect based on role:
  - `SUPER_ADMIN` → `/dashboard`
  - `TENANT_MARKETING_ADMIN` → `/events`
  - `MERCHANT_ADMIN` → `/rewards`

---

#### 2. Dashboard Routes `(dashboard)`

**Layout**: Full layout with sidebar navigation and navbar

##### `/` (Dashboard Home) - Role-Based Dashboard

**File**: `app/(dashboard)/page.tsx`

**Purpose**: Main dashboard showing role-specific overview

**Super Admin View**:
- Total tenants count
- Total merchants count
- Total active events
- Total rewards claimed
- Recent activity feed
- System health status

**Tenant Marketing Admin View**:
- Assigned tenants list
- Active events count for assigned tenants
- Total rewards available
- Event performance chart
- Quick action: Create new event

**Merchant Admin View**:
- Outstanding rewards count
- Claimed rewards count
- Today's claims
- Recent rewards list
- Quick action: Claim reward

---

##### `/events` - Event List Page

**File**: `app/(dashboard)/events/page.tsx`

**Access**: Super Admin, Tenant Marketing Admin

**Components**:
- `EventList` component
- Filter dropdown (status, date range)
- Search bar
- Sort options
- "Create Event" button (top right)

**Table Columns**:
- Event Name
- Merchant
- Status (badge with color)
- Total Rewards
- Available / Distributed / Claimed
- Start Date
- End Date
- Actions (View, Edit, Delete icons)

**Filters**:
- Status: All, Draft, Active, Expired, Cancelled
- Date Range picker
- Merchant dropdown (for Super Admin)
- Tenant dropdown (for Super Admin only)

---

##### `/events/new` - Create Event Page

**File**: `app/(dashboard)/events/new/page.tsx`

**Access**: Super Admin, Tenant Marketing Admin

**Components**:
- `EventForm` component
- Form validation with Zod
- Multi-step form or single page form

**Form Fields**: (See Form Specifications section below)

---

##### `/events/[id]` - Event Details Page

**File**: `app/(dashboard)/events/[id]/page.tsx`

**Access**: Super Admin, Tenant Marketing Admin

**Sections**:
1. **Event Header**:
   - Event name
   - Status badge
   - Edit button
   - Cancel button
   
2. **Event Information Card**:
   - Merchant name
   - Reward value range
   - Total rewards
   - Validity period
   - Configuration flags

3. **Statistics Cards**:
   - Available rewards (count + percentage)
   - Distributed rewards (count + percentage)
   - Claimed rewards (count + percentage)
   - Total value claimed

4. **Rewards Table**:
   - Filterable list of rewards
   - Columns: Code Part 1, Status, Value, Distribution Date, Claim Date
   - Export button

---

##### `/events/[id]/edit` - Edit Event Page

**File**: `app/(dashboard)/events/[id]/edit/page.tsx`

**Access**: Super Admin, Tenant Marketing Admin (only for assigned tenants)

**Components**:
- Same as `EventForm` but pre-filled with existing data
- Only allow editing if event status is DRAFT
- Show warning if trying to edit ACTIVE event

---

##### `/rewards` - Rewards Dashboard

**File**: `app/(dashboard)/rewards/page.tsx`

**Access**: Merchant Admin

**Components**:
- Event selector dropdown (top)
- `RewardStats` component
- `RewardsList` component
- Tabs: Outstanding | Claimed | Customer Analytics

**Tab 1: Outstanding Rewards**:
- Count display
- Table with columns:
  - Reward Code (Part 1)
  - Reward Value
  - Status
  - Distribution Date
  - Days Until Expiration
- Filters: Status (Available/Distributed), Value Range, Date Range
- Export button

**Tab 2: Claimed Rewards**:
- Total claimed count
- Total value display
- Table with columns:
  - Full Reward Code (both parts)
  - Reward Value
  - Claim Date
  - Customer ID
- Filters: Date Range, Value Range, Search by code
- Export button

**Tab 3: Customer vs Reward**:
- Total customers count
- Claim rate percentage
- Customer list table
- Charts (if charting library available)

---

##### `/rewards/claim` - Claim Reward Page

**File**: `app/(dashboard)/rewards/claim/page.tsx`

**Access**: Merchant Admin

**Components**:
- `ClaimRewardForm` component
- Result display area

**UI Flow**:
1. **Input Form**:
   - Reward Code input (8 characters)
   - "Verify Code" button
   
2. **Verification Display** (after valid code entered):
   - Show reward value
   - Show "Preview Only" label
   - "Claim Reward" button (primary, large)
   - "Cancel" button

3. **Success Display** (after claim):
   - Success checkmark icon
   - "Claim Accepted" heading
   - Full reward code display (both parts)
   - Reward value (large, prominent)
   - Claim timestamp
   - "Print Receipt" button
   - "Claim Another Reward" button

4. **Error Display**:
   - Error icon
   - Error message
   - "Try Again" button

---

##### `/analytics` - Cross-Event Analytics

**File**: `app/(dashboard)/analytics/page.tsx`

**Access**: Merchant Admin

**Components**:
- Date range selector
- Event multi-select filter
- Stats cards
- Charts

**Metrics**:
1. **Unique Customers** (distinct count)
2. **Total Customer-Reward Associations** (total count)
3. **Customer Distribution Chart** (by reward count)
4. **Event Performance Comparison**
5. **Claim Rate Trends** (line chart)

**Filters**:
- Date range
- Event selection (multi-select)
- Customer search
- Reward count range

---

##### `/tenants` - Tenant Management

**File**: `app/(dashboard)/tenants/page.tsx`

**Access**: Super Admin only

**Components**:
- Tenant list table
- "Create Tenant" button

**Table Columns**:
- Tenant Name
- Code
- Status
- Merchants Count
- Created Date
- Actions

---

##### `/tenants/new` - Create Tenant

**File**: `app/(dashboard)/tenants/new/page.tsx`

**Access**: Super Admin only

**Form Fields**:
- Tenant Name (text, required)
- Tenant Code (text, uppercase, unique, required)
- Status (select: Active/Inactive)

---

##### `/users` - User Management

**File**: `app/(dashboard)/users/page.tsx`

**Access**: Super Admin

**Components**:
- User list table
- "Create User" button
- Role filter

**Table Columns**:
- Name
- Email
- Role (badge)
- Status
- Assignments (tenants/merchants)
- Actions

---

## Component Hierarchy

### Layout Components

#### Sidebar Navigation

**Component**: `components/layout/Sidebar.tsx`

**Props**:
```typescript
interface SidebarProps {
  userRole: UserRole;
}
```

**Navigation Items by Role**:

**Super Admin**:
- Dashboard (Home icon)
- Tenants (Building icon)
- Merchants (Store icon)
- Events (Calendar icon)
- Users (Users icon)
- Analytics (BarChart icon)

**Tenant Marketing Admin**:
- Dashboard (Home icon)
- Events (Calendar icon)
- Analytics (BarChart icon)

**Merchant Admin**:
- Dashboard (Home icon)
- Rewards (Gift icon)
- Claim Reward (Scan icon)
- Analytics (BarChart icon)

---

#### Navbar

**Component**: `components/layout/Navbar.tsx`

**Elements**:
- Logo (left)
- Page title (center-left)
- User dropdown (right):
  - User name + role
  - Profile
  - Settings
  - Logout

---

### Reusable UI Components

#### StatsCard

**Component**: `components/dashboard/StatsCard.tsx`

**Props**:
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}
```

**Usage**:
```tsx
<StatsCard
  title="Total Rewards"
  value={1250}
  icon={<Gift />}
  trend={{ value: 12, isPositive: true }}
  subtitle="vs last month"
/>
```

---

#### EventCard

**Component**: `components/events/EventCard.tsx`

**Props**:
```typescript
interface EventCardProps {
  event: {
    id: string;
    name: string;
    merchant: { name: string };
    status: EventStatus;
    totalRewards: number;
    startDate: Date;
    endDate: Date;
  };
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
}
```

---

#### RewardCard

**Component**: `components/rewards/RewardCard.tsx`

**Props**:
```typescript
interface RewardCardProps {
  reward: {
    codePart1: string;
    fullCode?: string; // Only shown for claimed rewards
    rewardValue: number;
    status: RewardStatus;
    claimedAt?: Date;
  };
  showFullCode?: boolean;
}
```

---

## Form Specifications

### EventForm Component

**Component**: `components/events/EventForm.tsx`

**Form Fields**:

```typescript
interface EventFormData {
  name: string;
  merchantId: string;
  minRewardValue: number;
  maxRewardValue: number;
  totalRewards: number;
  allowDummyRewards: boolean;
  allowMultipleRewardsPerCustomer: boolean;
  startDate: Date;
  endDate: Date;
  rewardValidityStart?: Date;
  rewardValidityEnd?: Date;
}
```

**Field Specifications**:

1. **Event Name**
   - Type: Text input
   - Required: Yes
   - Max length: 100
   - Validation: Non-empty, alphanumeric + spaces
   - Placeholder: "Summer Sale 2024"

2. **Merchant**
   - Type: Select dropdown
   - Required: Yes
   - Options: Fetched from API based on user's access
   - For Super Admin: All merchants
   - For Tenant Marketing Admin: Merchants in assigned tenants

3. **Minimum Reward Value**
   - Type: Number input
   - Required: Yes
   - Min: 0.01
   - Step: 0.01
   - Validation: Must be less than max value
   - Prefix: Currency symbol (₹ or $)

4. **Maximum Reward Value**
   - Type: Number input
   - Required: Yes
   - Min: 0.01
   - Step: 0.01
   - Validation: Must be greater than min value
   - Prefix: Currency symbol

5. **Total Number of Rewards**
   - Type: Number input
   - Required: Yes
   - Min: 1
   - Max: 1,000,000
   - Validation: Positive integer
   - Help text: "Number of reward codes to generate"

6. **Allow Dummy Rewards**
   - Type: Checkbox or Toggle
   - Default: false
   - Help text: "Enable test rewards for this event"

7. **Allow Multiple Rewards Per Customer**
   - Type: Checkbox or Toggle
   - Default: true
   - Help text: "Can a customer receive more than one reward from this event?"

8. **Start Date**
   - Type: Date picker
   - Required: Yes
   - Min: Today
   - Format: YYYY-MM-DD HH:mm

9. **End Date**
   - Type: Date picker
   - Required: Yes
   - Validation: Must be after start date
   - Format: YYYY-MM-DD HH:mm

10. **Reward Validity Start** (Optional)
    - Type: Date picker
    - Default: Same as start date
    - Help text: "When can rewards be claimed? (Defaults to event start)"

11. **Reward Validity End** (Optional)
    - Type: Date picker
    - Default: Same as end date
    - Help text: "Until when can rewards be claimed?"

**Validation Schema (Zod)**:

```typescript
import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  merchantId: z.string().uuid("Invalid merchant"),
  minRewardValue: z.number().min(0.01, "Minimum value must be at least 0.01"),
  maxRewardValue: z.number().min(0.01, "Maximum value must be at least 0.01"),
  totalRewards: z.number().int().min(1).max(1000000),
  allowDummyRewards: z.boolean().default(false),
  allowMultipleRewardsPerCustomer: z.boolean().default(true),
  startDate: z.date(),
  endDate: z.date(),
  rewardValidityStart: z.date().optional(),
  rewardValidityEnd: z.date().optional(),
}).refine((data) => data.maxRewardValue > data.minRewardValue, {
  message: "Maximum reward value must be greater than minimum",
  path: ["maxRewardValue"],
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});
```

**Form Actions**:
- "Save as Draft" button (secondary)
- "Create Event" button (primary)
- "Cancel" button (tertiary)

**On Submit Behavior**:
1. Validate form data
2. Call API: `POST /api/events`
3. Generate reward codes in background (show progress if needed)
4. On success: Redirect to event details page
5. On error: Display error message

---

### ClaimRewardForm Component

**Component**: `components/rewards/ClaimRewardForm.tsx`

**Form Fields**:

```typescript
interface ClaimRewardFormData {
  rewardCode: string;
}
```

**Field Specifications**:

1. **Reward Code**
   - Type: Text input (uppercase)
   - Required: Yes
   - Length: Exactly 8 characters
   - Pattern: `^[A-Z0-9]{8}$`
   - Auto-uppercase transformation
   - Placeholder: "ABC12345"
   - Large font size for readability

**Validation Schema (Zod)**:

```typescript
export const claimRewardSchema = z.object({
  rewardCode: z
    .string()
    .length(8, "Reward code must be exactly 8 characters")
    .regex(/^[A-Z0-9]{8}$/, "Invalid reward code format")
    .transform((val) => val.toUpperCase()),
});
```

**Form States**:

1. **Initial State**:
   - Show input field
   - "Verify Code" button enabled when 8 characters entered

2. **Verifying State**:
   - Loading spinner
   - Button disabled
   - Text: "Verifying..."

3. **Verified State**:
   - Show reward preview
   - Display reward value
   - Show "Claim Reward" button (large, prominent)
   - Show "Cancel" button

4. **Claiming State**:
   - Loading spinner
   - Button disabled
   - Text: "Processing..."

5. **Success State**:
   - Show success message
   - Display full reward code
   - Display reward value
   - Show "Claim Another" button

6. **Error State**:
   - Show error message with icon
   - Error messages by type:
     - Invalid format: "Please enter a valid 8-character reward code"
     - Not found: "Reward code not found. Please verify the code."
     - Already claimed: "This reward has already been claimed"
     - Expired: "This reward has expired"
     - Merchant mismatch: "This reward is not valid for this merchant"

---

### TenantForm Component

**Component**: `components/tenants/TenantForm.tsx`

**Form Fields**:

```typescript
interface TenantFormData {
  name: string;
  code: string;
  status: TenantStatus;
}
```

**Validation Schema**:

```typescript
export const tenantFormSchema = z.object({
  name: z.string().min(1, "Tenant name is required").max(100),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10)
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase alphanumeric")
    .transform((val) => val.toUpperCase()),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
```

---

### MerchantForm Component

**Component**: `components/merchants/MerchantForm.tsx`

**Form Fields**:

```typescript
interface MerchantFormData {
  name: string;
  code: string;
  tenantId: string;
  status: MerchantStatus;
}
```

**Validation Schema**:

```typescript
export const merchantFormSchema = z.object({
  name: z.string().min(1, "Merchant name is required").max(100),
  code: z
    .string()
    .length(3, "Merchant code must be exactly 3 characters")
    .regex(/^[A-Z0-9]{3}$/, "Code must be 3 uppercase alphanumeric characters")
    .transform((val) => val.toUpperCase()),
  tenantId: z.string().uuid("Invalid tenant"),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
```

---

## Seed Data

### Seed Script

**File**: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'BluBoy India',
      code: 'BLUIND',
      status: 'ACTIVE',
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'BluBoy International',
      code: 'BLUINTL',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created tenants');

  // 2. Create Merchants
  const merchant1 = await prisma.merchant.create({
    data: {
      name: 'Cafe Coffee Day',
      code: 'CCD',
      tenantId: tenant1.id,
      status: 'ACTIVE',
    },
  });

  const merchant2 = await prisma.merchant.create({
    data: {
      name: 'Pizza Hut',
      code: 'PHT',
      tenantId: tenant1.id,
      status: 'ACTIVE',
    },
  });

  const merchant3 = await prisma.merchant.create({
    data: {
      name: 'Starbucks',
      code: 'SBX',
      tenantId: tenant2.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created merchants');

  // 3. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      firebaseUid: 'super-admin-uid-001',
      email: 'admin@bluboy.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  const marketingAdmin1 = await prisma.user.create({
    data: {
      firebaseUid: 'marketing-admin-uid-001',
      email: 'marketing@bluboy.com',
      name: 'Marketing Admin',
      role: 'TENANT_MARKETING_ADMIN',
      status: 'ACTIVE',
    },
  });

  const merchantAdmin1 = await prisma.user.create({
    data: {
      firebaseUid: 'merchant-admin-uid-001',
      email: 'admin@ccd.com',
      name: 'CCD Admin',
      role: 'MERCHANT_ADMIN',
      status: 'ACTIVE',
    },
  });

  const merchantAdmin2 = await prisma.user.create({
    data: {
      firebaseUid: 'merchant-admin-uid-002',
      email: 'admin@pizzahut.com',
      name: 'Pizza Hut Admin',
      role: 'MERCHANT_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created users');

  // 4. Create Tenant Assignments
  await prisma.tenantAssignment.create({
    data: {
      userId: marketingAdmin1.id,
      tenantId: tenant1.id,
      assignedBy: superAdmin.id,
    },
  });

  console.log('✅ Created tenant assignments');

  // 5. Create Merchant Assignments
  await prisma.merchantAssignment.create({
    data: {
      userId: merchantAdmin1.id,
      merchantId: merchant1.id,
      assignedBy: superAdmin.id,
    },
  });

  await prisma.merchantAssignment.create({
    data: {
      userId: merchantAdmin2.id,
      merchantId: merchant2.id,
      assignedBy: superAdmin.id,
    },
  });

  console.log('✅ Created merchant assignments');

  // 6. Create Marketing Events
  const event1 = await prisma.marketingEvent.create({
    data: {
      name: 'Summer Rewards 2024',
      tenantId: tenant1.id,
      merchantId: merchant1.id,
      minRewardValue: 10,
      maxRewardValue: 500,
      totalRewards: 1000,
      allowDummyRewards: true,
      allowMultipleRewardsPerCustomer: false,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      status: 'ACTIVE',
      createdBy: marketingAdmin1.id,
    },
  });

  const event2 = await prisma.marketingEvent.create({
    data: {
      name: 'Pizza Festival',
      tenantId: tenant1.id,
      merchantId: merchant2.id,
      minRewardValue: 50,
      maxRewardValue: 1000,
      totalRewards: 500,
      allowDummyRewards: false,
      allowMultipleRewardsPerCustomer: true,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
      status: 'ACTIVE',
      createdBy: marketingAdmin1.id,
    },
  });

  console.log('✅ Created marketing events');

  // 7. Create Rewards
  // Helper function to generate random alphanumeric string
  const generateCode = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create rewards for Event 1
  const rewardsData = [];
  for (let i = 0; i < 50; i++) {
    const codePart1 = `CCD${generateCode(5)}`;
    const codePart2 = generateCode(8);
    const fullCode = `${codePart1}-${codePart2}`;
    
    // Random status distribution
    const statuses: Array<'AVAILABLE' | 'DISTRIBUTED' | 'CLAIMED'> = ['AVAILABLE', 'DISTRIBUTED', 'CLAIMED'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const reward: any = {
      codePart1,
      codePart2,
      fullCode,
      eventId: event1.id,
      merchantId: merchant1.id,
      rewardValue: Math.floor(Math.random() * 490) + 10, // 10 to 500
      status,
      isDummy: i < 5, // First 5 are dummy
    };

    if (status === 'DISTRIBUTED' || status === 'CLAIMED') {
      reward.distributedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      reward.customerId = `CUST${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
    }

    if (status === 'CLAIMED') {
      reward.claimedAt = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000);
    }

    rewardsData.push(reward);
  }

  await prisma.reward.createMany({
    data: rewardsData,
  });

  console.log('✅ Created rewards');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Test Credentials:');
  console.log('Super Admin: admin@bluboy.com');
  console.log('Marketing Admin: marketing@bluboy.com');
  console.log('Merchant Admin (CCD): admin@ccd.com');
  console.log('Merchant Admin (Pizza Hut): admin@pizzahut.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run Seed**:
```bash
npx prisma db seed
```

---

## Implementation Order

### Phase 1: Foundation (Week 1)

1. **Setup Project**
   - Initialize Next.js 15 with TypeScript
   - Install dependencies (Tailwind, Prisma, Firebase, Redis)
   - Configure `next.config.js`, `tailwind.config.js`

2. **Database Setup**
   - Copy `schema.prisma`
   - Run `npx prisma generate`
   - Run `npx prisma db push`
   - Run seed script

3. **Authentication**
   - Setup Firebase configuration
   - Create auth utilities (`lib/auth.ts`)
   - Implement login page
   - Create auth middleware for API routes

4. **Layout Components**
   - Create sidebar navigation
   - Create navbar
   - Create dashboard layout
   - Implement role-based navigation

---

### Phase 2: Core Features (Week 2-3)

5. **Event Management**
   - Create event list page
   - Implement event form (create/edit)
   - Create event details page
   - Build API endpoints: `/api/events`
   - Add event filtering and search

6. **Reward Management**
   - Implement reward code generation logic
   - Create rewards dashboard page
   - Build reward listing with tabs
   - Create API endpoints: `/api/rewards`

7. **Claim Functionality**
   - Create claim reward page
   - Implement claim form with validation
   - Build claim API endpoint
   - Add success/error states

---

### Phase 3: Advanced Features (Week 4)

8. **Analytics & Reporting**
   - Create analytics dashboard
   - Implement charts (using recharts or chart.js)
   - Add export functionality (CSV/Excel)
   - Create cross-event analytics

9. **Admin Features**
   - Tenant management pages
   - User management pages
   - Assignment management

---

### Phase 4: Polish & Optimization (Week 5)

10. **Caching & Performance**
    - Implement Redis caching for frequently accessed data
    - Add API rate limiting
    - Optimize database queries with indexes

11. **Testing & Refinement**
    - Test all user flows
    - Fix bugs and edge cases
    - Responsive design testing
    - Performance optimization

12. **Deployment**
    - Create Docker configuration
    - Setup environment variables
    - Deploy to production

---

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Events
- `GET /api/events` - List events (with filters)
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Rewards
- `GET /api/rewards` - List rewards (with filters)
- `GET /api/rewards/available?eventId={id}` - Get available reward
- `POST /api/rewards/claim` - Claim reward
- `GET /api/rewards/[id]` - Get reward details

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/events/{id}` - Event analytics
- `GET /api/analytics/cross-event` - Cross-event analytics

### Tenants (Super Admin only)
- `GET /api/tenants` - List tenants
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants/[id]` - Update tenant

### Merchants
- `GET /api/merchants` - List merchants
- `POST /api/merchants` - Create merchant
- `PUT /api/merchants/[id]` - Update merchant

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `POST /api/users/[id]/assign` - Assign to tenant/merchant

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.3.0",
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0",
    "firebase": "^10.7.0",
    "firebase-admin": "^12.0.0",
    "redis": "^4.6.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.312.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0"
  }
}
```

---

## Final Checklist for bolt.new

Before starting in bolt.new, ensure you have:

- [ ] `schema.prisma` file
- [ ] `ENV_TEMPLATE.md` with all environment variables
- [ ] This build guide document
- [ ] UI specifications document (see next file)
- [ ] Clear understanding of user roles and permissions
- [ ] Sample seed data script
- [ ] API endpoint specifications

---

**Ready to build!** 🚀

Use this guide as a reference when prompting bolt.new. Start with Phase 1 and progressively build each feature.

