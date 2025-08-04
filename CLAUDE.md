# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Commonality** is a full-stack social networking application that connects users based on shared interests. The application features user matching, group creation, messaging, and interest-based discovery.

### Tech Stack
- **Backend**: Express.js with TypeScript, PostgreSQL, Redis sessions
- **Frontend**: React Router 7 with TypeScript, TailwindCSS, Flowbite React UI
- **Database**: PostgreSQL with spatial features (Haversine function for location-based matching)
- **Deployment**: Docker containers with docker-compose orchestration

## Architecture

### Backend Structure (`backend/src/`)
- **App.ts**: Express server configuration with Redis session store
- **API Routes** (`apis/`): RESTful endpoints organized by domain
  - `users/`: User profile management
  - `interests/`: Interest CRUD operations
  - `matching/`: User matching system
  - `message/`: Direct messaging
  - `groups/`: Group creation/management
  - `group-interests/`: Group interest associations
- **Models**: Domain models with PostgreSQL integration
- **Utils**: Authentication, database utilities, response formatting

### Frontend Structure (`frontend/app/`)
- **Routes**: React Router v7 file-based routing (`routes/`)
- **Components**: Reusable UI components (`components/`)
- **Layouts**: Navigation, messaging, and footer layouts
- **Utils**: Actions, loaders, and utilities for data management
- **Models**: TypeScript interfaces and schemas

## Database Schema

### Core Entities
- **Users**: Profile, authentication, location (lat/lng)
- **Interests**: Pre-defined categories (Gaming, Hiking, Coding, etc.)
- **User-Interests**: Many-to-many relationship
- **Matches**: User-to-user matching with acceptance status
- **Messages**: Direct messaging between users
- **Groups**: User-created groups with admin/member relationships
- **Group-Interests**: Group interest associations

### Key Features
- Location-based matching using Haversine SQL function
- Session-based authentication with Redis
- Image uploads via Cloudinary
- Email activation via Mailgun

## Development Commands

### Backend
```bash
# Start backend development server
cd backend && npm run dev

# Lint backend code
npm run lint

# Fix linting issues
npm run clean
```

### Frontend
```bash
# Start frontend development server
cd frontend && npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

### Docker Development
```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up

# Rebuild services
docker-compose up --build

# View logs
docker-compose logs -f
```

### Database
```bash
# Connect to PostgreSQL
docker exec -it commonality-sql-1 psql -U commonality -d commonality

# Reset database (rebuild containers)
docker-compose down -v && docker-compose up --build
```

## Key Files

### Configuration
- `project.env`: Environment variables (not in repo)
- `docker-compose.yml`: Service orchestration
- `backend/tsconfig.json`: TypeScript configuration
- `frontend/vite.config.ts`: Build configuration

### Entry Points
- **Backend**: `backend/src/index.ts:4200`
- **Frontend**: `frontend/app/root.tsx` (React Router root)

### Critical Utilities
- **Authentication**: `backend/src/utils/auth.utils.ts`
- **Database**: `backend/src/utils/database.utils.ts`
- **Session**: `frontend/app/utils/session.server.ts`
- **Cloudinary**: `frontend/app/utils/cloudinary.server.ts`

## Development Notes

### Ports
- Backend: 4200
- Frontend: 5173 (dev), 3000 (production)
- PostgreSQL: 5432 (internal)
- Redis: 6379 (internal)

### Environment Variables Required
```
# From project.env
DATABASE_URL
REDIS_URL
SESSION_SECRET
CLOUDINARY_URL
MAILGUN_DOMAIN
MAILGUN_API_KEY
```

### Testing Approach
- Backend: No test framework configured (`npm test` exits with error)
- Frontend: TypeScript type checking with `npm run typecheck`

### Deployment
- Docker containers for all services
- Frontend builds to static assets served by Node.js
- Backend serves API on port 4200
- PostgreSQL and Redis as backing services