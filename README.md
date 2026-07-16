# Iqrar Chiller Van Transport — Website + Admin CRM

A complete Next.js 15 + Prisma project for Iqrar Chiller Van Transport LLC:
a public marketing site (homepage, services, blog, about, contact) and an
admin CRM to manage all of it (branding/logo, fleet, blog, media, leads,
team). Every public page reads live from the same database the CRM writes
to — update content in `/admin`, it appears on the site immediately, no
redeploy needed.

Layout mirrors the structure of alpinechiller.com (hero → fleet grid →
why-us → comparison table → deliverables → footer; blog as a simple
stacked list) with original Iqrar branding: a "cold chain" palette (frost
navy + amber + chill cyan) and a signature temperature-gauge element on
every vehicle card instead of a plain text badge.

## 1. Install

```bash
cd iqrar-admin-crm
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — SQLite works out of the box for local dev. For
  production, switch `provider = "sqlite"` to `provider = "postgresql"` in
  `prisma/schema.prisma` and point `DATABASE_URL` at your Postgres instance.
- `SESSION_SECRET` — generate with `openssl rand -base64 32`.

## 2. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

The seed script creates:
- An admin login: **admin@iqrarchillervan.com / ChangeMe123!** — change this
  immediately after first login.
- Default site settings, 4 starter vehicle types, 1 blog category, 1 draft post.

## 3. Run it

```bash
npm run dev
```

- Public site: `http://localhost:3000/` — home, `/services`,
  `/services/[slug]`, `/blog`, `/blog/[slug]`, `/about`, `/contact`
- Admin panel: `http://localhost:3000/admin`

## What's included

**Public site** (`src/app/(site)/`)
| Page | Path | Pulls from |
|---|---|---|
| Homepage | `/` | `SiteSettings`, `VehicleType` |
| Services hub | `/services` | `VehicleType` |
| Vehicle detail | `/services/[slug]` | `VehicleType`, posts to `/api/public/contact` |
| Blog listing | `/blog` | `BlogPost`, `BlogCategory` |
| Blog post | `/blog/[slug]` | `BlogPost` |
| About | `/about` | `SiteSettings`, `TeamMember` |
| Contact | `/contact` | `SiteSettings`, `VehicleType`, posts to `/api/public/contact` |

**Admin CRM** (`src/app/admin/`)
| Area | Path | Notes |
|---|---|---|
| Login / session | `/admin/login`, `src/lib/auth.ts`, `src/middleware.ts` | JWT cookie session, 7-day expiry, all `/admin/*` and `/api/admin/*` routes protected |
| Branding & Settings | `/admin/settings` | Logo, site name, hero text, contact info, social links |
| Fleet / Services | `/admin/fleet` | Full CRUD, drives homepage/services fleet cards |
| Blog | `/admin/blog`, `/admin/blog/categories` | Draft/Publish workflow, categories |
| Media Library | `/admin/media` | Central upload, reused by logo/fleet/blog/team pickers |
| Leads / Inquiries | `/admin/leads` | Fed by `POST /api/public/contact` |
| Team | `/admin/team` | About page team members |
| Admin Users | `/admin/users` | Owner/Editor roles |

## Content still hardcoded (by design)

The "Why Choose Us" feature list and the "What We Deliver" 9-item grid on
the homepage are static content in `src/app/(site)/page.tsx`
(`WHY_US` / `WHAT_WE_DELIVER` arrays) — these weren't part of the original
CRM scope (logo/blogs/images/services). If you want these editable from
the admin panel too, they'd follow the same pattern as `TeamMember`: a new
Prisma model + CRUD page, happy to add it.

## Wiring notes

- The only unauthenticated write endpoint is `POST /api/public/contact` —
  used by both the contact page form and each vehicle detail page's
  inline "Book a Van" form.
- Blog post bodies render as plain paragraphs (split on blank lines). Swap
  in `react-markdown` in `src/app/(site)/blog/[slug]/page.tsx` if you want
  full Markdown support later.

## Moving to production

- **Database**: switch to Postgres (see above) and run
  `npx prisma migrate deploy` on deploy.
- **File uploads**: `src/lib/uploads.ts` writes to `public/uploads/` on
  local disk — fine for a single VPS behind Nginx. To move to S3 later,
  only `saveUploadedFile()` needs to change.
- **CI/CD**: fits your existing GitHub Actions + PM2 + Nginx pipeline —
  `npm run build && npm run start`, with `npx prisma migrate deploy` as a
  pre-deploy step.

