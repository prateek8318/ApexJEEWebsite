# Product Requirements Document (PRD)

## Consent Management Platform (CMP)

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| **Version**      | 1.0                                        |
| **Date**         | 2026-03-13                                 |
| **Status**       | Draft                                      |
| **Platform**     | Web (Next.js 16 / React 19)               |
| **Regulation**   | Digital Personal Data Protection Act (DPDP) |

---

## 1. Project Overview & Goals

### 1.1 Overview

The Consent Management Platform (CMP) is a regulatory-compliant web application that manages the complete lifecycle of user consents under India's Digital Personal Data Protection (DPDP) Act. It enables organizations — acting as Data Fiduciaries — to collect, store, manage, and audit consent from Data Principals in a transparent, secure, and legally compliant manner.

### 1.2 Goals

| # | Goal                                                                                       |
| - | ------------------------------------------------------------------------------------------ |
| 1 | Provide a centralized platform for creating, managing, and auditing consent templates       |
| 2 | Ensure full compliance with the DPDP Act's consent requirements                            |
| 3 | Enable organizations to embed consent collection into their websites/apps via code snippets |
| 4 | Offer a developer-friendly API layer with key management, webhooks, and metrics             |
| 5 | Deliver real-time analytics on consent collection, revocation, and expiry trends            |
| 6 | Support multi-language consent experiences for diverse user bases                           |
| 7 | Maintain a complete audit trail for regulatory inspection and compliance reporting           |

---

## 2. User Personas & Target Audience

### Persona 1: Compliance / Privacy Officer (Primary)

| Attribute       | Detail                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| **Role**        | Data Protection Officer (DPO) or Compliance Lead                       |
| **Goals**       | Ensure the organization's consent practices meet DPDP Act requirements |
| **Key Actions** | Create consent templates, define processing purposes, review audit logs, monitor compliance scores |
| **Pain Points** | Manual consent tracking, lack of audit trails, regulatory ambiguity    |

### Persona 2: Product / Engineering Developer

| Attribute       | Detail                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Role**        | Frontend/Backend developer integrating consent collection into apps                        |
| **Goals**       | Quickly embed consent forms, manage API keys, monitor integration health                   |
| **Key Actions** | Copy code snippets, create/rotate API keys, configure webhooks, track API metrics          |
| **Pain Points** | Complex integration docs, unreliable webhooks, no visibility into API errors               |

### Persona 3: Business / Marketing Manager

| Attribute       | Detail                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Role**        | Department head or marketing lead who needs consent for data-driven campaigns                 |
| **Goals**       | Collect opt-in consent for marketing, personalization, and analytics                          |
| **Key Actions** | Request new consent templates, review consent form branding, check consent collection metrics  |
| **Pain Points** | Slow turnaround for new consent forms, inconsistent branding, unclear opt-in rates            |

### Persona 4: Data Principal (End-User)

| Attribute       | Detail                                                                          |
| --------------- | ------------------------------------------------------------------------------- |
| **Role**        | Individual whose personal data is being processed                               |
| **Goals**       | Understand what data is collected, grant/revoke consent easily                   |
| **Key Actions** | View consent form, toggle preferences in preference center, revoke consent       |
| **Pain Points** | Opaque privacy notices, no easy way to manage or withdraw consent                |

---

## 3. Full Feature List with Acceptance Criteria

### 3.1 Authentication & Authorization

#### F-AUTH-01: User Registration

| Field               | Detail                                                         |
| ------------------- | -------------------------------------------------------------- |
| **Description**     | New users can register with organization details               |
| **Acceptance Criteria** |                                                            |
| | AC1: User can register with name, email, password, and organization info |
| | AC2: Form validates all fields using Zod schema before submission |
| | AC3: Duplicate email returns a clear error message |
| | AC4: Successful registration redirects to verification page |

#### F-AUTH-02: User Login

