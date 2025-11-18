# Migration Summary: Supabase to MongoDB

This document summarizes the migration from Supabase to MongoDB that has been completed.

## Changes Made

### 1. Backend API Created
- **New Server**: Express.js server with MongoDB/Mongoose
- **Location**: `server/` directory
- **Features**:
  - JWT-based authentication
  - RESTful API endpoints
  - MongoDB models for all entities
  - Authentication middleware
  - Role-based access control

### 2. Database Models
All Supabase tables have been converted to MongoDB models:
- `User` (replaces `profiles` + auth)
- `Service`
- `Worker`
- `Booking`
- `Review`

### 3. Authentication System
- **Before**: Supabase Auth
- **After**: JWT tokens with bcrypt password hashing
- Tokens stored in localStorage
- Token-based API authentication

### 4. Frontend Updates
- **Removed**: `src/lib/supabase.ts`
- **Added**: `src/lib/api.ts` - New API client
- All pages updated to use new API:
  - `AuthContext.tsx`
  - `Services.tsx`
  - `BookService.tsx`
  - `UserDashboard.tsx`
  - `WorkerDashboard.tsx`
  - `AdminDashboard.tsx`

### 5. Environment Variables
- **Removed**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Added**: `VITE_API_URL`, `MONGODB_URI`, `JWT_SECRET`, `PORT`

### 6. Files Removed
- ✅ `src/lib/supabase.ts` - Deleted
- ⚠️ `supabase/` folder - Should be manually deleted (contains old migrations)

### 7. Files Added
- `server/index.js` - Express server
- `server/models/` - MongoDB models
- `server/routes/` - API routes
- `server/middleware/auth.js` - Auth middleware
- `server/seed.js` - Database seeder
- `src/lib/api.ts` - API client
- `.env.example` - Environment variables template
- `README.md` - Updated documentation

## Key Differences

### ID Fields
- **Supabase**: Used `id` (UUID)
- **MongoDB**: Uses `_id` (ObjectId)
- All frontend code updated to use `_id`

### Data Structure
- **Supabase**: Used joins with `.select('*, relation:table(*)')`
- **MongoDB**: Uses `.populate()` for references
- Frontend handles both populated and unpopulated data

### Authentication
- **Supabase**: Session-based with automatic token refresh
- **MongoDB**: JWT tokens stored in localStorage, manual refresh needed

## Next Steps

1. **Delete Supabase folder**:
   ```bash
   rm -rf supabase/
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set a secure `JWT_SECRET`

4. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

5. **Seed the database** (optional):
   ```bash
   node server/seed.js
   ```

6. **Start the servers**:
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

## API Endpoints

All endpoints are prefixed with `/api`:

- **Auth**: `/api/auth/signup`, `/api/auth/signin`
- **Profiles**: `/api/profiles/me`
- **Services**: `/api/services`, `/api/services/:id`
- **Workers**: `/api/workers`, `/api/workers/available/:category`
- **Bookings**: `/api/bookings/my-bookings`, `/api/bookings/my-jobs`, `/api/bookings`
- **Reviews**: `/api/reviews`

## Testing

1. Register a new user account
2. Login with credentials
3. Browse services
4. Create a booking
5. Test worker dashboard (register as worker)
6. Test admin dashboard (manually set role to 'admin' in MongoDB)

## Notes

- The migration maintains all existing functionality
- All Bolt AI indicators have been removed
- The codebase now uses standard MongoDB/Express patterns
- No Supabase-specific code remains in the frontend

