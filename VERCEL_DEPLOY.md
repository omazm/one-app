# Vercel + InfinityFree MySQL Deployment Guide

## Steps to Deploy on Vercel

### 1. Get Your InfinityFree Credentials

1. Go to https://sql101.infinityfree.com/
2. Click "Create Database"
3. Copy your credentials:
   - **Hostname** (usually starts with `sql101.`)
   - **Username**
   - **Password**
   - **Database Name**

### 2. Update `.env`

Replace the placeholders in `.env`:

```env
DATABASE_URL="mysql://YOUR_INFINITY_USERNAME:YOUR_INFINITY_PASSWORD@YOUR_INFINITY_HOST:3306/YOUR_INFINITY_DATABASE"
```

**Example:**
```env
DATABASE_URL="mysql://adminuser:MySecurePass123@sql101.infinityfree.com:3306/my_ats_db"
```

### 3. Prepare for Vercel

Make sure you have:
- ✅ GitHub repository synced
- ✅ `.env.local` for local development (already created)
- ✅ `.env` with InfinityFree credentials

### 4. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Using GitHub**
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. In "Environment Variables", add:
   ```
   DATABASE_URL = mysql://username:password@sql101.infinityfree.com:3306/database_name
   ```
5. Click Deploy

### 5. Run Database Migrations

After deployment, run Prisma migrations:

```bash
vercel env pull  # Pull environment variables
npx prisma migrate deploy
npm run seed  # Optional: seed initial data
```

Or use Vercel function to run migrations:

```bash
# Create a migration after schema changes
npx prisma migrate dev --name your_migration_name

# Deploy migration
npx prisma migrate deploy
```

## Important Notes

⚠️ **Security:**
- Never commit `.env` to Git (it's in `.gitignore`)
- Use Vercel's Environment Variables for production secrets
- Don't share your InfinityFree credentials

⚠️ **Connection Issues:**
- InfinityFree may have IP whitelist restrictions
- Make sure your Vercel project is whitelisted
- Check InfinityFree control panel for connection restrictions

⚠️ **Database Limitations:**
- InfinityFree has file size limits (~1GB)
- Check your usage regularly
- Monitor connection limits

## Troubleshooting

### Connection Timeout
```bash
# Test your connection string
npx prisma db execute --stdin < /dev/null
```

### Schema Out of Sync
```bash
# Reset and re-apply schema
npx prisma migrate reset
npx prisma migrate deploy
npm run seed
```

### Vercel Build Fails
1. Check build logs in Vercel dashboard
2. Ensure `DATABASE_URL` is set in Vercel Environment Variables
3. Make sure Prisma Client is generated: `npx prisma generate`

## Local vs Production

**Local (.env.local)**
```
DATABASE_URL="mysql://root:root@localhost:3306/one_app"
```

**Production (.env via Vercel)**
```
DATABASE_URL="mysql://infinityuser:pass@sql101.infinityfree.com:3306/db"
```

Node.js will automatically use the correct one based on the environment!
