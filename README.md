# Denfry's 3D Portfolio

Personal portfolio site for Denfry — built with Next.js 16 App Router, React 19, and a React Three Fiber voxel hero. Supports English and Russian locales, dark/light themes, MDX case studies, and a contact form powered by Resend.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI library | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| 3D | React Three Fiber, @react-three/drei, Three.js |
| Animation | GSAP, Lenis |
| i18n | next-intl (EN / RU) |
| Theming | next-themes |
| Content | Velite (MDX case studies) |
| Email | Resend |
| Analytics | @vercel/analytics, @vercel/speed-insights |
| Deploy | Vercel |

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (Turbopack)
pnpm dev

# Production build
pnpm build

# Unit tests
pnpm test

# End-to-end tests (requires a fresh build on port 4317)
pnpm build && pnpm e2e
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL (e.g. `https://denfry.vercel.app`) |
| `RESEND_API_KEY` | Yes | Resend API key for the contact form |
| `CONTACT_TO` | Yes | Email address that receives contact messages |
| `GITHUB_TOKEN` | Optional | GitHub PAT for fetching extra public repos (higher rate limit) |

See `.env.example` for the full list.

## Deploy to Vercel

> This is a manual, one-time user action — no CLI credentials are needed from this repo.

1. Push this branch to GitHub (or your preferred Git host).
2. Go to [vercel.com/new](https://vercel.com/new) and click **Import Git Repository**.
3. Select the repository. Vercel will auto-detect the **Next.js** framework — no extra configuration is needed.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL` → your Vercel preview URL (e.g. `https://denfry.vercel.app`) — you can update this after the first deploy.
   - `RESEND_API_KEY` → your Resend API key.
   - `CONTACT_TO` → the email address that should receive contact messages.
   - `GITHUB_TOKEN` → optional, for higher GitHub API rate limits.
5. Click **Deploy**. The first build takes ~2–3 minutes.
6. The site will be live at `*.vercel.app`. To add a custom domain, go to **Project Settings → Domains** in the Vercel dashboard.

> `vercel.json` is intentionally omitted — Next.js is auto-detected and no custom rewrites or redirects are needed.
