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
- `DATABASE_URL` — for local development, point this at any MySQL instance
  (a local install, Docker's `mysql:8` image, or even Hostinger's MySQL
  database directly if you don't mind developing against production data
  structure). Format: `mysql://user:password@host:3306/dbname`.
- `SESSION_SECRET` — generate with `openssl rand -base64 32`.
- `S3_*` — upload storage. Cloudflare R2 is the simplest free option (10GB
  free); AWS S3 also works since you already use AWS elsewhere. See the
  comments in `.env.example` for both.

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

## Deploying to Hostinger (Managed Node.js Hosting, no VPS)

This project is configured to run on Hostinger's **Managed Node.js Web Apps
Hosting** — available on a Business web hosting plan or any Cloud plan.
No SSH/server management needed.

1. **Push this project to a GitHub repo** (private is fine).
2. **Create the database**: hPanel → Databases → MySQL Databases → create
   a database + user. Copy the connection details.
3. **Create the storage bucket**: sign up for Cloudflare R2 (free tier is
   plenty for logo/fleet/blog images), create a bucket, generate an API
   token, and enable public access (or bind a custom domain) for the
   bucket so uploaded images have public URLs.
4. **In hPanel**: Websites → Add Website → Deploy Web App → Import Git
   Repository → select this repo. Hostinger auto-detects Next.js.
5. **Add environment variables** in the app's Environment Variables tab:
   `DATABASE_URL` (mysql://... from step 2), `SESSION_SECRET`, and the five
   `S3_*` variables (from step 3).
6. **Deploy.** `npm install` triggers `prisma generate` automatically
   (via the `postinstall` script) — no database connection needed for
   this step, so it always succeeds even if the build container can't
   reach MySQL. Then `npm run build` runs `next build`. Migrations run
   separately, at startup (see below).
7. **Migrations run on startup**, not at build time: `npm start` runs
   `prisma migrate deploy && next start`. This matters because build
   containers often can't reach your database, but the running app
   container can — so migrations need to happen right before the server
   actually starts, not during the build step.
8. **Run the seed once**, either by temporarily adding a script that calls
   it on first deploy, or by connecting to the MySQL database directly
   (hPanel → phpMyAdmin) and inserting your first admin user by hand
   (email + bcrypt password hash + role).
9. **Connect your domain** to the Node.js app in hPanel.

### If the build fails with TypeScript "implicit any" errors

If you see errors like `Parameter 'x' implicitly has an 'any' type` at
Prisma query call sites during build, it means `prisma generate` didn't
run (or failed) before `next build` — an ungenerated Prisma Client falls
back to loose types, and `next build` fails hard on TypeScript errors.
Check the build log for the `postinstall` step specifically; if
`prisma generate` errored there (rather than just not running), that's
the actual thing to fix — the "implicit any" errors are a downstream
symptom, not the root cause.

### Why not SQLite or local-disk uploads here

Managed Node.js hosting runs your app in a rebuilt environment on every
deploy — anything written to the local filesystem at runtime (a SQLite
file, or images saved to `public/uploads/`) isn't guaranteed to survive
the next deploy. That's why this project uses MySQL (Hostinger's managed
database) and R2/S3 (external object storage) instead — both survive
redeploys and scale independently of the app container.

### If you'd rather use a VPS instead

Everything above still applies except step 3–4 — on a VPS you'd `git pull`
and run `npm run build && pm2 restart` yourself instead of connecting
GitHub through hPanel. SQLite would technically survive redeploys on a VPS
(you control the filesystem), but MySQL/Postgres is still recommended for
anything beyond a single low-traffic site.

