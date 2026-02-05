# Copilot Instructions for Prudential Frontend

## Project Overview

**Prudential** is a Next.js 15+ financial dashboard application for managing company offsite profiling submissions, risk assessment, and regulatory compliance. It uses TypeScript, Tailwind CSS, and Radix UI components for a robust, type-safe frontend.

**Tech Stack:**

- Next.js 15.3.4 (App Router)
- React 19
- TypeScript 5
- Zod 4.1.12 for schema validation
- Tailwind CSS 4 + Radix UI components
- next-themes for dark mode support

---

## Architecture

### Core Data Flow

1. **Authentication** → Middleware validates cookies (`access`, `refresh`, `role`)
2. **Protected Routes** → Role-based access control (COMMISSION_ANALYST role for SMI dashboard)
3. **Form Submission** → Multi-step offsite profiling form with validation
4. **Backend Proxy** → API routes forward requests to Django backend at `BACKEND_URL`

### Directory Structure

- **`src/app`** → Next.js pages using App Router (routes auto-map to URL paths)
- **`src/components/ui`** → Shadcn/ui base components + company-specific forms in `common/company/`
- **`src/schema`** → Zod validation schemas (not separate API schemas; these define frontend form validation)
- **`src/types`** → TypeScript interfaces for company data models
- **`src/service`** → API client functions (call frontend `/api/*` routes, not backend directly)
- **`src/lib`** → Utility functions: ID generation, financial calculations, date/currency formatting

### Key Components

- **`offsiteProfilingForm.tsx`** → 7-step wizard managing `OffsiteFormData` state
  - Steps: Board & Committees → Products & Clients → Financial Statements → Balance Sheet → Assets & Capital → Documents → Review & Submit
  - Handles step-level validation, form state updates, and submission
  - Child components handle individual step UIs (e.g., `boardCommitStep.tsx`, `financialStatementStep.tsx`)

---

## Authentication & Authorization

### Middleware Rules (`src/middleware.ts`)

- Protected paths require `access` cookie; redirect to `/login?next={pathname}` if missing
- `COMMISSION_ANALYST` role restricts POST/PUT/DELETE on `/dashboard/smi/*` endpoints (GET allowed)
- Role extracted from login/register responses and stored in `role` cookie

### API Routes

- **`/api/auth/login`** → Proxies to backend, sets `access` + `refresh` + `role` cookies
- **`/api/auth/register`** → Similar flow; accepts extended user fields (email, name, role, smi_id, etc.)
- **`/api/risk/calculate`** and **`/api/offsite/submit`** → Require auth token in cookie or header

---

## Form Patterns

### State Management

- **Single-source truth:** `formData: OffsiteFormData` at root of `offsiteProfilingForm.tsx`
- **Step state:** `currentStep` integer tracks active step
- **Errors:** `validationErrors` object holds per-field error messages
- Child components receive `formData`, `setFormData()`, and error state as props

### Validation

- **Schema-driven:** Each step uses corresponding Zod schema in `src/schema/company.ts`
- **Manual validation:** `validateStep(step)` runs before allowing step navigation
- **Zod schemas require:** min lengths, string.min(), array.min(), number ranges

### Example: Adding a New Field

1. Add field to `OffsiteFormData` type in `src/types/company.ts`
2. Add Zod schema validation in `src/schema/company.ts`
3. Update child component to handle field in form
4. Update `validateStep()` if required

---

## Calculations & Utilities

### Financial Calculations (`src/lib/company.ts`)

- **`calculateConcentration(value, total)`** → Returns percentage (0-100)
- **`calculateGrossMargin(revenue, operatingCosts)`** → (revenue - costs) / revenue × 100
- **`calculateProfitMargin(profitBeforeTax, revenue)`** → profit / revenue × 100
- **`calculateWorkingCapital(current assets, current liabilities)`** → Simple difference
- **`calculateCAR(netCapital, requiredCapital)`** → Capital Adequacy Ratio