| Field               | Detail                                                                  |
| ------------------- | ----------------------------------------------------------------------- |
| **Description**     | Registered users can log in with credentials                            |
| **Acceptance Criteria** |                                                                     |
| | AC1: User can log in with email and password |
| | AC2: Successful login stores JWT (AUTH_TOKEN + REFRESH_TOKEN) in HTTP-only cookies |
| | AC3: User is redirected to the dashboard after login |
| | AC4: Invalid credentials show an inline error message |

#### F-AUTH-03: Password Recovery

| Field               | Detail                                                  |
| ------------------- | ------------------------------------------------------- |
| **Description**     | Users can reset their password via email verification   |
| **Acceptance Criteria** |                                                      |
| | AC1: User can request a password reset link via email |
| | AC2: Reset link leads to a secure reset-password page |
| | AC3: New password must meet minimum strength requirements |
| | AC4: Successful reset redirects to login with a success toast |

#### F-AUTH-04: Session Management

| Field               | Detail                                                              |
| ------------------- | ------------------------------------------------------------------- |
| **Description**     | Tokens refresh automatically; expired sessions redirect to login    |
| **Acceptance Criteria** |                                                                  |
| | AC1: AUTH_TOKEN is silently refreshed using the REFRESH_TOKEN before expiry |
| | AC2: If both tokens expire, user is redirected to `/auth/login` |
| | AC3: Session state (Zustand) is persisted in localStorage across page reloads |
| | AC4: 401 API responses trigger automatic redirect to login |

#### F-AUTH-05: Role-Based Access Control (RBAC)

| Field               | Detail                                                         |
| ------------------- | -------------------------------------------------------------- |
| **Description**     | Menu items and routes are gated by user role                   |
| **Acceptance Criteria** |                                                              |
| | AC1: Sidebar menu renders only items the user's role has access to |
| | AC2: Supported roles: ROLE_SUPER_ADMIN, ROLE_GUARDIAN, ROLE_LEARNER, ROLE_EMPLOYEE |
| | AC3: Unauthorized route access renders the `/errors/unauthorized` page |
| | AC4: Role data is derived from the JWT on the server side |

---

### 3.2 Consent Template Management

#### F-TPL-01: Multi-Step Template Wizard

| Field               | Detail                                                                           |
| ------------------- | -------------------------------------------------------------------------------- |
| **Description**     | An 8-step wizard guides users through creating a complete consent template        |
| **Acceptance Criteria** |                                                                               |
| | AC1: Wizard displays a stepper indicating current step and completion status |
| | AC2: Users can navigate forward/backward between completed steps |
| | AC3: Each step validates its form before allowing progression |
| | AC4: Wizard state is preserved during navigation between steps |

#### F-TPL-02: Basic Information (Step 1)

| Field               | Detail                                                                   |
| ------------------- | ------------------------------------------------------------------------ |
| **Description**     | Capture template metadata: name, version, status, legal entity, DPO, etc. |
| **Acceptance Criteria** |                                                                       |
| | AC1: All required fields (template name, version, status, legal entity, DPO, contact email) are validated |
| | AC2: Status options include Draft, Active, Archived |
| | AC3: Version field accepts semantic versioning format |
| | AC4: Department, business unit, vendor/processor, and owner are optional but available |

#### F-TPL-03: Processing Purposes (Step 2)

| Field               | Detail                                                                |
| ------------------- | --------------------------------------------------------------------- |
| **Description**     | Define what data processing purposes the consent covers               |
| **Acceptance Criteria** |                                                                    |
| | AC1: Users can add, edit, and delete processing purposes in a table |
| | AC2: Each purpose has a name, description, linked activities, and expiry period |
| | AC3: Add/edit opens a dialog form with validation |
| | AC4: At least one processing purpose is required to proceed |

#### F-TPL-04: Privacy Notice (Step 3)

