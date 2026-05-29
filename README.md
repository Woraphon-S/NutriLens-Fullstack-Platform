This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local Development

### 1. Start the database

The app needs PostgreSQL. The quickest way is the bundled container (data is
seeded from [`init.sql`](./init.sql), including a demo account):

```bash
npm run db:up        # docker compose up -d postgres  (exposes localhost:5432)
```

> Already running the full stack with `docker compose up`? You can skip this —
> Postgres is included.

### 2. Run the dev server

Pick one:

```bash
npm run dev          # next dev (Turbopack) — hot-reloads files under src/
npm run dev:nodemon  # same, but nodemon also restarts on .env.local / config changes
```

Both serve on [http://localhost:3000](http://localhost:3000) (it falls back to
3001/3002 if the port is taken).

#### Why `dev:nodemon`?

`next dev` already hot-reloads everything under `src/`. What it does **not**
pick up automatically are env/config files — editing `.env.local` or
`next.config.ts` normally requires you to stop and restart the server. The
`dev:nodemon` script (configured in [`nodemon.json`](./nodemon.json)) watches
those files and restarts `next dev` for you, while leaving `src/` to Turbopack's
faster HMR.

### Demo account

```
email:    demo@nutrilens.ai
password: demo1234
```

(or click **"ลองใช้งานด้วยบัญชีทดลอง (Demo)"** on the login page)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
