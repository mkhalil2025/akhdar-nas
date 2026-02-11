# AkhdarNas - Internal HR Portal

<div align="center">
  <img src="./logo.png" alt="AkhdarNas Logo" width="400"/>
</div>

## Overview
**AkhdarNas** (ناس أخضر) is a comprehensive internal Human Resources management system for Akhdar. Built with modern technologies, it streamlines employee management, leave workflows, document archiving, 360 feedback surveys, and real-time notifications.

## Features
- 🏢 **Hierarchical Employee Management**: Role-based access (Admin/Manager/Employee) with org structure
- 📅 **Leave Management**: Request/Approval workflow with balance tracking and holiday exclusions
- 📁 **Digital Archive**: Multi-cloud document storage (Local/Azure/AWS S3)
- 📊 **360 Feedback Surveys**: Anonymous/attributed performance reviews
- 🔔 **Real-Time Notifications**: SSE-based instant messaging system
- 🔐 **Security Hardening**: bcrypt, JWT, rate limiting, XSS protection, audit logging

## Tech Stack
- **Backend**: NestJS (TypeScript) + Prisma ORM + PostgreSQL
- **Frontend**: React (Vite) + TypeScript + Material UI
- **Architecture**: Monolithic Monorepo
- **Auth**: JWT with RBAC Guards
- **Storage**: Strategy Pattern (Local/Azure/S3)

## Project Structure
```
NasAkhdar/
├── client/          # React frontend (Vite + MUI)
├── server/          # NestJS backend
├── prisma/          # Database schema and migrations
└── uploads/         # Local file storage (dev only)
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/mkhalil2025/akhdar-nas.git
cd akhdar-nas

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup
Create `.env` files in both `client/` and `server/`:

**server/.env**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/akhdarnas"
JWT_SECRET="your-strong-secret-key"
JWT_EXPIRES_IN="1h"
STORAGE_DRIVER="LOCAL"
STORAGE_PATH="./uploads"
```

**client/.env**:
```env
VITE_API_URL="http://localhost:3000"
```

### Running the Application
```bash
# Terminal 1: Backend
cd server
npm run start:dev

# Terminal 2: Frontend
cd client
npm run dev
```

Access the app at `http://localhost:5173`

## Design Patterns
- **Strategy Pattern**: Multi-cloud storage abstraction
- **Observer Pattern**: Event-driven leave approvals and notifications
- **Repository Pattern**: Service-based database access
- **Decorator Pattern**: Custom auth guards (`@Roles()`, `@CurrentUser()`)

## Security Features
- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication
- Rate limiting on login (5 attempts/min)
- XSS protection via input validation
- File upload validation (type, size, MIME)
- Audit logging for sensitive actions
- Helmet.js security headers

## License
Private - Internal use only for Akhdar