| Field               | Detail                                                              |
| ------------------- | ------------------------------------------------------------------- |
| **Description**     | Author a rich-text privacy notice for the consent template          |
| **Acceptance Criteria** |                                                                  |
| | AC1: Rich text editor (TipTap) supports bold, italic, underline, lists, links, headings |
| | AC2: Content is saved as HTML and rendered correctly in preview |
| | AC3: Privacy notice content is required before proceeding |

#### F-TPL-05: Consent Form Designer (Step 4)

| Field               | Detail                                                                            |
| ------------------- | --------------------------------------------------------------------------------- |
| **Description**     | Design the consent collection form with branding and real-time preview            |
| **Acceptance Criteria** |                                                                                |
| | AC1: Users can upload a logo and configure header text, body text, footer text |
| | AC2: CTA button color is customizable via color picker |
| | AC3: Device preview toggles between Pop-up, Web, and Mobile layouts |
| | AC4: Live preview updates in real-time as settings change |
| | AC5: Processing purposes are displayed within the consent form preview |

#### F-TPL-06: Preference Center Designer (Step 5)

| Field               | Detail                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| **Description**     | Configure the end-user preference center for managing consent granularly      |
| **Acceptance Criteria** |                                                                           |
| | AC1: Users can configure logo, header, titles, and button labels |
| | AC2: Purpose toggles are displayed for each processing purpose defined in Step 2 |
| | AC3: Device preview toggles between Pop-up, Web, and Mobile |
| | AC4: Live preview reflects configuration changes in real-time |

#### F-TPL-07: Language & Translation (Step 6)

| Field               | Detail                                                       |
| ------------------- | ------------------------------------------------------------ |
| **Description**     | Configure multi-language support for the consent template    |
| **Acceptance Criteria** |                                                            |
| | AC1: Users can select a primary language |
| | AC2: Users can add one or more secondary languages |
| | AC3: Translation categories include Treatment, Marketing, Support |
| | AC4: Language settings are saved per template |

#### F-TPL-08: Code Snippets (Step 7)

| Field               | Detail                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| **Description**     | Generate embeddable JavaScript code for website integration                   |
| **Acceptance Criteria** |                                                                            |
| | AC1: A JavaScript snippet is auto-generated based on template configuration |
| | AC2: User can copy the snippet to clipboard with one click |
| | AC3: Snippet includes the template ID and necessary initialization code |

#### F-TPL-09: Review & Submit (Step 8)

| Field               | Detail                                                              |
| ------------------- | ------------------------------------------------------------------- |
| **Description**     | Final review of all template settings before publishing              |
| **Acceptance Criteria** |                                                                   |
| | AC1: All settings from steps 1-7 are displayed in a read-only summary |
| | AC2: Users can navigate back to any step to make changes |
| | AC3: Submit button publishes the template and shows a success notification |
| | AC4: Review displays branding settings, notice type, theme, animation, and languages |

---

### 3.3 Consent Records Management

#### F-REC-01: Consent Records Table

| Field               | Detail                                                                  |
| ------------------- | ----------------------------------------------------------------------- |
| **Description**     | View and manage all collected consent records                           |
| **Acceptance Criteria** |                                                                      |
| | AC1: Table displays consent ID, purpose, notice link, platform, status, and date |
| | AC2: Status values: ACTIVE, REVOKED, EXPIRED — each with distinct visual badge |
| | AC3: Table supports search by consent ID or purpose |
| | AC4: Table supports filtering by status and date range |
| | AC5: Table supports sorting by any column |
| | AC6: Pagination is available for large datasets |

#### F-REC-02: Consent Lifecycle Actions

| Field               | Detail                                                      |
| ------------------- | ----------------------------------------------------------- |
| **Description**     | Manage individual consent records (revoke, extend, etc.)    |
| **Acceptance Criteria** |                                                           |
| | AC1: Authorized users can revoke an active consent |
| | AC2: Revocation updates the record status to REVOKED with a timestamp |
| | AC3: All lifecycle actions are logged in the audit trail |

---

### 3.4 Processing Inventory

#### F-INV-01: Processing Categories

