# PlanetScale PostgreSQL Setup Guide

## Step 1: Create a PlanetScale Account

1. Go to https://app.planetscale.com/
2. Sign up (free tier available)
3. Create a new PostgreSQL database

## Step 2: Get Your Connection String

1. In PlanetScale dashboard, go to your database
2. Click **Connect**
3. Select **Prisma** from the dropdown
4. Copy the connection string (looks like):
   ```
   postgresql://username:password@host/database?sslaccept=strict
   ```

## Step 3: Set Environment Variables

### Local Development (.env.local)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/one_app"
```

### Production (Vercel)
1. Go to https://vercel.com/dashboard
2. Select your **one-app** project
3. Click **Settings** → **Environment Variables**
4. Add/Update `DATABASE_URL` with your PlanetScale connection string
5. Set for `Production`, `Preview`, and `Development`

## Step 4: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create/update database schema
npx prisma db push

# Seed data (optional)
npm run seed
```

## Step 5: Deploy to Vercel

```bash
git add .
git commit -m "Switch to PlanetScale PostgreSQL"
git push origin main
```

Vercel will automatically deploy with the new DATABASE_URL.

## Local Development Setup

If you want to use PostgreSQL locally:

### Option A: Docker (Easiest)
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=one_app \
  -p 5432:5432 \
  postgres:latest
```

### Option B: Install PostgreSQL Locally
- Windows: Download from https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt install postgresql`

Then create database:
```bash
createdb -U postgres one_app
```

## Troubleshooting

### Can't connect to PlanetScale
- Verify connection string is correct
- Check PlanetScale IP whitelist allows your IP
- For Vercel, PlanetScale automatically allows it

### Schema migration fails
```bash
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma db push
```

### Prisma client errors
```bash
npx prisma generate
npm install
```

## Benefits of PlanetScale

✅ Free PostgreSQL database (up to 10GB)
✅ Zero IP whitelisting issues
✅ Works perfectly with Vercel
✅ Built-in backup and restore
✅ Scalable for production
✅ Better for TypeScript/Node.js projects
