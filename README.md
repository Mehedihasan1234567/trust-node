# Trust Node

> EU AI Act Compliance Platform — Automate AI transparency labels, scanning, and audit logging for modern websites.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Svelte](https://img.shields.io/badge/Svelte-4-ff3e00?style=flat&logo=svelte)](https://svelte.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](#)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Supabase Configuration](#supabase-configuration)
- [API Documentation](#api-documentation)
- [Widget Integration](#widget-integration)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Trust Node is a full-stack SaaS platform that helps websites comply with the **EU AI Act** by automatically detecting AI-generated content and displaying transparency labels. It provides a multi-tenant dashboard for managing websites, API keys, team members, and compliance reports — plus a lightweight embeddable widget that runs on client sites.

**Live Demo:** [https://trust-node-dashboard.vercel.app](https://trust-node-dashboard.vercel.app)

---

## Features

### Dashboard
- **Multi-tenant organization** management with role-based access (Owner, Admin, Member, Viewer)
- **Website registration** with DNS verification
- **Real-time compliance scoring** and metrics
- **Audit trail** for EU AI Act compliance records
- **API key management** with revocation and expiration
- **Team management** with invite and role assignment
- **Usage tracking** and quota monitoring
- **Dark/light theme** support

### Widget
- **Shadow DOM isolated** — zero CSS conflicts with host pages
- **Auto-scanning** of page content for AI-generated material
- **Configurable positions** — top banner, bottom bar, inline, or modal
- **Theme support** — light, dark, or auto-detect
- **Multi-language** support
- **Single script tag** integration — works with any platform (React, WordPress, plain HTML)

### Platform
- **Supabase Auth** with email confirmation
- **Prisma ORM** on PostgreSQL (Supabase hosted)
- **Stripe-ready** billing infrastructure (FREE, Starter, Pro, Enterprise plans)
- **Zod validation** shared across frontend and backend
- **Type-safe** end-to-end with TypeScript

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Trust Node                        │
│                   (pnpm monorepo)                    │
├──────────────────┬──────────────────┬────────────────┤
│   apps/          │   apps/          │  packages/     │
│   dashboard      │   widget         │  shared        │
│   (Next.js 15)   │   (Svelte 4)     │  (Zod schemas) │
│                  │                  │                │
│  • Admin UI      │  • Embeddable    │  • Validation  │
│  • Auth flow     │    JS widget     │    schemas     │
│  • API routes    │  • Shadow DOM    │  • Shared      │
│  • Dashboard     │  • Auto-scan     │    types       │
│    pages         │    engine        │  • Enums       │
└────────┬─────────┴────────┬─────────┴───────┬────────┘
         │                  │                 │
         ▼                  ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │ Supabase │      │ Client   │      │ Dashboard│
   │ Auth +   │      │ Sites    │      │ (Prisma) │
   │ Postgres │      │          │      │          │
   └──────────┘      └──────────┘      └──────────┘
```

---

## Tech Stack

| Category       | Technology                          |
|----------------|-------------------------------------|
| **Frontend**   | Next.js 15, React 19, Tailwind CSS  |
| **Widget**     | Svelte 4, Rollup, Shadow DOM        |
| **UI**         | Radix UI, shadcn/ui, Lucide Icons   |
| **Charts**     | Recharts                            |
| **Animations** | Framer Motion                       |
| **Backend**    | Next.js Server Actions, API Routes  |
| **Auth**       | Supabase Auth (email + OAuth ready) |
| **Database**   | PostgreSQL (Supabase)               |
| **ORM**        | Prisma 6                            |
| **Validation** | Zod, React Hook Form                |
| **Billing**    | Stripe (infrastructure ready)       |
| **Package Mgr**| pnpm workspaces                     |
| **Deployment** | Vercel                              |

---

## Project Structure

```
trust-node/
├── apps/
│   ├── dashboard/              # Next.js admin dashboard
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Login & signup routes
│   │   │   │   ├── api/        # Widget config & scan APIs
│   │   │   │   ├── auth/       # Supabase callback handler
│   │   │   │   └── dashboard/  # Protected dashboard pages
│   │   │   │       ├── api-keys/
│   │   │   │       ├── labels/
│   │   │   │       ├── reports/
│   │   │   │       ├── settings/
│   │   │   │       ├── team/
│   │   │   │       ├── usage/
│   │   │   │       └── websites/
│   │   │   ├── components/     # Shared UI components
│   │   │   └── lib/            # Prisma, Supabase, utils
│   │   └── package.json
│   │
│   └── widget/                 # Embeddable Svelte widget
│       ├── src/
│       │   ├── main.ts         # Widget entry point (IIFE)
│       │   └── Widget.svelte   # Main widget component
│       └── rollup.config.js
│
├── packages/
│   └── shared/                 # Shared types & validation
│       └── src/
│           └── index.ts        # Zod schemas, enums, types
│
├── prisma/
│   └── schema.prisma           # Database schema
│
├── package.json                # Root workspace config
├── pnpm-workspace.yaml
└── vercel.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Supabase** project (free tier works)
- **PostgreSQL** database (Supabase provides one)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/trust-node.git
cd trust-node

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate
```

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable                          | Description                                    | Required |
|-----------------------------------|------------------------------------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL                           | Yes      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key                | Yes      |
| `DATABASE_URL`                    | PostgreSQL connection string (pooler)          | Yes      |
| `DIRECT_URL`                      | Direct PostgreSQL connection (migrations)      | Yes      |
| `GPTZERO_API_KEY`                 | GPTZero API key for AI detection               | No       |
| `HIVE_AI_API_KEY`                 | Hive Moderation API key                        | No       |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                    | No       |
| `STRIPE_SECRET_KEY`               | Stripe secret key                              | No       |
| `STRIPE_WEBHOOK_SECRET`           | Stripe webhook signing secret                  | No       |
| `RESEND_API_KEY`                  | Resend API key for transactional emails        | No       |
| `NEXT_PUBLIC_WIDGET_CDN_URL`      | Widget script CDN URL                          | No       |
| `NEXT_PUBLIC_APP_URL`             | Application base URL                           | No       |
| `ENCRYPTION_KEY`                  | Key for encrypting sensitive data              | No       |

### Database Setup

```bash
# Push schema to database (development)
pnpm db:push

# OR run migrations (production)
pnpm db:migrate

# Open Prisma Studio to inspect data
pnpm db:studio
```

### Running Locally

```bash
# Start the dashboard (port 3000)
pnpm dev

# Start the widget in watch mode (separate terminal)
pnpm dev:widget
```

| Command               | Description                          |
|-----------------------|--------------------------------------|
| `pnpm dev`            | Start dashboard dev server           |
| `pnpm dev:widget`     | Start widget dev with hot reload     |
| `pnpm build`          | Build widget + dashboard             |
| `pnpm build:dashboard`| Build dashboard only                 |
| `pnpm build:widget`   | Build widget only                    |
| `pnpm lint`           | Run linter across all packages       |
| `pnpm typecheck`      | Run TypeScript type checking         |
| `pnpm db:generate`    | Generate Prisma client               |
| `pnpm db:push`        | Push Prisma schema to database       |
| `pnpm db:migrate`     | Run Prisma migrations                |
| `pnpm db:studio`      | Open Prisma Studio                   |

---

## Deployment

### Vercel

The project is configured for Vercel deployment via `vercel.json`.

1. Connect your GitHub repository to Vercel
2. Set the build command: `pnpm --filter @trust-node/widget build && pnpm --filter @trust-node/dashboard build`
3. Set the output directory: `apps/dashboard/.next`
4. Add all environment variables from the table above
5. Deploy

```bash
# Or deploy via CLI
vercel --prod
```

### Supabase Redirect URLs

After deployment, add these URLs to your Supabase project:

**Authentication → URL Configuration → Redirect URLs:**

```
http://localhost:*/auth/callback
https://trust-node-dashboard.vercel.app/auth/callback
```

Set the **Site URL** to your production URL:
```
https://trust-node-dashboard.vercel.app
```

---

## Supabase Configuration

### Email Templates

Customize the email confirmation template in Supabase Dashboard:

**Authentication → Email Templates → Confirm signup**

Set the confirmation URL to:
```
{{ .SiteURL }}/auth/callback
```

### Auth Settings

- **Email Confirmations:** Enable (recommended for production)
- **Secure Password Change:** Enable
- **JWT Expiry:** Configure as needed (default: 3600s)

---

## API Documentation

### Widget Configuration

```
GET /api/widget/config?domain={domain}
```

Returns widget configuration for a given domain.

**Response:**
```json
{
  "success": true,
  "data": {
    "theme": "auto",
    "position": "inline_only",
    "autoScan": true,
    "scanText": true,
    "scanImages": true,
    "disclosurePrefix": "AI Disclosure:",
    "language": "en"
  }
}
```

### Widget Scan

```
POST /api/widget/scan
```

Submit content for AI detection scanning.

**Request Body:**
```json
{
  "websiteId": "uuid",
  "pageUrl": "https://example.com/page",
  "items": [
    {
      "contentHash": "sha256-hash",
      "contentType": "TEXT",
      "contentPreview": "First 200 chars...",
      "contentData": "full content or base64"
    }
  ]
}
```

**Content Types:** `TEXT`, `IMAGE`, `VIDEO`, `AUDIO`, `DEEPFAKE`

**Verdicts:** `AI_GENERATED`, `AI_MANIPULATED`, `HUMAN_CREATED`, `UNCERTAIN`

---

## Widget Integration

Add Trust Node to any website with a single script tag:

```html
<script
  src="https://trust-node-dashboard.vercel.app/widget.js"
  data-api-key="your-api-key"
  data-api-url="https://trust-node-dashboard.vercel.app"
  data-theme="auto"
  data-position="inline_only"
  data-auto-scan="true"
  data-language="en"
></script>
```

### Widget Options

| Attribute        | Values                                      | Default          |
|------------------|---------------------------------------------|------------------|
| `data-api-key`   | Your API key from dashboard                 | Required         |
| `data-api-url`   | API base URL                                | Production URL   |
| `data-theme`     | `light`, `dark`, `auto`                     | `auto`           |
| `data-position`  | `top_banner`, `bottom_bar`, `inline_only`, `modal_only` | `inline_only` |
| `data-auto-scan` | `true`, `false`                             | `true`           |
| `data-language`  | ISO 639-1 language code                     | `en`             |

---

## Database Schema

The platform uses a multi-tenant architecture with the following core models:

- **User** — Synced with Supabase Auth
- **Organization** — Tenant with plan, billing, and members
- **OrganizationMember** — Many-to-many with roles (OWNER, ADMIN, MEMBER, VIEWER)
- **Website** — Registered domains with verification status
- **WidgetConfig** — Per-website widget settings
- **ApiKey** — Organization-scoped API keys
- **ScanResult** — AI detection results with verdicts and confidence scores
- **AuditLog** — Compliance audit trail
- **Subscription** — Stripe-backed billing records
- **UsageRecord** — Scan and action tracking

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- TypeScript strict mode enabled
- ESLint and Prettier configured
- Run `pnpm lint` and `pnpm typecheck` before committing

---

## License

Proprietary — All rights reserved.

---

<p align="center">
  Built with Next.js, Supabase, and Svelte
</p>