### Formatting

- **`formatCurrency(amount)`** → USD formatting with locale
- **`formatDate(dateString)`** → Converts to "Month D, YYYY"
- **`generateId()`** → Random 9-character string for client-side IDs

---

## Backend Integration

### Proxy Pattern

Frontend API routes **do not** implement business logic—they proxy requests to backend:

- Extract form data from request
- Forward to backend URL (env: `BACKEND_URL`, default: `http://localhost:8000`)
- Return backend response unchanged

### Backend Endpoints (via proxies)

- `POST /api/auth/login/` → Returns `{ access, refresh, user }`
- `POST /api/auth/register/` → Returns `{ user, access, refresh }`
- `POST /api/v1/submissions/{submissionId}/calculate-risk/` → Calculates risk metrics
- Offsite submission endpoints (see `src/service/company.ts` for planned routes)

---

## Development Workflow

### Build & Run

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run clean    # Clear .next cache
```

### Environment

- **`BACKEND_URL`** → Django backend URL (used in API route proxies)
- **Next.js build:** Ignores ESLint & TypeScript errors in production (`next.config.ts`)

### Testing Locally

1. Start backend: `python manage.py runserver` (Django on port 8000)
2. Start frontend: `npm run dev`
3. Navigate to `http://localhost:3000` → redirects to `/login` if no `access` cookie

---

## Code Style & Conventions

### Component Patterns

- **Client components** → Use `"use client"` directive for interactivity (forms, hooks)
- **Server components** → Default; used for layouts, static pages
- **Props drilling:** State passed explicitly to children; no context API currently used

### Naming

- **Components:** PascalCase (e.g., `BoardCommitStep`)
- **Files:** kebab-case or PascalCase matching component name
- **Functions/variables:** camelCase
- **Schemas:** Suffix with "Schema" (e.g., `boardMemberSchema`)

### CSS

- **Tailwind first:** Use utility classes; custom CSS in `src/app/globals.css` only
- **Shadcn/ui:** Base components (Button, Input, etc.) in `src/components/ui/`
- **Dark mode:** Managed by `next-themes` (class-based, no system override needed per component)

---

## Common Tasks

### Adding a Modal

1. Create component in `src/components/ui/common/company/modals/`
2. Import Radix UI Dialog or custom Dialog wrapper
3. Accept `isOpen`, `onClose`, `onSubmit` as props
4. Example: `assetModal.tsx` opens from parent, receives item data

### Adding a New Step to Offsite Form

1. Create step component in `src/components/ui/common/company/`
2. Add to `steps` array in `offsiteProfilingForm.tsx` with icon from lucide-react
3. Add case in `validateStep()` for validation
4. Update form state rendering to include new step case in JSX

### Connecting to a New Backend Endpoint

1. Create proxy route in `src/app/api/[feature]/[action]/route.ts`
2. Extract request data (JSON or FormData)
3. Fetch `${BACKEND_URL}/api/[endpoint]/` with auth token
4. Return backend response (or null + error if needed)

---

## Debugging Tips

### Form State Issues

- Log `formData` before submission to verify child components updated state correctly
- Check `validationErrors` object to see which fields failed validation

### Auth Issues

- Check cookie presence in browser DevTools → Application → Cookies
- Verify `access` token expiry (maxAge: 3600 seconds in login route)
- Middleware logs can reveal redirect logic

### Backend Communication

- Check `BACKEND_URL` env variable in deployment
- Inspect network tab → API route proxy response for backend errors
- Django may return 400/403/500 with detailed error JSON

---

## Known Constraints & Future Work

- **No form auto-save:** Data lost if page reloads (see `saveDraft` in `src/service/company.ts` for planned feature)
- **No context API:** State drilling acceptable for current form complexity; consider if adding many sibling forms
- **No real-time validation:** Validation only on step navigation
- **Build errors ignored:** `next.config.ts` ignores TypeScript/lint errors (use with caution)
