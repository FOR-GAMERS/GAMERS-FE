---
name: gamers-fe-guide
description: Comprehensive guide to the GAMERS-FE project structure, tech stack, and development patterns.
---

# GAMERS-FE Project Skill

## Project Overview
GAMERS-FE is a Next.js 16 application built with TypeScript and Tailwind CSS v4. It serves as the frontend for a gaming platform/community service, featuring contest management, user profiles, and game integrations (Valorant, LoL).

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: 
  - Tailwind CSS v4
  - `clsx` & `tailwind-merge` for class management
  - Framer Motion & GSAP for animations
- **State Management**: 
  - React Query (`@tanstack/react-query`) for server state
  - React Context for global UI state
- **Form Handling**: React Hook Form (`react-hook-form`) + Zod validation
- **API Client**: Custom Axios wrapper (`@/lib/api-client`)
- **I18n**: `i18next` & `react-i18next`
- **Package Manager**: npm

## Directory Structure
- `src/app`: Next.js App Router pages and layouts.
- `src/components`:
    - `ui`: Reusable UI components (Buttons, Inputs, Modals).
    - `contest`: Contest-related components.
    - `admin`: Admin dashboard components.
    - `layout`: Layout components (Header, Footer).
- `src/services`: API service modules.
- `src/types`: TypeScript definitions, especially API responses (`api.ts`).
- `src/lib`: Utility libraries and configurations (e.g., `api-client`).
- `src/hooks`: Custom React hooks.
- `src/utils`: Helper functions.
- `src/locales`: i18n translation files.

## Key Development Patterns

### 1. API Integration
- **Do not** make direct `fetch` or `axios` calls in components.
- **Always** create a service function in `src/services/` using the `api` client.
- Define request/response types in `src/types/api.ts`.
- Use the `api` client from `@/lib/api-client`.

**Example:**
`src/services/user-service.ts`
```typescript
import { api } from '@/lib/api-client';
import { UserResponse, ApiResponse } from '@/types/api';

export const getUser = async (id: number) => {
  return api.get<ApiResponse<UserResponse>>(`/users/${id}`);
};
```

### 2. Styling Rules
- Use Tailwind CSS utility classes found in `src/app/globals.css` (or implicitly via Tailwind v4).
- Use the configured custom colors: `deep-black`, `neon-cyan`, `neon-purple`.
- For conditional classes, use `cn()` (or `clsx` + `tailwind-merge`).

**Example:**
```tsx
import { cn } from "@/lib/utils"; // or explicit imports

<div className={cn("p-4 rounded-lg", isActive ? "bg-neon-cyan" : "bg-gray-800")}>
  Content
</div>
```

### 3. Component Structure
- Use functional components with TypeScript interfaces for props.
- Place reusable generic components in `src/components/ui`.
- Place feature-specific components in `src/components/[feature]`.
- Use `export default` or named exports consistently (check existing files).

### 4. Form Handling
- Use `useForm` from `react-hook-form`.
- Define validation schemas with `zod`.
- Use `zodResolver` to integrate them.

### 5. Config Files
- `next.config.ts`: Image domains (`images.unsplash.com`, `discord`, etc.) and redirects.
- `tailwind.config.ts`: Custom theme extensions.

## Development Workflow
- **Start Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`

## Critical Rules
1. **Never** use `any` type implicitly or explicitly if possible.
2. **Always** check `swagger.yaml` or backend docs before creating new API types.
3. **Follow** the existing folder structure when adding new files.