| Field               | Detail                                                            |
| ------------------- | ----------------------------------------------------------------- |
| **Description**     | Define and manage high-level data processing categories           |
| **Acceptance Criteria** |                                                                |
| | AC1: Users can create, edit, and delete processing categories |
| | AC2: Each category has a name, description, and associated activities |
| | AC3: Categories are displayed in a searchable, sortable table |

#### F-INV-02: Processing Activities

| Field               | Detail                                                            |
| ------------------- | ----------------------------------------------------------------- |
| **Description**     | Define specific data processing activities                        |
| **Acceptance Criteria** |                                                                |
| | AC1: Users can create, edit, and delete processing activities |
| | AC2: Each activity has a name, description, and linked categories |
| | AC3: Activities are referenced by processing purposes |

#### F-INV-03: Processing Purposes

| Field               | Detail                                                         |
| ------------------- | -------------------------------------------------------------- |
| **Description**     | Define legal purposes for data processing with expiry periods  |
| **Acceptance Criteria** |                                                              |
| | AC1: Users can create, edit, and delete processing purposes |
| | AC2: Each purpose has a name, description, linked activities, and expiry period |
| | AC3: Purposes are reusable across multiple consent templates |

---

### 3.5 Dashboard & Analytics

#### F-DASH-01: Overview Dashboard

| Field               | Detail                                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| **Description**     | Organization-wide consent analytics and health overview                    |
| **Acceptance Criteria** |                                                                         |
| | AC1: Stat cards display key metrics (total consents, active, revoked, expired) |
| | AC2: Consent Trends line chart shows collection volume over time |
| | AC3: Consent by Channel chart shows distribution across collection channels |
| | AC4: Alert list shows compliance warnings with severity indicators |
| | AC5: Compliance Score is displayed as a visual metric |
| | AC6: Recent Activity table shows the latest consent events |
| | AC7: Dashboard data refreshes on page load |

---

### 3.6 Developer Tools

#### F-DEV-01: Developer Dashboard (Overview Tab)

| Field               | Detail                                                                           |
| ------------------- | -------------------------------------------------------------------------------- |
| **Description**     | API health metrics and integration monitoring                                     |
| **Acceptance Criteria** |                                                                               |
| | AC1: Stat cards show API Calls, Error Rate, Success Rate, Avg Response Time |
| | AC2: API Request chart shows time-series request volume |
| | AC3: API Error Distribution chart shows error breakdown |
| | AC4: Integration Status panel shows live status of API endpoints |
| | AC5: Webhooks list, recent events, and error logs are visible |

#### F-DEV-02: API Key Management

| Field               | Detail                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **Description**     | Create, view, rotate, and delete API keys                          |
| **Acceptance Criteria** |                                                                 |
| | AC1: Users can generate new API keys with a name and scope |
| | AC2: API keys are shown in a table with name, key (masked), created date, expiry, and status |
| | AC3: Users can rotate a key (generates a new key, invalidates the old one) |
| | AC4: Users can delete/revoke a key |
| | AC5: Full key value is shown only once at creation time |

#### F-DEV-03: Webhook Management

| Field               | Detail                                                                   |
| ------------------- | ------------------------------------------------------------------------ |
| **Description**     | Configure webhook endpoints for consent event notifications              |
| **Acceptance Criteria** |                                                                       |
| | AC1: Users can add webhook URLs with event subscriptions |
| | AC2: Supported events include consent granted, revoked, expired |
| | AC3: Delivery history shows success/failure status per event |
| | AC4: Users can trigger a test webhook |
| | AC5: Failed deliveries are retried automatically |

---

### 3.7 Audit & Compliance

#### F-AUD-01: Audit Logs

| Field               | Detail                                                              |
| ------------------- | ------------------------------------------------------------------- |
| **Description**     | Immutable log of all consent-related actions for regulatory review   |
| **Acceptance Criteria** |                                                                   |
| | AC1: Every consent creation, update, revocation, and expiry is logged |
| | AC2: Logs include timestamp, actor, action type, and affected resource |
| | AC3: Logs are searchable and filterable by date range and action type |
| | AC4: Logs cannot be modified or deleted by any user |

