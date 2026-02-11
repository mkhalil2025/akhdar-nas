# AkhdarNas - Setup & Installation Guide

## Overview
This guide will help you set up the AkhdarNas HR Portal on your local machine.

## Prerequisites Installed ✅
- ✅ Node.js v24.13.1
- ⏳ PostgreSQL 14+ (Required)
- ⏳ Git (Required)

---

## Quick Start

### 1. Navigate to Project Directory
```powershell
cd C:\Khalil\Akhdar\NasAkhdar
```

### 2. Install Backend Dependencies
```powershell
cd server
npm install
```

### 3. Set Up PostgreSQL Database
You need a running PostgreSQL instance. Options:

**Option A: Install PostgreSQL Locally**
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings (remember the password!)
3. Create a database:
```powershell
# Open psql (comes with PostgreSQL)
psql -U postgres
CREATE DATABASE akhdarnas;
\q
```

**Option B: Use Docker (Easier)**
```powershell
docker run --name akhdarnas-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=akhdarnas -p 5432:5432 -d postgres:14
```

### 4. Configure Environment Variables
```powershell
# Copy the example env file
cd C:\Khalil\Akhdar\NasAkhdar\server
copy .env.example .env

# Edit .env and update:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/akhdarnas"
# JWT_SECRET="your-strong-random-secret-here"
```

### 5. Run Database Migrations
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\server
npm run prisma:generate
npm run prisma:migrate
```

### 6. Seed Database (Optional - Creates Admin User)
Create `server/prisma/seed.ts`:
```typescript
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@akhdar.com' },
    update: {},
    create: {
      email: 'admin@akhdar.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  
  console.log('✅ Admin user created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```powershell
npx ts-node prisma/seed.ts
```

### 7. Start Backend Server
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\server
npm run start:dev
```

You should see:
```
🚀 AkhdarNas API running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
📦 Database connected
```

### 8. Install Frontend Dependencies
```powershell
cd C:\Khalil\Akhdar\NasAkhdar\client
npm install
```

### 9. Start Frontend
```powershell
npm run dev
```

Frontend will run on: http://localhost:5173

---

## What's Already Built

### Backend (NestJS) ✅
- ✅ **Prisma Schema**: 9 models (User, Department, LeaveRequest, LeaveBalance, Holiday, Attachment, Survey360, Notification, AuditLog)
- ✅ **Auth Module**: JWT authentication with bcrypt password hashing
- ✅ **RBAC System**: @Roles decorator + guards (ADMIN/MANAGER/EMPLOYEE)
- ✅ **Security**: 
  - Rate limiting (5 login attempts/minute)
  - Helmet.js middleware
  - Input validation (class-validator)
  - Blocks INACTIVE users
- ✅ **Swagger API Docs**: Auto-generated at `/api/docs`

### Frontend (React + Vite) ⏳
- ⏳ Needs scaffolding (coming next)

---

## Next Steps

1. **Run the Commands Above** to get the backend running
2. **Test the API**:
   - Open: http://localhost:3000/api/docs
   - Try the `POST /auth/login` endpoint
   - Use: `admin@akhdar.com` / `admin123`
3. **Let me know when the backend is running**, and I'll scaffold the React frontend with Material UI

---

## Project Structure (Current)

```
NasAkhdar/
├── server/
│   ├── src/
│   │   ├── main.ts (Entry point with Swagger, CORS, Security)
│   │   ├── app.module.ts (Root module with rate limiting, events)
│   │   ├── prisma/ (Database service)
│   │   ├── common/
│   │   │   ├── decorators/ (@CurrentUser, @Roles)
│   │   │   └── guards/ (JwtAuthGuard, RolesGuard)
│   │   └── modules/
│   │       └── auth/ (Login, JWT strategy)
│   ├── prisma/
│   │   └── schema.prisma (Full database schema)
│   ├── package.json
│   └── .env.example
├── client/ (To be created)
├── README.md
└── .gitignore
```

---

## Troubleshooting

### "Module not found" errors
```powershell
cd server
rm -r node_modules
npm install
```

### Database connection failed
- Verify PostgreSQL is running: `psql -U postgres -d akhdarnas`
- Check `.env` DATABASE_URL matches your PostgreSQL credentials

### Port 3000 already in use
- Change PORT in `.env` to 3001 or another free port

---

**Ready for the next phase!** Run the steps above and confirm the backend is live.
