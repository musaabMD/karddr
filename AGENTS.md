# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
DrKard is a medical education flashcard/study resource web app built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, **Convex** (cloud BaaS), and **WorkOS AuthKit** (authentication). Package manager is **npm** (`package-lock.json`).

### Running the app
- `npm run dev` starts the Next.js dev server on port 3000.
- The homepage (`/`) is an unauthenticated route and renders without valid Convex/WorkOS credentials.
- Authentication routes (`/auth/sign-in`, `/auth/sign-up`, `/auth/callback`) require valid WorkOS credentials.

### Environment variables
A `.env.local` file is needed with these variables (placeholder values allow the homepage to render):
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL
- `WORKOS_CLIENT_ID` — WorkOS client ID
- `WORKOS_API_KEY` — WorkOS API key
- `WORKOS_COOKIE_PASSWORD` — 32+ char string for cookie encryption
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI` — OAuth callback URL (typically `http://localhost:3000/auth/callback`)

### Key commands
See `package.json` scripts:
- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint (warnings in Convex auto-generated files are expected)

### Gotchas
- Next.js 16 requires Node.js >= 18.18. The environment ships with Node 22, which is compatible.
- The `convex/_generated/` files produce ESLint warnings about unused eslint-disable directives — these are auto-generated and safe to ignore.
- The middleware at `src/proxy.ts` (WorkOS AuthKit) runs on all routes but allows unauthenticated access to `/`, `/auth/sign-in`, `/auth/sign-up`, and `/auth/callback`.