---

### 3.8 Settings

#### F-SET-01: Application Settings

| Field               | Detail                                               |
| ------------------- | ---------------------------------------------------- |
| **Description**     | Configure platform-level settings                    |
| **Acceptance Criteria** |                                                    |
| | AC1: Organization profile settings (name, logo, contact) are editable |
| | AC2: Notification preferences can be configured |
| | AC3: Settings changes require appropriate role permissions |

---

### 3.9 UI / UX Requirements

#### F-UX-01: Responsive Design

| Field               | Detail                                                      |
| ------------------- | ----------------------------------------------------------- |
| **Acceptance Criteria** |                                                           |
| | AC1: All pages render correctly on desktop (1280px+), tablet (768px–1279px), and mobile (< 768px) |
| | AC2: Sidebar collapses to a hamburger menu on smaller screens |
| | AC3: Data tables switch to a card layout on mobile |

#### F-UX-02: Notifications & Feedback

| Field               | Detail                                                        |
| ------------------- | ------------------------------------------------------------- |
| **Acceptance Criteria** |                                                             |
| | AC1: Success, error, and warning actions trigger toast notifications (Sonner) |
| | AC2: Form validation errors display inline below each field |
| | AC3: Loading states show skeleton/spinner UI |

---

## 4. Out-of-Scope Items

The following items are explicitly **NOT** included in the current version:

| #  | Item                                                                                   | Rationale                                          |
| -- | -------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1  | **Mobile native app** (iOS/Android)                                                    | Web-first approach; mobile responsive is sufficient |
| 2  | **Consent collection backend/APIs**                                                    | Handled by a separate backend service               |
| 3  | **Data Subject Access Request (DSAR) management**                                      | Planned for a future phase                          |
| 4  | **Cookie banner / cookie consent management**                                          | Separate from DPDP consent; may be a future module  |
| 5  | **Multi-tenancy / white-labeling for SaaS deployment**                                 | Single-tenant deployment for now                    |
| 6  | **Automated DPDP compliance scoring engine**                                           | Compliance score is currently manual/display-only   |
| 7  | **Integration with third-party CMPs** (OneTrust, Cookiebot, etc.)                      | Not planned                                         |
| 8  | **Email/SMS notification delivery system**                                             | Backend responsibility                              |
| 9  | **Offline consent collection**                                                         | Not supported in web platform                       |
| 10 | **Data breach notification workflows**                                                 | Separate compliance module planned for future       |
| 11 | **End-user (Data Principal) self-service portal**                                      | Preference center is embedded; no standalone portal |
| 12 | **Consent analytics export to BI tools** (Tableau, Power BI, etc.)                     | Future enhancement                                  |

---

## 5. Technical Constraints & Assumptions

### 5.1 Technical Constraints

| #  | Constraint                                                                                  |
| -- | ------------------------------------------------------------------------------------------- |
| 1  | **Frontend only** — this repository is the frontend SPA; all data persistence and business logic reside in a separate backend service |
| 2  | **Browser support** — must support latest 2 versions of Chrome, Edge, Firefox, and Safari   |
| 3  | **Authentication** — JWT-based with HTTP-only cookies; no support for OAuth/SAML/SSO in v1  |
| 4  | **API dependency** — all data operations depend on `NEXT_PUBLIC_API_URL` backend availability |
| 5  | **No server-side rendering of consent forms** — consent forms are client-rendered via embedded JS snippets |
| 6  | **File uploads** — logo/image uploads are validated by schema (type, size) on the frontend  |
| 7  | **Single language per session** — the admin UI is English-only; multi-language applies only to consent templates served to end-users |

### 5.2 Assumptions

