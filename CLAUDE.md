# CLAUDE.md — Consent Management Platform (Frontend)

## Project Overview

Apex JEE PROJECT

---

## Tech Stack

| Layer              | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| Framework          | Next.js 16.1 (App Router, Turbopack)                 |
| Language           | TypeScript 5.9 (strict mode)                         |
| UI Library         | React 19.2                                           |
| Component Library  | shadcn/ui (new-york style) built on Radix UI         |
| Styling            | Tailwind CSS 4.1                                     |
| State Management   | Zustand 5.0 (client state with persistence)          |
| Server State       | TanStack React Query 5.90                            |
| Forms              | React Hook Form 7.69 + Zod 4.2                      |
| HTTP Client        | Axios 1.13 (with interceptors)                       |
| Tables             | TanStack React Table 8.21                            |
| Charts             | Recharts 2.15                                        |
| Rich Text Editor   | TipTap 3.14                                          |
| Notifications      | Sonner (toast)                                       |
| Icons              | Lucide React, @icons-pack/react-simple-icons         |
| Animations         | Framer Motion 12.23                                  |
| Package Manager    | pnpm                                                 |

---

## Project Structure

```
app/                          # Next.js App Router
├── (auth)/auth/              # Public auth pages (login, register, forgot-password, reset-password, verify)
├── (others)/                 # Protected route group
│   ├── dashboard/
│   ├── consent-records/
│   ├── consent-template/     # 8-step wizard for consent templates
│   ├── processing-inventory/ # categories, activities, purposes
│   ├── audit-compliance/
│   ├── comments/
│   ├── developers/
│   └── settings/
├── errors/unauthorized/      # RBAC error page
├── layout.tsx                # Root layout with providers
├── globals.css               # Tailwind theme variables
└── page.tsx                  # Redirects to /dashboard

components/
├── common/                   # Shared layout components (header, sidebar, error, loader)
└── ui/                       # shadcn/ui components — do NOT edit directly unless customizing

hooks/                        # Custom React hooks (useCounter, usePasswordToggle)
lib/                          # Utility functions (cn, auth helpers, encryption, formatters)
providers/                    # Context providers (QueryProvider, ToastProvider)
stores/                       # Zustand stores (session.ts)
config/                       # Axios instance with interceptors
schemas/                      # Zod validation schemas (one file per domain)
types/                        # TypeScript type definitions (.d.ts files)
data/                         # Static data, constants, menu items, form options
assets/images/                # Static images
public/                       # Icons, logos
```

---

## Coding Standards

### File Naming

| Type           | Convention    | Example                        |
| -------------- | ------------- | ------------------------------ |
| Pages          | `page.tsx`    | Next.js convention             |
| Layouts        | `layout.tsx`  | Next.js convention             |
| Components     | kebab-case    | `login-form.tsx`, `stat-cards.tsx` |
| Hooks          | camelCase     | `useCounter.tsx`               |
| Utilities      | camelCase     | `getAuthToken.ts`              |
| Schemas        | camelCase     | `consentForm.ts`               |
| Types          | PascalCase    | `Token.d.ts`, `User.d.ts`     |
| Data/constants | kebab-case    | `basic-info.ts`                |
| Stores         | camelCase     | `session.ts`                   |

### Import Order

1. External libraries (`react`, `next/*`, third-party)
2. Aliased imports (`@components`, `@lib`, `@hooks`, `@schemas`, `@data`, `@stores`)
3. Relative imports (`./components`, `../utils`)

### Import Aliases

All aliases use `@*` mapped to root (configured in `tsconfig.json`):
- `@components/*`, `@lib/*`, `@hooks/*`, `@schemas/*`, `@data/*`, `@stores/*`, `@config/*`, `@types/*`

### Component Pattern

```tsx
"use client"; // Only if the component needs interactivity

import { useState } from "react";
import { Button } from "@components/ui/button";

type Props = {
  title: string;
  count?: number;
};

const MyComponent = ({ title, count = 0 }: Props) => {
  return <div>{title}: {count}</div>;
};

export default MyComponent;
```

- Use `"use client"` directive only when the component needs client-side interactivity
- Use `"use server"` for server actions (e.g., token/cookie access)
- Default export for page/layout components
- Arrow function components with explicit typing
- Props defined as inline `type` (not `interface`)

### Form Pattern

Always use React Hook Form + Zod:

```tsx
const form = useForm({
  defaultValues,
  mode: "onTouched",
  resolver: zodResolver(MySchema),
});
```

- Schemas live in `schemas/` directory, one file per domain
- Use `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` from shadcn/ui

### State Management

- **Client state**: Zustand with `persist` middleware (localStorage)
- **Server state**: TanStack React Query for API data fetching and caching
- Do NOT mix concerns — Zustand for auth/session, React Query for API data

### API Calls

- Use the Axios instance from `config/axios.ts` — never create a new Axios instance
- Base URL comes from `process.env.NEXT_PUBLIC_API_URL`
- 401 responses are handled globally by the interceptor (redirects to `/auth/login`)

---

## Formatting & Linting

- **Prettier** for formatting (with `prettier-plugin-tailwindcss` for class sorting)
- **ESLint 9** with flat config (`eslint.config.mjs`) — extends TypeScript and Next.js recommended rules
- Run `pnpm format:fix` to auto-format
- Run `pnpm lint:fix` to fix lint issues
- Run `pnpm type:check` for TypeScript type checking

---

## Dev Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm format:check     # Check formatting
pnpm format:fix       # Auto-format
pnpm type:check       # TypeScript type check
```

---

## Testing

No test framework is currently configured. If tests are added, follow these conventions:
- Use Vitest or Jest with React Testing Library
- Test files: `*.test.tsx` / `*.spec.tsx` co-located with source files
- Focus on user-facing behavior, not implementation details

---

## Error Handling

- **Form validation**: Zod schemas validate all user input; errors display inline via `<FormMessage>`
- **API errors**: Axios interceptor catches 401 → redirects to login. Other errors should be caught per-request and surfaced via Sonner toast
- **Error boundaries**: Use `components/common/error.tsx` for page-level error states with "Try Again" / "Back" actions
- **Loading states**: Show skeleton/spinner UI during data fetching
- **Toast notifications**: Use Sonner for success, error, and warning feedback

---

## Authentication & Security

- JWT-based auth with HTTP-only cookies (`AUTH_TOKEN`, `REFRESH_TOKEN`)
- Token refresh handled server-side in middleware (`proxy.ts`)
- Session state managed via Zustand store (`stores/session.ts`)
- RBAC roles: `ROLE_SUPER_ADMIN`, `ROLE_GUARDIAN`, `ROLE_LEARNER`, `ROLE_EMPLOYEE`
- Middleware enforces route protection and sets security headers (CSP, HSTS, X-Frame-Options)
- Use `getAuthToken()` from `lib/getAuthToken.ts` for server-side token access

---

## Do NOT

- Use `any` type — always provide proper TypeScript types
- Create new Axios instances — use the shared one from `config/axios.ts`
- Hardcode API URLs — use `process.env.NEXT_PUBLIC_API_URL`
- Skip Zod validation on forms — every form must have a schema
- Edit `components/ui/*` files directly unless intentionally customizing a shadcn component
- Use `document.getElementById()` or direct DOM manipulation — use React patterns
- Commit `.env` files or secrets
- Use inline styles — use Tailwind CSS utility classes
- Add new dependencies without checking if an existing library covers the use case
- Use `console.log` in production code — remove before committing
- Skip the `"use client"` directive on components that use hooks, state, or browser APIs
