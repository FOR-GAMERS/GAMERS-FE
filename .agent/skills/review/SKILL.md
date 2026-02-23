---
name: code-review
description: standard code review guidelines for GAMERS-FE
---

# Code Review Skill

Use this skill when reviewing Pull Requests or code snippets for the GAMERS-FE project.

## 1. General Checklist
- [ ] **Functionality**: Does the code perform the intended task correctly?
- [ ] **Requirements**: Does it satisfy the user's request or the ticket description?
- [ ] **Bugs**: Are there any obvious logic errors or potential edge cases missing?
- [ ] **Security**: detailed check for sensitive data leakage or unsafe patterns.

## 2. Project-Specific Rules (GAMERS-FE)
Verify these specific patterns are followed:

### Architecture & Structure
- **API Calls**: Ensure no direct `fetch/axios` in components. All API logic must be in `src/services/` using the `@/lib/api-client`.
- **Directory Structure**:
  - UI components -> `src/components/ui`
  - Feature components -> `src/components/[feature]`
  - Pages -> `src/app`
- **Imports**: Check for absolute imports (`@/...`) instead of relative `../../`.

### TypeScript & Types
- **No `any`**: Strictly forbid `any`. Look for proper interfaces/types.
- **API Types**: Request/Response types should be defined in `src/types/api.ts`.
- **Props**: Component props must be typed explicitly.

### Styling (Tailwind CSS)
- **Utility Classes**: Ensure standard Tailwind classes are used.
- **Custom Colors**: Verify usage of `neon-cyan`, `deep-black`, `neon-purple` logic instead of hardcoded hex values where applicable.
- **Class Merging**: Check for `cn(...)` usage when merging external `className` props.

### React & Next.js
- **Server vs Client**: Is `use client` used only when necessary?
- **Images**: Are `next/image` components used with proper `width/height` or `fill`?
- **Hooks**: Are custom hooks used for complex logic?
- **Performance**: Check for unnecessary re-renders or heavy computations in render path.

## 3. Style & Naming
- **Components**: `PascalCase` (e.g., `ContestCard.tsx`)
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: match the export (e.g., component file matches component name).

## 4. Review Etiquette
- **Be Constructive**: "Have you considered X?" instead of "Change this to X."
- **Explain "Why"**: Provide context for your suggestions.
- **Praise**: Point out good code patterns as well.