# Quick Setup Commands - Run These Manually

## Step 1: Install Backend Dependencies
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\server
npm install
```

## Step 2: Install Frontend Dependencies
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\client
npm install
```

## Step 3: Setup PostgreSQL Database

### Option A: Using Docker (Recommended - Easiest)
```powershell
docker run --name akhdarnas-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=akhdarnas -p 5432:5432 -d postgres:14
```

### Option B: Using Local PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Open SQL Shell (psql):
```sql
CREATE DATABASE akhdarnas;
\q
```

## Step 4: Configure Environment
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\server
copy .env.example .env
```

Edit `.env` file and update:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/akhdarnas"
```

## Step 5: Run Database Migrations
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\server
npx prisma generate
npx prisma migrate dev --name init
```

## Step 6: Seed Test Users
```powershell
npx ts-node prisma/seed.ts
```

This creates 3 test users:
- `admin@akhdar.com` / `admin123`
- `manager@akhdar.com` / `manager123`
- `employee@akhdar.com` / `employee123`

## Step 7: Start Backend Server
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\server
npm run start:dev
```

Wait for: `🚀 AkhdarNas API running on: http://localhost:3000`

## Step 8: Start Frontend (New Terminal)
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\client
npm run dev
```

## Step 9: Test Authentication
1. Open browser: http://localhost:5173
2. Login with: `admin@akhdar.com` / `admin123`
3. You should see the dashboard!

---

## Troubleshooting

### "Cannot connect to PostgreSQL"
- Check if PostgreSQL is running: `docker ps` (for Docker) or Task Manager (for local install)
- Verify DATABASE_URL in `.env` matches your setup

### "Module not found" errors
- Delete `node_modules` and run `npm install` again
- Make sure you ran `npx prisma generate`

### Port already in use
- Backend (3000): Change PORT in `server/.env`
- Frontend (5173): Change port in `client/vite.config.ts`

---

**Run the commands above in order, then let me know when both servers are running!**
