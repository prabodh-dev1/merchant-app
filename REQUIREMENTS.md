# Merchant App Requirements Document

## 1. Introduction & Overview

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the Merchant App system, a web-based application for managing marketing events, rewards, and customer redemptions for Bluboy merchants.

### 1.2 Scope
The Merchant App enables:
- Bluboy Sales Admins to define Marketing Events based on merchant requirements
- Management of reward codes with a two-part structure
- Customer reward redemption through merchant POS systems
- Role-based access control for different user types
- Comprehensive dashboards for tracking rewards and customers

### 1.3 System Architecture Overview
The system follows a modern web application architecture:
- **Frontend**: React-based Next.js application with TypeScript
- **Backend**: Next.js API Routes with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Firebase Auth
- **Caching**: Redis
- **Deployment**: Docker containerization

---

## 2. Marketing Events Management

### 2.1 Overview
Marketing Events are created by Bluboy Sales Admins based on merchant requirements. Each event defines the parameters for reward distribution and management.

### 2.2 Event Configuration Requirements

When creating a Marketing Event, the following parameters must be configured:

1. **Price Range of Reward**
   - Minimum reward value (in currency units)
   - Maximum reward value (in currency units)
   - Validation: Maximum must be greater than minimum

2. **Number of Rewards**
   - Total count of rewards to be generated for the event
   - Must be a positive integer
   - System must track available vs. distributed rewards

3. **Dummy Rewards Configuration**
   - Boolean flag indicating whether dummy/test rewards are allowed for the event
   - If enabled, dummy rewards can be created for testing purposes
   - Dummy rewards should be clearly marked and excluded from production statistics

4. **Validity Period**
   - Event start date and time
   - Event end date and time
   - Reward validity period (may differ from event period)
   - Validation: End date must be after start date

5. **Customer Reward Limit**
   - Configuration option: Can a customer receive more than one reward from the same event?
   - If set to "single reward per customer", system must track customer-event associations
   - If set to "multiple rewards allowed", no such restriction applies

### 2.3 Event Lifecycle
- **Draft**: Event created but not yet active
- **Active**: Event is live and rewards can be distributed
- **Expired**: Event has passed its end date
- **Cancelled**: Event terminated before completion

### 2.4 Event Management Features
- Create new Marketing Events
- Edit event configuration (before activation)
- View event details and statistics
- Deactivate or cancel events
- View all events with filtering and search capabilities

---

## 3. Reward Code System

### 3.1 Reward Code Structure

Each reward code consists of **two parts**, each 8 characters long:

#### Part 1: Customer-Facing Code (8 characters)
- **Format**: Alphanumeric (A-Z, 0-9)
- **Structure**: 
  - First 3 characters: Unique merchant code (fixed for all rewards from the same merchant)
  - Remaining 5 characters: Unique identifier
- **Uniqueness**: Must be unique across all events globally
- **Visibility**: This part is shared with customers and displayed on QR codes

#### Part 2: Redemption Code (8 characters)
- **Format**: Alphanumeric (A-Z, 0-9)
- **Structure**: Randomly generated 8-character string
- **Uniqueness**: Must be unique across all events globally
- **Visibility**: **Never shared with customers** - only used during redemption process
- **Purpose**: Security mechanism to prevent code guessing/fraud

### 3.2 Complete Reward Code Format
```
[MerchantCode][UniqueID]-[RedemptionCode]
Example: ABC12345-9X7K2M1P
         └─Part1─┘ └─Part2─┘
```

### 3.3 Reward Properties

