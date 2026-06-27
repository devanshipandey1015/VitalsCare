# VitalsCare

A production-ready health tracking web app for monitoring blood pressure and blood sugar readings over time. Built with Next.js, TypeScript, Tailwind CSS, Supabase Auth, and Supabase PostgreSQL.

Designed with large, readable UI suitable for older adults managing diabetes and hypertension.

## Features

- **Authentication** — Email/password signup, login, logout, and protected routes
- **Add readings** — Blood pressure, blood sugar, date/time (defaults to now), notes, with validation
- **Dashboard** — Latest reading, 7-day averages, total count, and abnormal value warnings
- **History** — Sortable table with 7-day, 30-day, and all-time filters; edit and delete
- **Charts** — Recharts line charts for BP and blood sugar trends (mobile responsive)
- **Doctor export** — Download PDF or CSV reports with 7/30-day summaries, averages, extremes, notes, and tracking alerts
- **Reminders (coming soon)** — Scaffolded for morning, evening, and after-meal reminders (`supabase/reminders.sql`)
- **Health status** — BP and sugar classifications with color-coded badges; tracking and alerts only (no medical advice)
- **Security** — Supabase Row Level Security ensures users only see their own data

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- [Recharts](https://recharts.org/)
- [Zod](https://zod.dev/) (form validation)

## Prerequisites

- Node.js 20+
- npm
- A [Supabase](https://supabase.com/) account (free tier works)

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo-url>
cd VitalsCare-1
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. Wait for the database to finish provisioning.

### 3. Run the database schema

1. In Supabase Dashboard, open **SQL Editor**.
2. Copy the contents of `supabase/schema.sql`.
3. Paste and run the query.

This creates the `readings` table with RLS policies so each user can only access their own data.

### 4. Configure authentication

1. In Supabase Dashboard, go to **Authentication → Providers**.
2. Ensure **Email** is enabled (enabled by default).
3. For development, you may disable **Confirm email** under **Authentication → Providers → Email** so signups work immediately without email verification.

### 5. Set environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials from **Project Settings → API**:

| Variable | Where to find it |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start logging readings.

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Main dashboard
│   ├── readings/           # History, add, edit
│   ├── charts/             # Trend charts
│   ├── login/              # Sign in
│   └── signup/             # Create account
├── components/
│   ├── auth/               # Login & signup forms
│   ├── charts/             # Recharts components
│   ├── dashboard/          # Dashboard cards & warnings
│   ├── layout/             # App shell & navigation
│   ├── readings/           # Reading form & table
│   └── ui/                 # Reusable UI components
└── lib/
    ├── health/             # BP & sugar status logic
    ├── readings/           # Queries & server actions
    ├── supabase/           # Supabase clients & middleware
    ├── types/              # TypeScript types
    └── validations/        # Zod schemas
supabase/
└── schema.sql              # Database setup with RLS
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | Health overview (protected) |
| `/readings/new` | Add a reading (protected) |
| `/readings` | Reading history with filters (protected) |
| `/readings/[id]/edit` | Edit a reading (protected) |
| `/export` | Doctor report — PDF & CSV download (protected) |
| `/settings/reminders` | Reminder preferences (coming soon) |

## Health Status Logic

### Blood Pressure

| Status | Criteria |
|--------|----------|
| Normal | Systolic &lt; 120 and diastolic &lt; 80 |
| Elevated | Systolic 120–129 and diastolic &lt; 80 |
| Stage 1 Hypertension | Systolic 130–139 or diastolic 80–89 |
| Stage 2 Hypertension | Systolic ≥ 140 or diastolic ≥ 90 |
| Hypertensive Crisis | Systolic ≥ 180 or diastolic ≥ 120 |

### Blood Sugar

| Type | Low | Target | High |
|------|-----|--------|------|
| Fasting | &lt; 70 | 80–130 | &gt; 130 |
| Post-meal | &lt; 70 | &lt; 180 | ≥ 180 |
| Random | &lt; 70 | — | &gt; 180 |

> These are general indicators. Always follow your doctor's personal targets.

## Deployment to Vercel

### Option A: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — keep the default build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Add environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

When prompted, add the same environment variables. For production:

```bash
vercel --prod
```

### Post-deployment checklist

1. **Supabase Auth redirect URLs** — In Supabase Dashboard → **Authentication → URL Configuration**, add your Vercel domain(s):
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`
2. **Verify RLS** — Confirm `supabase/schema.sql` was run on your Supabase project.
3. **Test the flow** — Sign up, add a reading, check dashboard, history, and charts.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
