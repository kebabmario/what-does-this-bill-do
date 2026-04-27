# What does this bill do?

Tracks U.S. bills in plain language. The app ingests data from Congress.gov, stores it with Prisma + PostgreSQL, and provides a clean UI to browse bills, statuses, dates, and sources.

## Tech Stack

- Next.js (App Router) + TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Vercel (deployment + cron)

## Features

- Bills list page (`/bills`)
- Bill detail page (`/bills/[id]`)
- REST API (`/api/bills`, `/api/bills/[id]`)
- Ingestion endpoint (`/api/ingest`) with secret auth
- Scheduled ingestion support via Vercel Cron

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_pooled_postgres_url"
DIRECT_URL="your_direct_postgres_url"
INGEST_SECRET="your_secret"
PROVIDER_API_KEY="your_congress_gov_api_key"
```

## Getting Started

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

(Optional) Seed local sample data:

```bash
npm run seed
```

Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Ingest Data Manually

```bash
curl -X POST http://localhost:3000/api/ingest -H "Authorization: Bearer YOUR_INGEST_SECRET"
```

## Deploy (Vercel)

1. Push repo to GitHub
2. Import project in Vercel
3. Add env vars in Vercel project settings
4. (Optional) Add `vercel.json` cron config:
   ```json
   {
     "crons": [{ "path": "/api/ingest", "schedule": "0 9 * * *" }]
   }
   ```

## License

MIT