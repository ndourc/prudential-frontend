# Licensing UI & API integration

This folder contains a small admin UI for the Licensing area of the PRBS frontend. It consumes the OpenAPI endpoints under `/licensing/`.

Key features implemented:

- Typed API service: `src/service/licensing.ts` — wrappers around the endpoints.
- Domain types: `src/types/licensing.ts` — common models & paginated results.
- React Query Provider: `src/providers/QueryProvider.tsx` — wrap your app with React Query for caching.
- React Query hooks for common resources: `src/hooks/*.ts` (Directors, InstitutionalProfile, Shareholder, Portal Integration).
- UI components (shadcn): `src/components/licensing/*` — forms, tables, nav.
- Pages for Licensing: under `src/app/licensing/` (Directors, Institutional Profiles, Portal Integration, Portal SMI Data, Shareholders, License History).

## Notes & Setup

1. Install the new dependency for React Query:

```bash
npm install @tanstack/react-query
```

2. The app expects an `Authorization: Bearer <token>` stored as `localStorage.token` by the login flow for authenticated endpoints. If you use a different auth strategy (HttpOnly cookie, NextAuth), update `src/lib/http.ts`.

3. Please run `npm run dev` (ensure you have installed dependencies) and visit `/licensing`.

4. To generate type definitions from the OpenAPI spec automatically, consider running:

```bash
npx openapi-typescript https://prudential.up.railway.app/swagger/?format=openapi --output src/types/openapi.json.d.ts
```

5. For better UX, wallet the pages with pagination and filtering using React Query parameters and a shared pagination component.

If you’d like, I can next:

- Add testing (Playwright/Cypress) for the forms
- Generate full typed client from the OpenAPI spec
- Add more UI polish and filtering/sorting/pagination
