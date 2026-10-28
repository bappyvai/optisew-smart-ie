# OptiSew Smart IE System — Technical & Business Architecture Documentation

**System Version:** 2.4.0  
**Domain:** Ready-Made Garments (RMG) / Apparel Manufacturing Industrial Engineering (IE) & MES  
**Target Roles:** Industrial Engineers, Work Study Officers, Line Supervisors, Production Managers, Factory GM, Systems Architects  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Business Domain & Industrial Engineering (IE) Methodology](#2-business-domain--industrial-engineering-ie-methodology)
   - [2.1 Mother Operation vs. GSD Operation Taxonomy](#21-the-operation-hierarchy-mother-op-vs-gsd-operation)
   - [2.2 Style SMV Summation & Key Mathematical Formulas](#22-style-smv-summation--key-mathematical-formulas)
   - [2.3 Stopwatch Capacity Study & Continuous Piece-Counting](#23-stopwatch-capacity-study--efficiency-calculation)
   - [2.4 Skill Matrix Grading Tiers & Allocation Policy](#24-skill-matrix-grading-tiers)
3. [Frontend Technical Architecture](#3-frontend-technical-architecture)
   - [3.1 Technology Stack & Build Pipeline](#31-technology-stack--build-pipeline)
   - [3.2 State Management & Context Architecture](#32-state-management--context-architecture)
   - [3.3 High-Scale Memory Optimization (1,000 Operators & 2,000 Machines)](#33-high-scale-memory-optimization-1000-operators--2000-machines)
   - [3.4 Stopwatch Precision Timing Engine](#34-stopwatch-precision-timing-engine)
   - [3.5 Client-Side Excel and PDF Export Pipeline](#35-client-side-excel-and-pdf-export-pipeline)
   - [3.6 QR & Barcode Scanner Emulation Engine](#36-qr--barcode-scanner-emulation-engine)
   - [3.7 Authentication & Route Protection](#37-authentication--route-protection)
4. [Backend Technical Architecture](#4-backend-technical-architecture)
   - [4.1 Node.js / Express Server Framework](#41-nodejs--express-server-framework)
   - [4.2 Enterprise RESTful API Contracts](#42-enterprise-restful-api-contracts)
   - [4.3 Relational Database Schema (PostgreSQL DDL)](#43-relational-database-schema-postgresql-ddl)
   - [4.4 Security, Authentication & Role-Based Access Control (RBAC)](#44-security-authentication--role-based-access-control-rbac)
5. [GitHub Hosting & Deployment Guide](#5-github-hosting--deployment-guide)
   - [5.1 Git Repository Initialization & Push](#51-git-repository-initialization--push)
   - [5.2 GitHub Pages Deployment via GitHub Actions (Automated CI/CD)](#52-github-pages-deployment-via-github-actions-automated-cicd)
   - [5.3 Production Docker Containerization (Dockerfile + Nginx)](#53-production-docker-containerization-dockerfile--nginx)
   - [5.4 Cloud Platform Deployments (Vercel, Render, AWS, Cloud Run)](#54-cloud-platform-deployments-vercel-render-aws-cloud-run)
   - [5.5 Environment Variables & Configuration](#55-environment-variables--configuration)

---

## 1. Executive Summary

In apparel manufacturing, line efficiency, labor productivity, and accurate Standard Minute Values (SMV) determine factory profitability and shipment on-time delivery (OTD). Traditional garment factories rely on paper time-study sheets, disconnected spreadsheets, and fragmented operator records, leading to:

1. **Unbalanced Sewing Lines:** Idle waiting times (starvation) and accumulation of Work-In-Progress (bottlenecks).
2. **Inaccurate Capacity Studies:** Human error in computing average piece cycle time, pace rating allowances, and actual operator efficiency.
3. **Severe Line Downtime Due to Absenteeism:** When key sewing operators fail to report, supervisors take 30–60 minutes identifying skilled substitutes for critical advance operations.
4. **Lack of Live Skill Matrices:** Management lacks real-time visibility into operator competencies across Basic, Intermediate, and Advance operations.

The **OptiSew Smart IE System** digitizes the entire Industrial Engineering lifecycle from **Mother Operation taxonomy**, **GSD Operation Master**, **Style-wise SMV summation**, **Workstation Grouping & Line Balancing**, **1,000-operator HRIS & 2,000-machine live allocation**, to **Piece-Counting Digital Stopwatch Capacity Studies**, **Excel/PDF exports**, and **Real-Time Skill Matrices**.

---

## 2. Business Domain & Industrial Engineering (IE) Methodology

### 2.1 The Operation Hierarchy (Mother Op vs. GSD Operation)
Garment manufacturing breaks apparel construction down into a two-tier hierarchy:

```
[Mother Operation (Macro Group)]
      │
      ├── Fixed Category: Basic | Intermediate | Advance
      │
      └── [GSD Operations (Micro Motions)]
            ├── Operation Code & Name
            ├── Standard Minute Value (SMV)
            └── Dedicated Machine Category (SNLS, DNLS, Overlock, etc.)
```

#### Category Classification Logic
* **Basic (Level 1):** Low manipulation complexity, straight seams, repetitive motions with high tolerance.
  * *Examples:* Shoulder join, Care label insert, Bottom single-fold hem, Thread trimming, Button attach.
  * *Operator Requirement:* Grade C or D can be deployed under supervision.
* **Intermediate (Level 2):** Curved seams, gathering, tension management, or synchronized feed.
  * *Examples:* Collar preparation, Sleeve armhole attach, Pocket flap creasing, 3-hole buttonhole programming.
  * *Operator Requirement:* Grade B or above.
* **Advance (Level 3):** Critical visible aesthetic seams, pattern matching, difficult material handling, or multi-needle synchronous operations.
  * *Examples:* Collar band insert & close, Front tailored placket attach, Back twin-needle pocket topstitch, J-stitch fly zipper, Kansai waistband attach.
  * *Operator Requirement:* Grade A certified operators only.

---

### 2.2 Style SMV Summation & Key Mathematical Formulas

#### Formula 1: Total Style SMV
$$\text{Total Style SMV} = \sum_{i=1}^{N} \text{SMV}_i$$
*Where $N$ is the number of sequential operations mapped to the style.*

#### Formula 2: Nominal Pcs Per Hour (at 100% Pacing)
$$\text{Hourly Output Rate (100\%)} = \frac{60}{\text{Operation SMV}}$$

#### Formula 3: Line Pitch Time (Takt Time per Workstation)
$$\text{Line Pitch Time (min)} = \frac{\text{Total Style SMV}}{\text{Total Workstations in Line}}$$

#### Formula 4: Theoretical Manpower (Operators Required)
$$\text{Recommended Manpower} = \left\lceil \frac{\text{Target Hourly Output (pcs)} \times \text{Total Style SMV}}{60} \right\rceil$$

#### Formula 5: Line Balancing Efficiency %
$$\text{Balancing Efficiency } (\%) = \left( \frac{\text{Total Style SMV}}{\text{Total Workstations} \times \text{Maximum Workstation SMV}} \right) \times 100\%$$
* *Target benchmark:* $\ge 85\%$ for balanced modular lines.
* *Bottleneck threshold:* Any workstation where $\text{WS SMV} > \text{Pitch Time} \times 1.15$.
* *Starvation threshold:* Any workstation where $\text{WS SMV} < \text{Pitch Time} \times 0.70$.

---

### 2.3 Stopwatch Capacity Study & Efficiency Calculation

The stopwatch capacity study follows the **Continuous Piece-Lap Counting Protocol**:
* **Start:** Industrial Engineer triggers the timer as the operator picks up fabric cut pieces.
* **Stop:** The engineer stops the timer when the operator releases the stitched component onto the bundle tray.
* **Piece Count Increment:** Each Start-Stop cycle logs one discrete completed piece ($\text{Pieces} \leftarrow \text{Pieces} + 1$).
* **Subsequent Piece:** Re-starting timing starts the cycle for Piece #2.

#### Formula 6: Average Observed Cycle Time
$$\text{Avg Observed Time (sec)} = \frac{\sum_{k=1}^{P} T_k}{P}$$
*Where $P$ is total pieces studied and $T_k$ is the cycle time in seconds for piece $k$.*

$$\text{Avg Observed Time (min)} = \frac{\text{Avg Observed Time (sec)}}{60}$$

#### Formula 7: Operator Live Efficiency %
$$\text{Efficiency } (\%) = \left( \frac{\text{Standard GSD SMV}}{\text{Avg Observed Time (min)}} \right) \times \left( \frac{\text{Pace Rating } \%}{100} \right) \times 100\%$$
* *Standard Pace Rating:* 100% (nominal speed). Adjustable between 80% and 120% by the IE based on operator motion ergonomics and effort rating.

---

### 2.4 Skill Matrix Grading Tiers

| Skill Grade | Efficiency % Slab | Classification | Factory Role & Deployment Policy |
| :--- | :--- | :--- | :--- |
| **Grade A** | **$\ge 90\%$** | Master / Star Operator | Deployed on Advance operations (Collar/Placket/Waistband). Acts as line trainer. |
| **Grade B** | **$75\% - 89\%$** | Skilled Operator | Deployed on Intermediate & high-speed assembly operations. Steady line backbone. |
| **Grade C** | **$60\% - 74\%$** | Developing Operator | Deployed on Basic operations. Paired with Grade A buddy for skill upgrades. |
| **Grade D** | **$< 60\%$** | Training Required | Sent to factory Training Center for retraining on folder guides and pedal speed. |

---

## 3. Frontend Technical Architecture

### 3.1 Technology Stack & Build Pipeline
* **Framework:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`)
* **Build Tooling:** Vite 8 (`vite: ^8.3.0`, `@vitejs/plugin-react: ^6.1.1`)
* **Language:** TypeScript 7.0 (`typescript: ^7.0.2`, strict types, zero `any` policy)
* **Styling:** Tailwind CSS 4.3 (`@tailwindcss/vite: ^4.3.3`, zero-pill discipline)
* **Typography:** 
  * Primary Interface Sans: `Plus Jakarta Sans`
  * Tabular Telemetry & Figures: `JetBrains Mono` (`font-mono tabular-nums`)
* **Iconography:** Lucide React (`lucide-react: ^0.546.0`)
* **Animation & Settling:** Motion 12 (`motion: ^12.23.24`, compositor-only transforms $\le 200\text{ms}$)

---

### 3.2 State Management & Context Architecture
The central nervous system of the client application is `IEContext` (`src/context/IEContext.tsx`), structured using the React Context API with custom action dispatchers:

```
┌────────────────────────────────────────────────────────┐
│                      IEContext                         │
├────────────────────────────────────────────────────────┤
│ • Authentication State (admin / 123 session)           │
│ • Mother Operations & GSD Catalogs                     │
│ • Style Master & Style Mapping Entities                │
│ • Line Layouts & Workstation Grouping Engine           │
│ • HRIS Cache (1,000 operators)                         │
│ • Machine Inventory Cache (2,000 machines)             │
│ • Skill Matrix Audit Ledger                            │
│ • Screen Router Dispatcher                             │
│ • Global Toast Dispatcher                              │
└────────────────────────────────────────────────────────┘
```

---

### 3.3 High-Scale Memory Optimization (1,000 Operators & 2,000 Machines)
In high-density production environments, searching or filtering 3,000 active records in real time during continuous 25ms stopwatch re-renders can cause frame drops if implemented naively.

**Optimizations Implemented:**
1. **$O(1)$ Hash Map Lookups (`useMemo`):**
   ```typescript
   const operatorMap = useMemo(() => {
     const map = new Map<string, Operator>();
     operators.forEach((op) => {
       map.set(op.employeeId, op);
       map.set(op.id, op);
     });
     return map;
   }, [operators]);
   ```
   *Result:* Resolving operator names, designations, and attendance by ID takes **$O(1)$ constant time** rather than $O(N)$ linear scans.
2. **Virtual Pagination:** The HRIS and Machine Inventory directory renders in fixed 20-row virtual slices, maintaining 60 FPS scrolling and instantaneous text search.
3. **Decoupled Stopwatch Loop:** The high-frequency timer state runs via `useRef` and `setInterval` without triggering re-renders in unmounted components.

---

### 3.4 Stopwatch Precision Timing Engine
The digital stopwatch implements millisecond accuracy through an optimized delta timestamp loop:

```typescript
// Prevents JS timer drift by tracking absolute system epoch deltas
useEffect(() => {
  if (timerRunning) {
    startTimeRef.current = Date.now() - elapsedMs;
    timerRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 25); // 40 ticks/second smooth display
  } else {
    if (timerRef.current) clearInterval(timerRef.current);
  }
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [timerRunning]);
```

Each **Start** initializes a lap anchor. Each **Stop** records the delta:
$$\Delta T = \frac{\text{elapsedMs} - \text{lapStartMs}}{1000}$$
and commits a `CycleLap` object, updating cumulative averages instantly.

---

### 3.5 Client-Side Excel and PDF Export Pipeline
1. **Excel / CSV Generation (`handleExportExcel`):**
   * Encodes hierarchical line balancing metadata (Header rows with Layout, Style, Buyer, Pitch Time, Efficiency %).
   * Appends tabular workstation data rows with escaped strings.
   * Serializes to `data:text/csv;charset=utf-8` and triggers programmatic browser download via DOM anchor injection without server roundtrips.
2. **PDF Export (`handleExportPDF`):**
   * Employs CSS `@media print` rules removing headers, interactive affordances, and sidebar frames.
   * Renders high-contrast black-and-white printable workstation balance sheets suitable for factory production floor display boards.

---

### 3.6 QR & Barcode Scanner Emulation Engine
The system simulates shop-floor 2D barcode and QR badge scanners:
* **Parser:** Automatically strips prefixes (e.g., `QR-OPR-1025` $\to$ `OPR-1025`).
* **Validation:** Queries the $O(1)$ indexed HRIS operator directory.
* **Attendance Intercept:** Flags whether the scanned operator is present today or absent.
* **Fast Testing:** Provides 1-click test badges for instant demonstration.

---

### 3.7 Authentication & Route Protection
* Default credentials: **`admin`** / **`123`**.
* The application mounts a root gate in `App.tsx`: if `isAuthenticated === false`, `<LoginScreen />` is displayed.
* Session tokens persist across browser reloads via `localStorage.getItem('optisew_auth_v2')`.
* A **Logout** trigger clears the token and returns the operator to the security portal.

---

## 4. Backend Technical Architecture

### 4.1 Node.js / Express Server Framework
For full-stack production deployments, the system runs an Express HTTP/2 microservice alongside Vite middleware in dev (`tsx server.ts`) or static dist in production.

```typescript
// server.ts architecture
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// REST API proxy & endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/hris', hrisRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/styles', stylesRouter);
app.use('/api/v1/layouts', layoutsRouter);
app.use('/api/v1/skill-matrix', skillMatrixRouter);
```

---

### 4.2 Enterprise RESTful API Contracts

#### 1. Authentication
* `POST /api/v1/auth/login`
  * **Payload:** `{ "username": "admin", "password": "123" }`
  * **Response:** `{ "token": "JWT_BEARER_TOKEN", "user": { "id": "USR-01", "role": "CHIEF_IE" } }`

#### 2. HRIS Operator Ingestion & Attendance
* `GET /api/v1/hris/operators?page=1&limit=20&grade=A&present=true`
* `PATCH /api/v1/hris/operators/:employeeId/attendance`
  * **Payload:** `{ "isPresent": true }`

#### 3. Machine Inventory & Telemetry
* `GET /api/v1/inventory/machines?category=SNLS&status=Operational`
* `PATCH /api/v1/inventory/machines/:machineId/status`
  * **Payload:** `{ "status": "In-Maintenance", "reason": "Motor calibration" }`

#### 4. Line Layout & Workstation Cloning
* `POST /api/v1/layouts/:layoutId/clone`
  * **Payload:** `{ "targetStyleId": "sty-2", "newLayoutName": "Line 02 - Cloned Layout" }`
  * **Response:** Returns duplicated layout with newly mapped workstation IDs.

#### 5. Skill Matrix Capacity Study Webhook
* `POST /api/v1/skill-matrix/study`
  * **Payload:**
    ```json
    {
      "operatorEmployeeId": "OPR-1004",
      "styleCode": "POLO-2026-CL",
      "operationName": "Attach Upper & Lower Placket",
      "operationCategory": "Advance",
      "gsdSmv": 0.65,
      "observedAvgCycleTimeSec": 42.5,
      "piecesStudied": 8,
      "efficiencyPercent": 91.8,
      "studyRatingPercent": 100
    }
    ```

---

### 4.3 Relational Database Schema (PostgreSQL DDL)

```sql
-- 1. Mother Operations Master
CREATE TABLE mother_operations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(32) CHECK (category IN ('Basic', 'Intermediate', 'Advance')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GSD Operations Master
CREATE TABLE gsd_operations (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    mother_operation_id VARCHAR(64) REFERENCES mother_operations(id) ON DELETE RESTRICT,
    smv NUMERIC(6, 3) NOT NULL CHECK (smv > 0),
    machine_category VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Style Master
CREATE TABLE styles (
    id VARCHAR(64) PRIMARY KEY,
    style_code VARCHAR(64) UNIQUE NOT NULL,
    style_name VARCHAR(255) NOT NULL,
    customer VARCHAR(128) NOT NULL,
    garment_type VARCHAR(64),
    season VARCHAR(32),
    order_qty INTEGER DEFAULT 0,
    target_hourly_output INTEGER DEFAULT 100,
    total_smv NUMERIC(8, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Style GSD Mapping Sequence
CREATE TABLE style_gsd_mappings (
    id VARCHAR(64) PRIMARY KEY,
    style_id VARCHAR(64) REFERENCES styles(id) ON DELETE CASCADE,
    operation_id VARCHAR(64) REFERENCES gsd_operations(id) ON DELETE RESTRICT,
    sequence_number INTEGER NOT NULL,
    CONSTRAINT unique_style_seq UNIQUE (style_id, sequence_number)
);

-- 5. HRIS Operators
CREATE TABLE hris_operators (
    id VARCHAR(64) PRIMARY KEY,
    employee_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    designation VARCHAR(64) NOT NULL,
    department VARCHAR(64) NOT NULL,
    skill_grade VARCHAR(4) CHECK (skill_grade IN ('A', 'B', 'C', 'D')),
    is_present BOOLEAN DEFAULT TRUE,
    efficiency_avg NUMERIC(5, 2) DEFAULT 75.0,
    qr_code VARCHAR(128) UNIQUE NOT NULL,
    joined_date DATE NOT NULL
);

-- 6. Machine Inventory
CREATE TABLE machine_inventory (
    id VARCHAR(64) PRIMARY KEY,
    machine_id VARCHAR(32) UNIQUE NOT NULL,
    brand VARCHAR(64) NOT NULL,
    model VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    status VARCHAR(32) CHECK (status IN ('Operational', 'Idle', 'In-Maintenance', 'Calibration Due')),
    floor_line VARCHAR(64),
    serial_number VARCHAR(128) UNIQUE NOT NULL,
    purchase_year INTEGER
);

-- 7. Line Layouts
CREATE TABLE line_layouts (
    id VARCHAR(64) PRIMARY KEY,
    layout_name VARCHAR(255) NOT NULL,
    style_id VARCHAR(64) REFERENCES styles(id) ON DELETE CASCADE,
    line_name VARCHAR(64) NOT NULL,
    total_smv NUMERIC(8, 2) NOT NULL,
    pitch_time NUMERIC(6, 2) NOT NULL,
    balancing_efficiency NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Workstations (Supports grouping 1 to N operations)
CREATE TABLE workstations (
    id VARCHAR(64) PRIMARY KEY,
    layout_id VARCHAR(64) REFERENCES line_layouts(id) ON DELETE CASCADE,
    workstation_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_smv NUMERIC(6, 2) NOT NULL
);

CREATE TABLE workstation_operations (
    workstation_id VARCHAR(64) REFERENCES workstations(id) ON DELETE CASCADE,
    operation_id VARCHAR(64) REFERENCES gsd_operations(id) ON DELETE RESTRICT,
    PRIMARY KEY (workstation_id, operation_id)
);

CREATE TABLE workstation_operators (
    workstation_id VARCHAR(64) REFERENCES workstations(id) ON DELETE CASCADE,
    operator_id VARCHAR(64) REFERENCES hris_operators(id) ON DELETE RESTRICT,
    PRIMARY KEY (workstation_id, operator_id)
);

CREATE TABLE workstation_machines (
    workstation_id VARCHAR(64) REFERENCES workstations(id) ON DELETE CASCADE,
    machine_id VARCHAR(64) REFERENCES machine_inventory(id) ON DELETE RESTRICT,
    PRIMARY KEY (workstation_id, machine_id)
);

-- 9. Skill Matrix Capacity Studies Ledger
CREATE TABLE skill_matrix_records (
    id VARCHAR(64) PRIMARY KEY,
    capacity_taken_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    operator_id VARCHAR(64) REFERENCES hris_operators(id) ON DELETE RESTRICT,
    style_id VARCHAR(64) REFERENCES styles(id) ON DELETE RESTRICT,
    operation_name VARCHAR(255) NOT NULL,
    operation_category VARCHAR(32) NOT NULL,
    gsd_smv NUMERIC(6, 3) NOT NULL,
    observed_avg_time_sec NUMERIC(8, 2) NOT NULL,
    pieces_studied INTEGER NOT NULL,
    efficiency_percent NUMERIC(6, 2) NOT NULL,
    study_rating_percent INTEGER DEFAULT 100
);

-- Indexes for high-frequency queries
CREATE INDEX idx_operators_emp_id ON hris_operators(employee_id);
CREATE INDEX idx_machines_mach_id ON machine_inventory(machine_id);
CREATE INDEX idx_skill_records_date ON skill_matrix_records(capacity_taken_date DESC);
```

---

### 4.4 Security, Authentication & Role-Based Access Control (RBAC)
* **Authentication Scheme:** JWT (JSON Web Tokens) with 8-hour expiry.
* **Roles:**
  * `ADMIN` (Chief Industrial Engineer): Full configuration of GSD standards, line layout cloning, and system reset.
  * `WORK_STUDY_OFFICER`: Executes stopwatch capacity studies and commits skill matrix records.
  * `LINE_SUPERVISOR`: Performs operator and machine quick-swaps for daily floor absenteeism.
  * `MANAGEMENT_AUDITOR`: Read-only access to dashboard analytics, capacity gap reports, and CSV exports.

---

## 5. GitHub Hosting & Deployment Guide

This section provides a complete, step-by-step guide to hosting and deploying the OptiSew Smart IE System on GitHub and connecting it to automated CI/CD hosting platforms.

---

### 5.1 Git Repository Initialization & Push

Follow these commands to push the codebase from your local terminal to your GitHub repository:

```bash
# 1. Navigate to the project root directory
cd optisew-smart-ie

# 2. Initialize a git repository (if not already done)
git init

# 3. Add all files to staging
git add .

# 4. Commit the codebase
git commit -m "feat: complete OptiSew Smart IE system with login, style separation, and excel/pdf exports"

# 5. Rename primary branch to main
git branch -M main

# 6. Link to your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/<your-username>/optisew-smart-ie.git

# 7. Push to GitHub
git push -u origin main
```

---

### 5.2 GitHub Pages Deployment via GitHub Actions (Automated CI/CD)

Deploy the application as a zero-cost, high-speed static web app directly on **GitHub Pages**.

#### Step 1: Create the GitHub Actions Workflow File
Create a new file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

env:
  # Opts into Node.js 24 and clears Node 20 deprecation notices on GitHub runners
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm install --legacy-peer-deps --no-audit --no-fund

      - name: Build Production Bundle
        run: npm run build

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Build Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Step 2: Configure Vite Base Path (if deploying to a repository subpath)
If hosting on `https://<username>.github.io/<repo-name>/`, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/optisew-smart-ie/', // Replace with your repository name
  // ... rest of plugins and configuration
});
```

#### Step 3: Enable Pages in GitHub Repository Settings
1. Go to your repository on GitHub: `https://github.com/<username>/optisew-smart-ie`.
2. Click **Settings** $\to$ **Pages** (in the left sidebar).
3. Under **Build and deployment** $\to$ **Source**, select **GitHub Actions**.
4. Push a new commit to `main`. GitHub Actions will automatically compile and publish your site!

---

### 5.3 Production Docker Containerization (Dockerfile + Nginx)

For enterprise factory private clouds, Kubernetes clusters, or VPS instances:

#### `Dockerfile`
```dockerfile
# Stage 1: Build the React client
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve via high-performance Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### `nginx.conf`
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

#### Build and Run Docker Container
```bash
# Build the Docker image
docker build -t optisew-smart-ie:2.4.0 .

# Run container on port 8080
docker run -d -p 8080:80 --name optisew-app optisew-smart-ie:2.4.0
```

---

### 5.4 Cloud Platform Deployments (Vercel, Render, AWS, Cloud Run)

#### Deploying on Vercel
1. Install Vercel CLI: `npm i -g vercel`.
2. Run `vercel login`.
3. Inside the project folder, run:
   ```bash
   vercel --prod
   ```
4. Build Command: `npm run build`
5. Output Directory: `dist`

#### Deploying on Render / Railway
1. Connect your GitHub repository.
2. Select **Static Site** (or **Web Service** for full-stack Node server).
3. Set Build Command: `npm install && npm run build`.
4. Set Publish Directory: `dist`.

---

### 5.5 Environment Variables & Configuration

Create a `.env` file in the root directory:

```env
# Application Port
PORT=3000

# Base URL (for API calls and webhooks)
VITE_API_BASE_URL="https://api.yourfactorymes.com"

# Default Demo Credentials (for factory kiosks)
VITE_DEFAULT_ADMIN_USER="admin"
VITE_DEFAULT_ADMIN_PASS="123"

# Database Configuration (for backend production)
DATABASE_URL="postgresql://ie_admin:SecurePass2026@localhost:5432/optisew_mes_db"
```

---

*OptiSew Smart IE System — Engineering Excellence for Apparel Manufacturing.*