| #  | Assumption                                                                                  |
| -- | ------------------------------------------------------------------------------------------- |
| 1  | The backend API conforms to the endpoint contracts expected by the Axios client and React Query hooks |
| 2  | JWT tokens issued by the backend contain user UUID, name, email, organization, and roles    |
| 3  | The backend handles consent data storage, encryption at rest, and DPDP-compliant data retention |
| 4  | Webhook delivery, retry logic, and dead-letter handling are managed by the backend           |
| 5  | The backend enforces RBAC at the API level; frontend RBAC is for UX convenience only         |
| 6  | Processing inventory (categories, activities, purposes) is pre-populated or managed by admins before template creation |
| 7  | The organization has a designated DPO as required by the DPDP Act                            |
| 8  | Users have stable internet connectivity; no offline-first requirements                       |

---

## 6. Success Metrics

| #  | Metric                              | Target                          | Measurement Method                              |
| -- | ----------------------------------- | ------------------------------- | ----------------------------------------------- |
| 1  | **Template creation time**          | < 15 minutes end-to-end         | Time from wizard start to submit                |
| 2  | **Consent form load time**          | < 2 seconds (embedded snippet)  | Lighthouse / Web Vitals                         |
| 3  | **Dashboard page load**             | < 3 seconds (First Contentful Paint) | Lighthouse / Web Vitals                    |
| 4  | **API key generation success rate** | 99.9%                           | Developer tools error rate metric               |
| 5  | **Webhook delivery success rate**   | > 99% within 30 seconds         | Webhook delivery history logs                   |
| 6  | **Consent collection opt-in rate**  | Baseline + 10% improvement      | Consent records analytics                       |
| 7  | **Audit log completeness**          | 100% of consent actions logged  | Audit log vs consent record reconciliation      |
| 8  | **User adoption**                   | 80% of org users active within 30 days of onboarding | Login frequency analytics       |
| 9  | **Compliance score**                | > 90% across all active templates | Dashboard compliance metric                   |
| 10 | **Zero critical accessibility issues** | WCAG 2.1 AA compliance       | Automated a11y testing (axe-core)               |

---

## Appendix A: Tech Stack Summary

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| Framework          | Next.js 16.1 (App Router, Turbopack)            |
| Language           | TypeScript 5.9                                  |
| UI Library         | React 19.2                                      |
| Component Library  | Shadcn/ui (Radix UI primitives)                 |
| State Management   | Zustand 5.0 (client), TanStack React Query 5.90 (server) |
| Forms              | React Hook Form + Zod                           |
| Rich Text Editor   | TipTap                                          |
| Tables             | TanStack React Table 8.21                       |
| Charts             | Recharts 2.15                                   |
| HTTP Client        | Axios                                           |
| Styling            | Tailwind CSS 4.1                                |
| Notifications      | Sonner                                          |
| Icons              | Lucide React, Simple Icons                      |
| Font               | Poppins (Google Fonts)                          |

---

## Appendix B: Route Map

| Route                                      | Module               | Auth Required |
| ------------------------------------------ | -------------------- | ------------- |
| `/auth/login`                              | Authentication       | No            |
| `/auth/register`                           | Authentication       | No            |
| `/auth/forgot-password`                    | Authentication       | No            |
| `/auth/reset-password`                     | Authentication       | No            |
| `/auth/verify`                             | Authentication       | No            |
| `/dashboard`                               | Dashboard            | Yes           |
| `/consent-records`                         | Consent Records      | Yes           |
| `/consent-template`                        | Consent Templates    | Yes           |
| `/processing-inventory/processing-category`| Processing Inventory | Yes           |
| `/processing-inventory/processing-activities`| Processing Inventory | Yes         |
| `/processing-inventory/processing-purpose` | Processing Inventory | Yes           |
| `/developers`                              | Developer Tools      | Yes           |
| `/settings`                                | Settings             | Yes           |
| `/audit-compliance`                        | Audit & Compliance   | Yes           |
| `/comments`                                | Comments             | Yes           |

---

*This PRD is a living document and will be updated as requirements evolve.*
