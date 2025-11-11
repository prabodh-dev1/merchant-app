# UI/UX Specifications - Merchant App

This document provides detailed UI/UX specifications including wireframe descriptions, design system, component layouts, and user experience guidelines for building the Merchant App.

## Table of Contents

1. [Design System](#design-system)
2. [Layout Structure](#layout-structure)
3. [Page Wireframes](#page-wireframes)
4. [Component Specifications](#component-specifications)
5. [Navigation Flow](#navigation-flow)
6. [Responsive Design](#responsive-design)
7. [User Experience Guidelines](#user-experience-guidelines)

---

## Design System

### Color Palette

#### Primary Colors
```
Primary Blue: #2563eb (Tailwind blue-600)
Primary Hover: #1d4ed8 (Tailwind blue-700)
Primary Light: #dbeafe (Tailwind blue-100)
```

#### Secondary Colors
```
Secondary Gray: #64748b (Tailwind slate-500)
Secondary Dark: #334155 (Tailwind slate-700)
Secondary Light: #f1f5f9 (Tailwind slate-100)
```

#### Status Colors
```
Success Green: #10b981 (Tailwind emerald-500)
Warning Orange: #f59e0b (Tailwind amber-500)
Error Red: #ef4444 (Tailwind red-500)
Info Blue: #3b82f6 (Tailwind blue-500)
```

#### Status-Specific Colors
```
ACTIVE/AVAILABLE: #10b981 (green)
DRAFT: #64748b (gray)
CLAIMED: #3b82f6 (blue)
EXPIRED/CANCELLED: #ef4444 (red)
DISTRIBUTED: #f59e0b (amber)
```

#### Background Colors
```
Page Background: #f8fafc (Tailwind slate-50)
Card Background: #ffffff (white)
Sidebar Background: #1e293b (Tailwind slate-800)
Hover Background: #f1f5f9 (Tailwind slate-100)
```

#### Text Colors
```
Primary Text: #0f172a (Tailwind slate-900)
Secondary Text: #64748b (Tailwind slate-500)
Muted Text: #94a3b8 (Tailwind slate-400)
White Text: #ffffff (white)
```

---

### Typography

#### Font Family
```
Primary: Inter, system-ui, -apple-system, sans-serif
Monospace: 'Courier New', Courier, monospace (for reward codes)
```

#### Font Sizes
```
Heading 1: 2.25rem (36px) - font-bold
Heading 2: 1.875rem (30px) - font-bold
Heading 3: 1.5rem (24px) - font-semibold
Heading 4: 1.25rem (20px) - font-semibold
Body Large: 1.125rem (18px) - font-normal
Body: 1rem (16px) - font-normal
Body Small: 0.875rem (14px) - font-normal
Caption: 0.75rem (12px) - font-normal
```

---

### Spacing Scale

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

---

### Border Radius

```
Small: 0.375rem (6px) - Buttons, inputs
Medium: 0.5rem (8px) - Cards, modals
Large: 0.75rem (12px) - Large cards
Full: 9999px - Badges, pills
```

---

### Shadows

```
Small: 0 1px 2px 0 rgb(0 0 0 / 0.05)
Medium: 0 4px 6px -1px rgb(0 0 0 / 0.1)
Large: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

---

### Icons

**Library**: Lucide React

**Common Icons**:
- Home: `<Home />`
- Calendar: `<Calendar />`
- Gift: `<Gift />`
- Users: `<Users />`
- BarChart: `<BarChart3 />`
- Plus: `<Plus />`
- Edit: `<Edit2 />`
- Trash: `<Trash2 />`
- Eye: `<Eye />`
- Check: `<Check />`
- X: `<X />`
- Search: `<Search />`
- Filter: `<Filter />`
- Download: `<Download />`
- LogOut: `<LogOut />`
- Settings: `<Settings />`

---

## Layout Structure

### Overall Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         Navbar                              │
│  Logo    Page Title              User (Name) ▼              │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  S  │                                                         │
│  I  │               Main Content Area                        │
│  D  │                                                         │
│  E  │                                                         │
│  B  │                                                         │
│  A  │                                                         │
│  R  │                                                         │
│     │                                                         │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

### Grid System

- **Container Max Width**: 1280px (xl breakpoint)
- **Content Padding**: 24px (lg)
- **Sidebar Width**: 256px
- **Main Content**: calc(100% - 256px)

---

## Page Wireframes

### 1. Login Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                     [Logo]                                    │
│                                                               │
│                  Merchant App                                 │
│                                                               │
│         ┌────────────────────────────────────┐              │
│         │                                    │              │
│         │  Email                             │              │
│         │  [                          ]      │              │
│         │                                    │              │
│         │  Password                          │              │
│         │  [                          ]      │              │
│         │                                    │              │
│         │        [   Login Button   ]       │              │
│         │                                    │              │
│         │      Forgot password?              │              │
│         │                                    │              │
│         └────────────────────────────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Elements**:
- Centered card (max-width: 400px)
- Logo at top (80px height)
- App name (H2)
- Email input with label
- Password input with label and show/hide toggle
- Primary button (full width)
- Forgot password link (small, muted)
- Background: Gradient or subtle pattern

---

### 2. Dashboard (Super Admin)

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Dashboard          User (Super Admin) ▼      │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  □  │  Dashboard                                             │
│  □  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  ⌂  │  │  Total   │ │  Total   │ │  Active  │ │  Total   ││
│     │  │ Tenants  │ │Merchants │ │  Events  │ │ Rewards  ││
│  ⊞  │  │   15     │ │    48    │ │    23    │ │  12.5K   ││
│     │  │  📊 +2   │ │  📊 +5   │ │  📊 +3   │ │  📊 +120 ││
│  📅 │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│     │                                                         │
│  👥 │  Recent Activity                                       │
│     │  ┌─────────────────────────────────────────────────┐  │
│  📊 │  │ • New event created: "Summer Sale 2024"        │  │
│     │  │ • Merchant added: "Starbucks Cafe"              │  │
│     │  │ • 125 rewards claimed today                     │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
│     │  Quick Actions                                         │
│     │  [+ Create Event] [+ Add Merchant] [+ Add User]       │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**Layout**:
- **Stats Cards Row**: 4 cards across (responsive: 2x2 on tablet, 1 column on mobile)
- **Recent Activity**: Card with list of recent actions
- **Quick Actions**: Button group with primary actions

---

### 3. Events List Page

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Events             User (Marketing Admin) ▼  │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Marketing Events                    [+ Create Event] │
│     │                                                         │
│  📅 │  [🔍 Search...]  [Filter ▼]  [Sort ▼]                │
│     │                                                         │
│  📊 │  ┌─────────────────────────────────────────────────┐  │
│     │  │ Event Name     │Merchant│Status │Rewards│Dates │  │
│     │  ├─────────────────────────────────────────────────┤  │
│     │  │ Summer Sale    │  CCD   │🟢Active│500/1K │Jun-Aug│
│     │  │ 2024           │        │       │       │      │  │
│     │  │                │        │       │ [👁️][✏️][🗑️] │  │
│     │  ├─────────────────────────────────────────────────┤  │
│     │  │ Pizza Festival │ P.Hut  │🟡Draft│0/500  │Jul   │  │
│     │  │                │        │       │ [👁️][✏️][🗑️] │  │
│     │  ├─────────────────────────────────────────────────┤  │
│     │  │ Winter Promo   │  CCD   │🔴Exp. │450/500│Dec-Feb│
│     │  │                │        │       │ [👁️]         │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
│     │  [Previous] Page 1 of 3 [Next]                        │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**Features**:
- Search bar (left)
- Filter dropdown (Status, Date Range, Merchant)
- Sort dropdown (Name, Date, Status)
- Create button (top right, primary)
- Table with sortable columns
- Action icons (View, Edit, Delete)
- Pagination
- Status badges with colors

---

### 4. Create Event Form

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Create Event       User (Marketing Admin) ▼  │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Create Marketing Event                                │
│     │                                                         │
│  📅 │  ┌─────────────────────────────────────────────────┐  │
│     │  │                                                 │  │
│     │  │  Event Information                             │  │
│     │  │  ─────────────────                             │  │
│     │  │                                                 │  │
│     │  │  Event Name *                                   │  │
│     │  │  [                                      ]       │  │
│     │  │                                                 │  │
│     │  │  Merchant *                                     │  │
│     │  │  [Select merchant...              ▼]          │  │
│     │  │                                                 │  │
│     │  │  Reward Configuration                          │  │
│     │  │  ─────────────────                             │  │
│     │  │                                                 │  │
│     │  │  Min Value *         Max Value *               │  │
│     │  │  [₹ 10.00  ]        [₹ 500.00 ]              │  │
│     │  │                                                 │  │
│     │  │  Total Rewards *                               │  │
│     │  │  [1000         ]                               │  │
│     │  │                                                 │  │
│     │  │  ☑ Allow dummy rewards                         │  │
│     │  │  ☑ Allow multiple rewards per customer         │  │
│     │  │                                                 │  │
│     │  │  Validity Period                               │  │
│     │  │  ─────────────────                             │  │
│     │  │                                                 │  │
│     │  │  Start Date *       End Date *                 │  │
│     │  │  [📅 Select...▼]    [📅 Select...▼]           │  │
│     │  │                                                 │  │
│     │  │                                                 │  │
│     │  │  [Cancel]  [Save as Draft]  [Create Event]    │  │
│     │  │                                                 │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**Form Layout**:
- Single column form
- Sections with headings
- Labels above inputs
- Required fields marked with *
- Inline validation messages
- Helper text below fields
- Three buttons at bottom:
  - Cancel (secondary, left)
  - Save as Draft (secondary)
  - Create Event (primary, right)

---

### 5. Event Details Page

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Event Details      User (Marketing Admin) ▼  │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  ← Back to Events                                      │
│     │                                                         │
│  📅 │  Summer Sale 2024            🟢 Active   [✏️ Edit]    │
│     │  Cafe Coffee Day                                       │
│     │                                                         │
│     │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│     │  │Available │Distributed│ Claimed  │  Total   ││
│     │  │   500    │   300     │   200    │  Value   ││
│     │  │  (50%)   │  (30%)    │  (20%)   │ ₹125,000 ││
│     │  └──────────┘ └──────────┘ ┌──────────┘ └──────────┘│
│     │                                                         │
│     │  Event Information                                     │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │ Reward Range:     ₹10 - ₹500                    │  │
│     │  │ Period:           Jun 1, 2024 - Aug 31, 2024    │  │
│     │  │ Dummy Rewards:    Allowed                        │  │
│     │  │ Multiple Rewards: Not Allowed per Customer       │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
│     │  Rewards                          [Export CSV ↓]      │
│     │  [All] [Available] [Distributed] [Claimed]           │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │ Code    │ Status     │ Value  │ Claim Date      │  │
│     │  ├─────────────────────────────────────────────────┤  │
│     │  │CCD12345 │🟢Available │ ₹50    │ -               │  │
│     │  │CCD67890 │🔵Claimed   │ ₹100   │ Jul 15, 2024    │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**Layout**:
- Back button
- Event header with name, merchant, status badge, edit button
- 4 stats cards showing reward distribution
- Event information card
- Rewards section with tabs and table
- Export button

---

### 6. Rewards Dashboard (Merchant Admin)

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Rewards            User (Merchant Admin) ▼   │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Rewards Dashboard                                     │
│     │                                                         │
│  🎁 │  Event: [Summer Sale 2024                     ▼]      │
│     │                                                         │
│  📱 │  ┌────────────────┐ ┌────────────────┐               │
│     │  │  Outstanding   │ │    Claimed     │               │
│  📊 │  │      800       │ │      200       │               │
│     │  │   ₹240,000     │ │   ₹60,000      │               │
│     │  └────────────────┘ └────────────────┘               │
│     │                                                         │
│     │  [Outstanding] [Claimed] [Customer Analytics]         │
│     │                                                         │
│     │  Outstanding Rewards              [Export CSV ↓]      │
│     │  [Status ▼] [Value Range ▼] [Date Range ▼]           │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │ Code    │Status      │Value │Dist.Date│Exp.in  │  │
│     │  ├─────────────────────────────────────────────────┤  │
│     │  │CCD12345 │🟢Available │₹50   │  -      │ 45 days│  │
│     │  │CCD67890 │🟡Distributed│₹100 │Jul 15   │ 32 days│  │
│     │  │CCD11111 │🟢Available │₹75   │  -      │ 45 days│  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
│     │  [Previous] Page 1 of 20 [Next]                       │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**Features**:
- Event selector dropdown (top)
- Summary stats cards
- Tab navigation (Outstanding, Claimed, Customer Analytics)
- Filters for each tab
- Table with rewards
- Export functionality
- Pagination

---

### 7. Claim Reward Page

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Claim Reward       User (Merchant Admin) ▼   │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Claim Reward                                          │
│     │                                                         │
│  🎁 │        ┌────────────────────────────────────┐          │
│     │        │                                    │          │
│  📱 │        │   Enter Reward Code                │          │
│     │        │                                    │          │
│     │        │   ┌─────────────────────────┐     │          │
│     │        │   │  CCD12345               │     │          │
│     │        │   └─────────────────────────┘     │          │
│     │        │                                    │          │
│     │        │   [  Verify Code  ]                │          │
│     │        │                                    │          │
│     │        └────────────────────────────────────┘          │
│     │                                                         │
│     │                                                         │
│     │                                                         │
│     │                                                         │
│     │                                                         │
│     │                                                         │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘

After verification:

┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Claim Reward       User (Merchant Admin) ▼   │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Claim Reward                                          │
│     │                                                         │
│  🎁 │        ┌────────────────────────────────────┐          │
│     │        │                                    │          │
│  📱 │        │   ✓ Valid Reward Code              │          │
│     │        │                                    │          │
│     │        │   Code: CCD12345                   │          │
│     │        │                                    │          │
│     │        │   Reward Value                     │          │
│     │        │   ₹ 500                           │          │
│     │        │   (PREVIEW ONLY)                   │          │
│     │        │                                    │          │
│     │        │   [        Claim Reward       ]    │          │
│     │        │   [         Cancel            ]    │          │
│     │        │                                    │          │
│     │        └────────────────────────────────────┘          │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘

After successful claim:

┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Claim Reward       User (Merchant Admin) ▼   │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Claim Reward                                          │
│     │                                                         │
│  🎁 │        ┌────────────────────────────────────┐          │
│     │        │                                    │          │
│  📱 │        │         ✓ Claim Accepted!          │          │
│     │        │                                    │          │
│     │        │   Full Reward Code:                │          │
│     │        │   CCD12345-9X7K2M1P                │          │
│     │        │                                    │          │
│     │        │   Reward Value:                    │          │
│     │        │   ₹ 500                           │          │
│     │        │                                    │          │
│     │        │   Claimed: Jul 20, 2024 10:30 AM  │          │
│     │        │                                    │          │
│     │        │   [   Print Receipt   ]            │          │
│     │        │   [ Claim Another Reward ]         │          │
│     │        │                                    │          │
│     │        └────────────────────────────────────┘          │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**States**:
1. **Initial**: Input field + Verify button
2. **Verified**: Preview card with Claim/Cancel buttons
3. **Success**: Confirmation card with details
4. **Error**: Error message with Try Again button

**Key Features**:
- Large input field (monospace font)
- Auto-uppercase transformation
- Clear state transitions
- Prominent reward value display
- Success confirmation with all details

---

### 8. Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar: Logo | Analytics          User (Merchant Admin) ▼   │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                         │
│  ⌂  │  Cross-Event Analytics                                 │
│     │                                                         │
│  🎁 │  [Date Range: Last 30 days ▼] [Events: All ▼]        │
│     │                                                         │
│  📱 │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│     │  │  Unique  │ │  Total   │ │ Avg per  │              │
│  📊 │  │Customers │ │Customers │ │ Customer │              │
│     │  │   1,234  │ │  2,456   │ │   1.99   │              │
│     │  └──────────┘ └──────────┘ └──────────┘              │
│     │                                                         │
│     │  Customer Distribution                                 │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │                                                 │  │
│     │  │  [Bar Chart: Customers by Reward Count]        │  │
│     │  │                                                 │  │
│     │  │  █████████  1 reward    (800)                   │  │
│     │  │  ████████   2 rewards   (300)                   │  │
│     │  │  ████       3 rewards   (100)                   │  │
│     │  │  ██         4+ rewards  (34)                    │  │
│     │  │                                                 │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
│     │  Claim Trends                                          │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │  [Line Chart: Daily Claims Over Time]          │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                         │
└─────┴───────────────────────────────────────────────────────┘
```

**Features**:
- Date range selector
- Event multi-select filter
- Summary stats cards
- Bar chart (customer distribution)
- Line chart (claim trends)
- Responsive charts

---

## Component Specifications

### Button Component

**Variants**:

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
```

**Primary Button**:
```
Background: #2563eb (blue-600)
Hover: #1d4ed8 (blue-700)
Text: white
Padding: 0.5rem 1rem (sm), 0.75rem 1.5rem (md), 1rem 2rem (lg)
Border Radius: 0.375rem
```

**Secondary Button**:
```
Background: transparent
Border: 1px solid #e2e8f0 (slate-200)
Text: #334155 (slate-700)
Hover: #f1f5f9 (slate-100)
```

**Danger Button**:
```
Background: #ef4444 (red-500)
Hover: #dc2626 (red-600)
Text: white
```

**Ghost Button**:
```
Background: transparent
Text: #64748b (slate-500)
Hover: #f1f5f9 (slate-100)
```

---

### Input Component

**Standard Input**:
```
Height: 2.5rem (40px)
Padding: 0.5rem 0.75rem
Border: 1px solid #e2e8f0 (slate-200)
Border Radius: 0.375rem
Font Size: 1rem
Focus: Blue border (#2563eb), shadow
```

**Input with Icon**:
```
Icon Position: Left padding-left: 2.5rem
Icon Color: #94a3b8 (slate-400)
Icon Size: 1.25rem
```

**Error State**:
```
Border: 1px solid #ef4444 (red-500)
Error Text: #ef4444, font-size: 0.875rem
Error Icon: Red X icon
```

---

### Card Component

**Standard Card**:
```
Background: white
Border: 1px solid #e2e8f0 (slate-200)
Border Radius: 0.5rem
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Padding: 1.5rem
```

**Card Header**:
```
Border Bottom: 1px solid #e2e8f0
Padding Bottom: 1rem
Margin Bottom: 1rem
```

**Card Actions**:
```
Border Top: 1px solid #e2e8f0
Padding Top: 1rem
Margin Top: 1rem
Align: Right
```

---

### Badge Component

**Status Badges**:

```typescript
const statusStyles = {
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  CLAIMED: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800',
  AVAILABLE: 'bg-green-100 text-green-800',
  DISTRIBUTED: 'bg-amber-100 text-amber-800',
};
```

**Badge Styles**:
```
Padding: 0.25rem 0.75rem
Border Radius: 9999px (full)
Font Size: 0.75rem
Font Weight: 500
```

---

### Table Component

**Table Structure**:
```
Header Background: #f8fafc (slate-50)
Header Text: #0f172a (slate-900), font-weight: 600
Border: 1px solid #e2e8f0 (slate-200)
Row Hover: #f8fafc (slate-50)
Cell Padding: 0.75rem 1rem
```

**Sortable Column**:
```
Cursor: pointer
Hover: #f1f5f9 (slate-100)
Icon: ↑ or ↓ next to label
```

**Action Column**:
```
Width: Auto (fit content)
Icons: View (👁️), Edit (✏️), Delete (🗑️)
Icon Buttons: Hover background, rounded
```

---

### Modal/Dialog Component

**Overlay**:
```
Background: rgba(0, 0, 0, 0.5)
Position: fixed, full screen
Z-index: 50
```

**Modal Content**:
```
Background: white
Max Width: 500px (small), 768px (medium), 1024px (large)
Border Radius: 0.5rem
Shadow: Large
Padding: 1.5rem
```

**Modal Header**:
```
Border Bottom: 1px solid #e2e8f0
Padding Bottom: 1rem
Close Button: Top right
```

**Modal Footer**:
```
Border Top: 1px solid #e2e8f0
Padding Top: 1rem
Buttons: Right aligned
```

---

### Stats Card Component

**Layout**:
```
┌─────────────────────┐
│ [Icon]  Total       │
│         Rewards     │
│                     │
│         1,250       │
│                     │
│ 📊 +12% vs last mo. │
└─────────────────────┘
```

**Styles**:
```
Background: white
Border: 1px solid #e2e8f0
Border Radius: 0.5rem
Padding: 1.5rem
Icon: 3rem size, colored background (light shade)
Title: 0.875rem, muted color
Value: 2rem, bold
Trend: 0.75rem, colored (green/red)
```

---

### Dropdown/Select Component

**Default State**:
```
Height: 2.5rem
Border: 1px solid #e2e8f0
Border Radius: 0.375rem
Padding: 0.5rem 0.75rem
Chevron: Right side
```

**Open State**:
```
Dropdown Menu: Absolute position
Background: white
Border: 1px solid #e2e8f0
Shadow: Medium
Max Height: 300px (scrollable)
```

**Option**:
```
Padding: 0.5rem 0.75rem
Hover: #f1f5f9 (slate-100)
Selected: #dbeafe (blue-100)
```

---

## Navigation Flow

### User Journey: Super Admin

```
Login
  ↓
Dashboard
  ├─→ Tenants
  │    ├─→ Create Tenant
  │    └─→ View/Edit Tenant
  ├─→ Merchants
  │    ├─→ Create Merchant
  │    └─→ View/Edit Merchant
  ├─→ Events
  │    ├─→ Create Event
  │    ├─→ View Event Details
  │    └─→ Edit Event
  ├─→ Users
  │    ├─→ Create User
  │    └─→ Assign Roles
  └─→ Analytics
```

### User Journey: Tenant Marketing Admin

```
Login
  ↓
Events List
  ├─→ Create Event
  │    └─→ Event Details (after creation)
  ├─→ View Event Details
  │    ├─→ Edit Event (if DRAFT)
  │    └─→ View Rewards List
  └─→ Analytics (for assigned tenants)
```

### User Journey: Merchant Admin

```
Login
  ↓
Dashboard (Rewards Overview)
  ├─→ Rewards Dashboard
  │    ├─→ Outstanding Tab
  │    ├─→ Claimed Tab
  │    └─→ Customer Analytics Tab
  ├─→ Claim Reward
  │    ├─→ Enter Code
  │    ├─→ Verify
  │    ├─→ Claim
  │    └─→ Success (Print Receipt)
  └─→ Analytics (Cross-Event)
```

---

## Responsive Design

### Breakpoints

```
Mobile: < 640px (sm)
Tablet: 640px - 1024px (md to lg)
Desktop: > 1024px (xl)
```

### Mobile Adaptations

#### Navigation
- Hamburger menu instead of sidebar
- Bottom navigation bar for primary actions

#### Layout
- Single column layout
- Cards stack vertically
- Tables convert to card list view

#### Forms
- Full-width inputs
- Stack form fields vertically

#### Stats Cards
- 1 column on mobile
- 2 columns on tablet
- 4 columns on desktop

#### Tables
- Horizontal scroll on mobile
- Show essential columns only
- "View Details" button for full info

---

## User Experience Guidelines

### Loading States

**Page Load**:
- Show skeleton screens
- Animate content fade-in
- Progress indicators for long operations

**Button Loading**:
- Disable button
- Show spinner icon
- Change text (e.g., "Submitting...")

**Table Loading**:
- Show skeleton rows
- Pulse animation

---

### Error Handling

**Form Errors**:
- Inline validation (on blur)
- Red border + error icon
- Error message below field
- Scroll to first error on submit

**API Errors**:
- Toast notifications (top-right)
- Auto-dismiss after 5 seconds
- Error icon + message
- "Retry" action if applicable

**404/Empty States**:
- Centered empty state illustration
- Descriptive message
- Call-to-action button

---

### Success Feedback

**Toast Notifications**:
- Top-right position
- Green checkmark icon
- Auto-dismiss after 3 seconds
- Slide-in animation

**Inline Success**:
- Green checkmark icon
- Success message
- Fade-in animation

---

### Accessibility

**Keyboard Navigation**:
- Tab order follows visual flow
- Focus indicators visible
- Skip to main content link

**Screen Readers**:
- ARIA labels on interactive elements
- Alt text on images
- Semantic HTML

**Color Contrast**:
- WCAG AA compliance
- Text contrast ratio > 4.5:1
- Don't rely on color alone for meaning

---

### Animations & Transitions

**Page Transitions**:
- Fade in (300ms)

**Hover Effects**:
- Background color change (150ms)
- Scale up slightly (transform: scale(1.02))

**Modal Open/Close**:
- Fade overlay (200ms)
- Scale modal (200ms, ease-out)

**Loading Spinners**:
- Rotate animation (infinite)
- Color: Primary blue

---

## Design Checklist

Before finalizing each page, ensure:

- [ ] Consistent spacing (using spacing scale)
- [ ] Proper color contrast
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Responsive on all breakpoints
- [ ] Keyboard accessible
- [ ] Focus indicators visible
- [ ] Success feedback shown
- [ ] Icons used consistently
- [ ] Typography hierarchy clear
- [ ] Buttons have proper states (default, hover, active, disabled)
- [ ] Forms have validation
- [ ] Tables have sorting/filtering
- [ ] Cards have proper shadows
- [ ] Modals have close buttons
- [ ] Navigation is intuitive

---

## Resources

### Design Tools
- Figma/Sketch for mockups
- TailwindCSS documentation
- Lucide React icons library
- Recharts for charts

### Inspiration
- Vercel Dashboard
- Stripe Dashboard
- Linear App
- Notion

---

**Ready to Design!** 🎨

Use this specification as your design system guide when building in bolt.new or any other tool.