Each reward must have:
- **Unique Reward Code**: Two-part code as specified above
- **Marketing Event ID**: Links reward to the specific event
- **Reward Value**: Monetary value of the reward (within event's price range)
- **Status**: 
  - `AVAILABLE`: Not yet distributed
  - `DISTRIBUTED`: Given to customer but not yet claimed
  - `CLAIMED`: Successfully redeemed by customer
  - `EXPIRED`: Past validity period
  - `CANCELLED`: Invalidated
- **Distribution Timestamp**: When reward was given to customer
- **Claim Timestamp**: When reward was redeemed
- **Customer Information**: (if applicable) Customer identifier

### 3.4 Reward Code Generation Rules

1. **Uniqueness Constraints**
   - Part 1 must be unique across all events
   - Part 2 must be unique across all events
   - Complete code (Part 1 + Part 2) must be unique globally

2. **Merchant Code Integration**
   - First 3 characters of Part 1 must match the merchant's unique code
   - Merchant codes must be pre-registered in the system

3. **Generation Algorithm**
   - System must generate codes ensuring uniqueness
   - Use cryptographically secure random generation for Part 2
   - Validate uniqueness before assignment

---

## 4. API Endpoints Specification

### 4.1 Get Available Reward Code

**Endpoint**: `GET /api/rewards/available`

**Purpose**: Retrieve the first part of a reward code that has not yet been distributed for a specific Marketing Event.

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | string | Yes | Unique Marketing Event ID |

**Request Example**:
```json
GET /api/rewards/available?eventId=EVT-2024-001
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "rewardCodePart1": "ABC12345",
    "eventId": "EVT-2024-001",
    "rewardValue": 50.00
  }
}
```

**Response (No Available Rewards - 404)**:
```json
{
  "success": false,
  "error": "NO_REWARDS_AVAILABLE",
  "message": "No available rewards found for the specified event"
}
```

**Response (Invalid Event - 400)**:
```json
{
  "success": false,
  "error": "INVALID_EVENT_ID",
  "message": "Marketing Event ID not found or inactive"
}
```

**Authentication**: Required (role-based access)

---

### 4.2 Claim Reward API

**Endpoint**: `POST /api/rewards/claim`

**Purpose**: Mark a reward as claimed and return complete reward information.

**Request Body**:
```json
{
  "rewardCode": "ABC12345",
  "eventId": "EVT-2024-001"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rewardCode` | string | Yes | First part of reward code (8 characters) |
| `eventId` | string | Yes | Marketing Event ID |

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "fullRewardCode": "ABC12345-9X7K2M1P",
    "rewardCodePart1": "ABC12345",
    "rewardCodePart2": "9X7K2M1P",
    "rewardValue": 50.00,
    "eventId": "EVT-2024-001",
    "claimedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Invalid Code - 400)**:
```json
{
  "success": false,
  "error": "INVALID_REWARD_CODE",
  "message": "Reward code not found or invalid"
}
```

**Response (Already Claimed - 409)**:
```json
{
  "success": false,
  "error": "REWARD_ALREADY_CLAIMED",
  "message": "This reward has already been claimed"
}
```

**Response (Expired - 410)**:
```json
{
  "success": false,
  "error": "REWARD_EXPIRED",
  "message": "Reward validity period has expired"
}
```

**Authentication**: Required (Merchant Admin role)

**Side Effects**:
- Updates reward status to `CLAIMED`
- Records claim timestamp
- Triggers callback to Bluboy Server (see section 4.3)

---

### 4.3 Bluboy Server Callback API

**Endpoint**: `POST /api/callbacks/reward-claimed`

**Purpose**: Receive notification from Merchant App Server when a reward is claimed, and update the reward status in Bluboy system.

**Request Body**:
```json
{
  "eventId": "EVT-2024-001",
  "rewardCode": "ABC12345-9X7K2M1P",
  "rewardValue": 50.00,
  "claimedAt": "2024-01-15T10:30:00Z"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | string | Yes | Marketing Event ID |
| `rewardCode` | string | Yes | Full reward code (both parts) |
| `rewardValue` | number | Yes | Reward value in currency units |
| `claimedAt` | string | Yes | ISO 8601 timestamp of claim |

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Reward claim updated successfully"
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "Invalid request data"
}
```

**Authentication**: 
- API key or token-based authentication
- Merchant App Server must be authenticated

**Implementation Notes**:
- This endpoint is called by Merchant App Server after successful local claim
- Bluboy Server validates the request and updates the reward status
- Should be idempotent (multiple calls with same data should not cause issues)

---

## 5. Reward Redemption Process

### 5.1 Redemption Flow

#### Step 1: Customer Presents Reward
- Customer shares reward code (Part 1) or QR code with merchant POS
- QR code contains the first part of the reward code (8 characters)

#### Step 2: Merchant POS Entry
- Merchant POS staff enters the reward code into Merchant App web interface
- System validates code format (8 alphanumeric characters)

#### Step 3: Code Validation
- System checks if code exists in database
- Validates code is associated with the correct merchant
- Checks if code is available for redemption (not already claimed, not expired)
- Validates event is still active (if applicable)

#### Step 4: Claim Processing
- Merchant clicks "Claim" button in the web app
- System calls Claim API (section 4.2)
- Reward status updated to `CLAIMED`
- Full reward code and value retrieved

#### Step 5: Display & Confirmation
- **Merchant App Display**:
  - Shows "Claim Accepted" confirmation
  - Displays full reward code (both parts)
  - Displays reward value
  - Shows claim timestamp

- **Customer Notification**:
  - Customer is informed of the actual reward value that was processed
  - Confirmation message displayed to customer
  - Receipt or confirmation document generated (optional)

### 5.2 Validation Rules

1. **Code Format Validation**
   - Must be exactly 8 alphanumeric characters
   - Must match pattern: `^[A-Z0-9]{8}$`

2. **Code Existence**
   - Code must exist in system
   - Code must be associated with the merchant attempting redemption

3. **Status Validation**
   - Code must be in `DISTRIBUTED` or `AVAILABLE` status
   - Cannot be `CLAIMED`, `EXPIRED`, or `CANCELLED`

4. **Event Validation**
   - Associated event must be active (if event has validity period)
   - Event must not be cancelled

5. **Customer Limit Validation** (if configured)
   - If event restricts to one reward per customer, validate customer hasn't already claimed from this event

### 5.3 Error Handling

| Error Scenario | User Message | Technical Response |
|----------------|--------------|-------------------|
| Invalid code format | "Please enter a valid 8-character reward code" | 400 Bad Request |
| Code not found | "Reward code not found. Please verify the code." | 404 Not Found |
| Already claimed | "This reward has already been claimed" | 409 Conflict |
| Expired reward | "This reward has expired" | 410 Gone |
| Event inactive | "This reward is not available for redemption" | 403 Forbidden |
| Merchant mismatch | "This reward is not valid for this merchant" | 403 Forbidden |

---

## 6. Role-Based Access Control

### 6.1 Authentication System

- **Provider**: Firebase Authentication
- **Token Format**: JWT tokens with role information embedded
- **Role Storage**: User role must be present as part of the authentication token
- **Token Validation**: All API endpoints must validate Firebase tokens and extract role information

### 6.2 User Roles

#### 6.2.1 Bluboy Super Admin

**Capabilities**:
- Full system access to all features and data
- Create new tenants
- Assign Marketing Admins to tenants
- Manage all Marketing Events (view, create, edit, delete)
- Access all merchant dashboards
- Manage user accounts and roles
- System configuration and settings
- View system-wide analytics and reports

**Restrictions**: None

**Access Scope**: Global (all tenants, all merchants, all events)

---

#### 6.2.2 Tenant Marketing Admin

**Capabilities**:
- Create new Marketing Events for assigned tenants
- Edit Marketing Events for assigned tenants (before activation)
- View Marketing Events for assigned tenants
- Access Marketing Event features and configuration for assigned tenants
- View event statistics and reports for assigned tenants
- Manage rewards for assigned tenant events

**Restrictions**:
- Cannot access events or data outside assigned tenants
- Cannot create or manage tenants
- Cannot assign other Marketing Admins
- Limited to tenant-specific operations

**Access Scope**: Tenant-specific (only assigned tenants)

**Assignment**: Assigned to one or more tenants by Bluboy Super Admin

---

#### 6.2.3 Merchant Admin

**Capabilities**:
- Access Rewards Dashboard for assigned merchants
- View outstanding (available/distributed) rewards
- View claimed rewards with respective codes
- Access Customer vs Reward Dashboard
- Process reward redemptions (claim rewards)
- View merchant-specific analytics
- Filter and search rewards by event

**Restrictions**:
- Cannot create or edit Marketing Events
- Cannot access other merchants' data
- Cannot view system-wide or tenant-wide data
- Limited to merchant-specific operations

**Access Scope**: Merchant-specific (only assigned merchants)

**Assignment**: Assigned to one or more merchants (typically by Tenant Marketing Admin or Super Admin)

---

### 6.3 Permission Matrix

| Feature | Super Admin | Tenant Marketing Admin | Merchant Admin |
|---------|------------|------------------------|----------------|
| Create Tenants | ✅ | ❌ | ❌ |
| Assign Marketing Admins | ✅ | ❌ | ❌ |
| Create Marketing Events | ✅ | ✅ (assigned tenants) | ❌ |
| Edit Marketing Events | ✅ | ✅ (assigned tenants) | ❌ |
| View All Events | ✅ | ✅ (assigned tenants) | ❌ |
| Access Rewards Dashboard | ✅ | ❌ | ✅ (assigned merchants) |
| Claim Rewards | ✅ | ❌ | ✅ (assigned merchants) |
| View Customer Analytics | ✅ | ✅ (assigned tenants) | ✅ (assigned merchants) |
| System Configuration | ✅ | ❌ | ❌ |

---

## 7. Dashboard & Reporting

### 7.1 Event-Based Rewards Dashboard

**Access**: Merchant Admin users

**Selection**: Dashboard filtered by Marketing Event (dropdown selector)

#### 7.1.1 Outstanding Rewards View

**Display Data**:
- Count of available rewards (not yet distributed)
- Count of distributed rewards (not yet claimed)
- List of outstanding rewards with:
  - Reward code (Part 1)
  - Reward value
  - Distribution status
  - Distribution timestamp (if distributed)
  - Days until expiration (if applicable)

**Filters**:
- Status filter: Available / Distributed
- Value range filter
- Date range filter (distribution date)

**Actions**:
- Export to CSV/Excel
- Print view

---

#### 7.1.2 Claimed Rewards View

**Display Data**:
- Count of claimed rewards
- Total value of claimed rewards
- List of claimed rewards with:
  - Full reward code (both parts)
  - Reward value
  - Claim timestamp
  - Customer information (if available)

**Filters**:
- Date range filter (claim date)
- Value range filter
- Search by reward code

**Actions**:
- Export to CSV/Excel
- Print view
- View reward details

---

#### 7.1.3 Customer vs Reward Dashboard

**Display Data**:
- Total number of customers who received rewards
- Total number of customers who claimed rewards
- Customer list with:
  - Customer identifier/name
  - Number of rewards received
  - Number of rewards claimed
  - Total reward value received
  - Total reward value claimed
  - Claim rate percentage

**Visualizations**:
- Bar chart: Customers by reward count
- Pie chart: Claimed vs Unclaimed rewards
- Line chart: Daily claim trends

**Filters**:
- Customer search
- Reward count range
- Claim status filter

---

### 7.2 Across-Event Dashboard

**Access**: Merchant Admin users

**Scope**: Aggregated data across all Marketing Events for the assigned merchant

#### 7.2.1 Customer Analytics

**Metrics**:
1. **Unique Customers Across All Events**
   - Count of distinct customers who received at least one reward
   - Deduplication across events

2. **Total Customers Across All Events**
   - Total count of customer-reward associations
   - May include same customer multiple times if they received rewards from multiple events

3. **Customer Reward Distribution**
   - Number of customers by reward count (1 reward, 2 rewards, 3+ rewards)
   - Average rewards per customer

#### 7.2.2 Filters

**Customer Selection Filters**:
- Filter customers who received rewards across all events
- Filter customers who received rewards from specific event(s)
- Filter customers who claimed rewards
- Filter customers by reward value range
- Filter customers by number of rewards received

**Additional Filters**:
- Date range (reward distribution date)
- Event selection (multi-select)
- Reward status filter

#### 7.2.3 Visualizations

- Customer reward distribution chart
- Event performance comparison
- Claim rate trends over time
- Reward value distribution

---

### 7.3 Dashboard Features

**Common Features Across All Dashboards**:
- Real-time data updates
- Export functionality (CSV, Excel, PDF)
- Print-friendly views
- Date range selection
- Search and filter capabilities
- Responsive design for mobile/tablet access
- Data refresh button
- Scheduled report generation (future enhancement)

---

## 8. Technical Stack & Infrastructure

### 8.1 Frontend Technology Stack

#### 8.1.1 Core Framework
- **React**: Version 18
- **TypeScript**: For type safety and better developer experience
- **Next.js**: Version 15 framework
  - Server-side rendering (SSR)
  - Static site generation (SSG) where applicable
  - API routes for backend functionality

#### 8.1.2 Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- Responsive design principles
- Custom theme configuration

#### 8.1.3 Icons
- **Lucide React**: Modern icon library
- Consistent icon usage across the application

#### 8.1.4 Additional Frontend Requirements
- Form validation libraries
- State management (React Context or Zustand/Redux if needed)
- HTTP client (Axios or Fetch API)
- Date/time handling (date-fns or dayjs)

---

### 8.2 Backend Technology Stack

#### 8.2.1 API Framework
- **Next.js API Routes**: TypeScript-based API endpoints
- **RESTful Architecture**: Standard HTTP methods and status codes
- API versioning strategy (e.g., `/api/v1/...`)

#### 8.2.2 Database
- **PostgreSQL**: Relational database
- **Prisma ORM**: Type-safe database client and query builder
- Database migrations via Prisma Migrate
- Connection pooling for performance

#### 8.2.3 Caching
- **Redis**: In-memory data store for caching
- **Connection Configuration**: 
  - Connection details stored in `.env` file
  - Connection managed via `redis-connect.js` utility
  - Caching strategy for:
    - Frequently accessed reward codes
    - Event data
    - User session data
    - Dashboard statistics (with TTL)

#### 8.2.4 Authentication
- **Firebase Authentication**: 
  - User authentication and authorization
  - JWT token generation and validation
  - Role information embedded in tokens
  - Token refresh mechanism

---

### 8.3 Infrastructure & Deployment

#### 8.3.1 Containerization
- **Docker**: Application containerization
- **Docker Compose**: For local development (database, Redis, app)
- Dockerfile for production builds
- Multi-stage builds for optimization

#### 8.3.2 Environment Configuration
- Environment variables in `.env` files
- Separate configurations for:
  - Development
  - Staging
  - Production
- Secure storage of sensitive data (API keys, database credentials)

#### 8.3.3 Additional Infrastructure Requirements
- **Logging**: Structured logging system
- **Error Tracking**: Error monitoring and reporting
- **API Documentation**: OpenAPI/Swagger documentation
- **Health Checks**: Endpoints for system health monitoring

---

## 9. Data Model & Database Requirements

### 9.1 Core Entities

#### 9.1.1 Tenant
**Purpose**: Represents a tenant organization in a multi-tenant system

**Attributes**:
- `id` (UUID, Primary Key)
- `name` (String)
- `code` (String, Unique)
- `status` (Enum: ACTIVE, INACTIVE)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships**:
- Has many Marketing Admins
- Has many Merchants
- Has many Marketing Events

---

#### 9.1.2 Merchant
**Purpose**: Represents a merchant business

**Attributes**:
- `id` (UUID, Primary Key)
- `name` (String)
- `code` (String, Unique, 3 characters) - Used in reward codes
- `tenantId` (UUID, Foreign Key → Tenant)
- `status` (Enum: ACTIVE, INACTIVE)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships**:
- Belongs to Tenant
- Has many Marketing Events
- Has many Rewards
- Has many Merchant Admins

**Constraints**:
- Merchant code must be exactly 3 alphanumeric characters
- Merchant code must be unique globally

---

#### 9.1.3 Marketing Event
**Purpose**: Represents a marketing campaign/event

**Attributes**:
- `id` (UUID, Primary Key)
- `name` (String)
- `tenantId` (UUID, Foreign Key → Tenant)
- `merchantId` (UUID, Foreign Key → Merchant)
- `minRewardValue` (Decimal)
- `maxRewardValue` (Decimal)
- `totalRewards` (Integer)
- `availableRewards` (Integer) - Calculated field
- `distributedRewards` (Integer) - Calculated field
- `claimedRewards` (Integer) - Calculated field
- `allowDummyRewards` (Boolean)
- `allowMultipleRewardsPerCustomer` (Boolean)
- `startDate` (DateTime)
- `endDate` (DateTime)
- `rewardValidityStart` (DateTime, Optional)
- `rewardValidityEnd` (DateTime, Optional)
- `status` (Enum: DRAFT, ACTIVE, EXPIRED, CANCELLED)
- `createdBy` (UUID, Foreign Key → User)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships**:
- Belongs to Tenant
- Belongs to Merchant
- Has many Rewards
- Created by User (Marketing Admin or Super Admin)

**Constraints**:
- `maxRewardValue` must be greater than `minRewardValue`
- `endDate` must be after `startDate`
- `totalRewards` must be positive integer

---

#### 9.1.4 Reward
**Purpose**: Represents an individual reward code

**Attributes**:
- `id` (UUID, Primary Key)
- `codePart1` (String, 8 characters, Unique) - Customer-facing part
- `codePart2` (String, 8 characters, Unique) - Redemption part
- `fullCode` (String, 17 characters, Unique) - Combined code with separator
- `eventId` (UUID, Foreign Key → Marketing Event)
- `merchantId` (UUID, Foreign Key → Merchant)
- `rewardValue` (Decimal)
- `status` (Enum: AVAILABLE, DISTRIBUTED, CLAIMED, EXPIRED, CANCELLED)
- `isDummy` (Boolean) - Flag for test/dummy rewards
- `customerId` (String, Optional) - Customer identifier if applicable
- `distributedAt` (DateTime, Optional)
- `claimedAt` (DateTime, Optional)
- `expiresAt` (DateTime, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships**:
- Belongs to Marketing Event
- Belongs to Merchant

**Constraints**:
- `codePart1` must be unique globally
- `codePart2` must be unique globally
- `fullCode` must be unique globally
- First 3 characters of `codePart1` must match merchant code
- `rewardValue` must be within event's min/max range
- `codePart1` and `codePart2` must be exactly 8 alphanumeric characters each

**Indexes**:
- Index on `codePart1` for fast lookup
- Index on `fullCode` for redemption queries
- Index on `eventId` and `status` for filtering
- Index on `merchantId` for merchant-specific queries

---

#### 9.1.5 User
**Purpose**: Represents system users

**Attributes**:
- `id` (UUID, Primary Key)
- `firebaseUid` (String, Unique) - Firebase Authentication UID
- `email` (String, Unique)
- `name` (String)
- `role` (Enum: SUPER_ADMIN, TENANT_MARKETING_ADMIN, MERCHANT_ADMIN)
- `status` (Enum: ACTIVE, INACTIVE)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships**:
- Has many Tenant Assignments (for Tenant Marketing Admin)
- Has many Merchant Assignments (for Merchant Admin)
- Created many Marketing Events (if Marketing Admin or Super Admin)

---

#### 9.1.6 Tenant Assignment
**Purpose**: Links Tenant Marketing Admins to Tenants

**Attributes**:
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → User)
- `tenantId` (UUID, Foreign Key → Tenant)
- `assignedBy` (UUID, Foreign Key → User) - Super Admin who made assignment
- `assignedAt` (DateTime)

**Relationships**:
- Belongs to User
- Belongs to Tenant

**Constraints**:
- User must have role TENANT_MARKETING_ADMIN
- Unique constraint on (userId, tenantId)

---

#### 9.1.7 Merchant Assignment
**Purpose**: Links Merchant Admins to Merchants

**Attributes**:
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → User)
- `merchantId` (UUID, Foreign Key → Merchant)
- `assignedBy` (UUID, Foreign Key → User) - Admin who made assignment
- `assignedAt` (DateTime)

