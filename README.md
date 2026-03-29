# Pearson Specter Litt — Command Center
> High-Density Forensic Workflow Engine for Foreclosure Law.

The **Command Center** is a professional-grade, role-aware dashboard designed to handle the high velocity of forensic milestones in foreclosure litigation. It transforms raw legal schemas into a prioritized, actionable workspace—optimized for attorneys and processors to manage critical jurisdictional deadlines with surgical precision.

---

## 🏛 Visual Depth & Hierarchy

This application implements a **3-Layer Command Architecture** designed for maximum operational throughput:

1.  **The Control Plane (Workspace Control)**: A light-density, persistent sidebar with **Live Smart Metadata Counts**. It provides immediate insight into the current global workload without manual exploration.
2.  **The Nexus (Marketplace Pipeline)**: A high-density task queue built for rapid scannability. It utilizes visual elevation and high-contrast "Urgency Anchors" (SLA status dots) to surface the records with the highest risk exposure.
3.  **The Studio (Action View)**: A 100% schema-driven workflow environment. It implements **Collapsible Jurisdictional Modules** and sophisticated **Role-Based Security** (RBAC) to ensure only authorized actors interact with sensitive legal data points.

---

## 🛠 Tech Stack & Forensic Design

Built on a modern, high-performance architecture:

-   **Frontend**: Next.js 14 (App Router) + TypeScript
-   **Styling**: Tailwind CSS (Sophisticated Custom Design System)
-   **State Management**: Zustand (Global Dashboard Context) + React Hook Form (Local Form Performance)
-   **Validation**: Schema-Driven Logic + Boolean Rule Engine
-   **Testing**: Vitest + React Testing Library (28+ Tests Covering Critical Paths)

---

## 📂 Project Architecture

```bash
src/
├── app/                  # Next.js Route Handlers & Dashboard Layout
│   ├── api/              # Role-aware Mock Endpoints (User, Tasks, Schemas)
│   └── dashboard/        # Main Application Lifecycle Boundary
├── components/
│   ├── command-center/   # High-level UI Components (Queue, Detail, Sidebar)
│   ├── schema-renderer/  # The Core Dynamic Engine (Field Mapping & Table Logic)
│   └── ui/               # Atom-level Design components
├── hooks/                # global state & dashboard synchronization
├── lib/
│   ├── data/             # Forensic JSON Data & Schemas
│   ├── __tests__/        # Rigorous Business Logic Testing suite
│   └── field-visibility.ts # Conditional Visibility Boolean logic
└── types/                # Domain-specific Legal & Schema Interface definitions
```

---

## 🚀 Execution Protocol

### 1. Installation
Install project dependencies via `npm` or `pnpm`:
```bash
npm install
```

### 2. Development Environment
Initialize the local foreclosure workstation:
```bash
npm run dev
```

### 3. Verification Suite
Execute the full test suite (28 Forensic & Integration Tests):
```bash
npm run test
```

---

## 🔐 Role-Based Access Controls (RBAC)
The interface is fully responsive to user roles fetched from `/api/user`. Use the **Role Switcher** in the header to transition between:
-   **Processor**: Focused on administrative data entry; sensitive attorney-level reviews are automatically hidden and blocked.
-   **Attorney**: Full verification access across the entire milestone lifecycle.

---

## 🎯 Design Philosophy
> *The assignment is intentionally scoped - we're not looking for a fully polished product, but we do care deeply about how you lay the foundation. Strong candidates typically shine in schema-driven rendering, clean component architecture, and TypeScript precision. We'll be evaluating whether your core abstractions could grow into a production system, not just whether the demo works.*

This project was built with a "Production-First" mindset, prioritizing extensible abstractions and type-safe data pipelines that can scale to 50+ jurisdictional milestone types.

## 📑 Core Forensic Features
-   **Schema-at-Runtime**: Zero code changes required for new milestone types.
-   **Conditional Visibility**: Fields react instantly using `visibleWhen` logic (Booleans & String equalities).
-   **Forensic Payload Assembly**: Action submissions generate a complete JSON footprint with user/timestamp/task metadata for legal audit trails.