**Relationships**:
- Belongs to User
- Belongs to Merchant

**Constraints**:
- User must have role MERCHANT_ADMIN
- Unique constraint on (userId, merchantId)

---

### 9.2 Database Schema Requirements

#### 9.2.1 Data Integrity
- Foreign key constraints on all relationships
- Unique constraints on critical fields (codes, emails, etc.)
- Check constraints for value ranges and formats
- Cascade delete rules where appropriate

#### 9.2.2 Performance Optimization
- Indexes on frequently queried fields:
  - Reward codes (codePart1, fullCode)
  - Event and merchant foreign keys
  - Status fields for filtering
  - Date fields for range queries
- Composite indexes for common query patterns

#### 9.2.3 Data Retention
- Soft delete pattern for critical entities (mark as deleted, don't remove)
- Audit trail for important operations (event creation, reward claims)
- Archive strategy for old/expired data

---

## 10. Security & Authentication

### 10.1 Authentication Requirements

#### 10.1.1 Firebase Authentication Integration
- All users must authenticate via Firebase Auth
- Support for email/password authentication
- Support for social authentication (if required in future)
- Token-based authentication for API access

#### 10.1.2 Token Management
- JWT tokens issued by Firebase
- Token must include user role information
- Token validation on every API request
- Token refresh mechanism
- Token expiration handling

#### 10.1.3 Role in Token
- User role must be embedded in authentication token
- Roles: `SUPER_ADMIN`, `TENANT_MARKETING_ADMIN`, `MERCHANT_ADMIN`
- Token claims must be validated against database user record

---

### 10.2 Authorization Requirements

#### 10.2.1 Role-Based Access Control (RBAC)
- All API endpoints must check user role
- Access control based on role and resource ownership
- Tenant Marketing Admins can only access assigned tenants
- Merchant Admins can only access assigned merchants
- Super Admins have unrestricted access

#### 10.2.2 Resource-Level Authorization
- Validate user has access to specific tenant/merchant/event
- Prevent cross-tenant data access
- Prevent cross-merchant data access
- Validate event ownership before reward operations

---

### 10.3 Data Security

#### 10.3.1 Sensitive Data Protection
- Reward code Part 2 must never be exposed to customers
- API responses must filter sensitive data based on user role
- Database queries must include tenant/merchant filters
- Encrypt sensitive data at rest (if required)

#### 10.3.2 API Security
- HTTPS only for all API communications
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention (via Prisma ORM)
- XSS prevention in API responses

#### 10.3.3 Environment Security
- Secure storage of environment variables
- No hardcoded credentials
- Separate credentials for each environment
- Regular credential rotation policy

---

## 11. Non-Functional Requirements

### 11.1 Performance Requirements

- **API Response Time**: 
  - Reward code lookup: < 200ms (with Redis caching)
  - Dashboard data loading: < 2 seconds
  - Reward claim processing: < 500ms

- **Concurrent Users**: Support at least 100 concurrent users
- **Database Performance**: Optimized queries with proper indexing
- **Caching Strategy**: 
  - Frequently accessed data cached in Redis
  - Cache TTL: 5-15 minutes for dynamic data
  - Cache invalidation on data updates

---

### 11.2 Scalability Requirements

- **Horizontal Scaling**: Application must support horizontal scaling
- **Database Scaling**: PostgreSQL connection pooling
- **Caching Scaling**: Redis cluster support for high availability
- **Load Distribution**: Stateless API design for load balancing

---

### 11.3 Reliability Requirements

- **Uptime**: 99.9% availability target
- **Error Handling**: Graceful error handling with user-friendly messages
- **Data Consistency**: ACID transactions for critical operations
- **Backup Strategy**: Regular database backups
- **Disaster Recovery**: Recovery procedures documented

---

### 11.4 Usability Requirements

- **Responsive Design**: Mobile, tablet, and desktop support
- **Accessibility**: WCAG 2.1 Level AA compliance
- **User Interface**: Intuitive and user-friendly
- **Error Messages**: Clear, actionable error messages
- **Loading States**: Appropriate loading indicators

---

### 11.5 Maintainability Requirements

- **Code Quality**: TypeScript for type safety
- **Documentation**: Code comments and API documentation
- **Testing**: Unit tests and integration tests
- **Logging**: Structured logging for debugging and monitoring
- **Version Control**: Git-based version control

---

## 12. Assumptions & Constraints

### 12.1 Assumptions

1. **Merchant Code Format**
   - Assumes merchant codes are pre-registered in the system
   - Merchant codes are exactly 3 alphanumeric characters
   - Merchant codes are unique and stable (don't change)

2. **Reward Code Generation**
   - Assumes sufficient entropy in code generation to prevent collisions
   - Assumes code generation is fast enough for bulk operations

3. **Event Lifecycle**
   - Assumes events have a clear start and end date
   - Assumes events can be created in draft state before activation

4. **Customer Identification**
   - Assumes customer identification mechanism exists (may be optional)
   - Assumes customer data privacy regulations are handled separately

5. **Network Connectivity**
   - Assumes reliable network connection between Merchant App and Bluboy Server
   - Assumes callback API has retry mechanism for failed calls

6. **Timezone Handling**
   - Assumes all timestamps are stored in UTC
   - Assumes timezone conversion handled at display layer

---

### 12.2 Constraints

1. **Reward Code Format**
   - Part 1: Exactly 8 alphanumeric characters (first 3 = merchant code)
   - Part 2: Exactly 8 alphanumeric characters
   - Total: 16 characters + 1 separator = 17 characters

2. **Uniqueness Constraints**
   - Reward codes must be unique globally across all events
   - Merchant codes must be unique globally
   - Event IDs must be unique globally

3. **Value Constraints**
   - Reward values must be within event's min/max range
   - Reward values must be positive numbers
   - Currency format and precision (assume 2 decimal places)

4. **Character Set**
   - Alphanumeric: A-Z (uppercase) and 0-9
   - No special characters in reward codes
   - Case-sensitive code matching

5. **Technical Constraints**
   - Must use specified tech stack (React 18, Next.js 15, PostgreSQL, etc.)
   - Must use Firebase Auth (cannot change authentication provider)
   - Must use Redis for caching (connection via redis-connect.js)
   - Must support Docker containerization

6. **Business Constraints**
   - Part 2 of reward code never shared with customers
   - Dummy rewards must be clearly marked and excluded from production stats
   - Customer reward limits enforced per event configuration

---

### 12.3 Out of Scope (Future Enhancements)

1. **QR Code Generation**: QR code generation logic not specified (assumed to be handled separately)
2. **Customer Management**: Detailed customer profile management
3. **Payment Processing**: Integration with payment gateways
4. **Notification System**: Email/SMS notifications to customers
5. **Advanced Analytics**: Machine learning-based insights
6. **Mobile Apps**: Native iOS/Android applications
7. **Multi-Currency**: Support for multiple currencies
8. **Reward Transfer**: Ability to transfer rewards between customers
9. **Bulk Operations**: Bulk reward code generation UI
10. **API Rate Limiting UI**: Admin interface for rate limit configuration

---

## 13. Glossary

- **Marketing Event**: A campaign or promotion created by Bluboy Sales Admin for a merchant
- **Reward Code**: A two-part alphanumeric code used to identify and redeem rewards
- **Reward Code Part 1**: Customer-facing 8-character code (first 3 characters = merchant code)
- **Reward Code Part 2**: Redemption-only 8-character code (never shared with customers)
- **Claim**: The process of redeeming a reward code at merchant POS
- **Dummy Reward**: Test reward used for testing purposes, excluded from production statistics
- **Tenant**: An organization that can have multiple merchants
- **Merchant**: A business that participates in marketing events
- **Bluboy Sales Admin**: Super admin user who can create events and manage the system
- **Tenant Marketing Admin**: User who manages marketing events for assigned tenants
- **Merchant Admin**: User who manages rewards and redemptions for assigned merchants
- **POS**: Point of Sale system where customers present reward codes

---

## 14. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-XX | Requirements Team | Initial requirements document based on notes.txt |

---

**Document Status**: Draft / Approved / Under Review

**Next Steps**:
1. Review and approval by stakeholders
2. Technical design document creation
3. Database schema design
4. API specification details
5. UI/UX mockups

