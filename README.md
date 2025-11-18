<<<<<<< HEAD
# HomeEase - Professional Home Services Platform

A full-stack home service booking platform built with React, Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (JWT-based)
- Service catalog management
- Booking system for customers
- Worker dashboard for service providers
- Admin dashboard for system management
- Worker verification system
- Review and rating system

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HomeEase-main
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/homeease
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

4. Seed the database (optional)
```bash
node server/seed.js
```

5. Start the development server

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
HomeEase-main/
├── server/              # Backend API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── index.js         # Server entry point
│   └── seed.js          # Database seeder
├── src/                 # Frontend React app
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── lib/             # API client
│   ├── pages/           # Page components
│   └── main.tsx         # App entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Profiles
- `GET /api/profiles/me` - Get current user profile
- `PUT /api/profiles/me` - Update profile

### Services
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/all` - Get all services (admin only)

### Workers
- `GET /api/workers` - Get all verified workers
- `GET /api/workers/available/:category` - Get available workers by category
- `PATCH /api/workers/:id/verification` - Update worker verification (admin only)

### Bookings
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/my-jobs` - Get worker's jobs
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id/status` - Update booking status

## Default Test Accounts

After seeding, you can create test accounts through the registration page:

1. **Customer Account**
   - Email: user@test.com
   - Password: password123

2. **Worker Account**
   - Email: worker@test.com
   - Password: password123

3. **Admin Account**
   - Register as a regular user, then manually update the role in MongoDB:
   ```javascript
   db.users.updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } })
   ```

## Development

### Running in Development Mode

Backend with auto-reload:
```bash
npm run dev:server
```

Frontend:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port (default: 3001)
- `VITE_API_URL` - Frontend API base URL

## License

MIT

=======
# HomeEase - Professional Home Services Platform

A full-stack home service booking platform built with React, Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (JWT-based)
- Service catalog management
- Booking system for customers
- Worker dashboard for service providers
- Admin dashboard for system management
- Worker verification system
- Review and rating system

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HomeEase-main
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/homeease
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

4. Seed the database (optional)
```bash
node server/seed.js
```

5. Start the development server

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
HomeEase-main/
├── server/              # Backend API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── index.js         # Server entry point
│   └── seed.js          # Database seeder
├── src/                 # Frontend React app
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── lib/             # API client
│   ├── pages/           # Page components
│   └── main.tsx         # App entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Profiles
- `GET /api/profiles/me` - Get current user profile
- `PUT /api/profiles/me` - Update profile

### Services
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/all` - Get all services (admin only)

### Workers
- `GET /api/workers` - Get all verified workers
- `GET /api/workers/available/:category` - Get available workers by category
- `PATCH /api/workers/:id/verification` - Update worker verification (admin only)

### Bookings
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/my-jobs` - Get worker's jobs
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id/status` - Update booking status

## Default Test Accounts

After seeding, you can create test accounts through the registration page:

1. **Customer Account**
   - Email: user@test.com
   - Password: password123

2. **Worker Account**
   - Email: worker@test.com
   - Password: password123

3. **Admin Account**
   - Register as a regular user, then manually update the role in MongoDB:
   ```javascript
   db.users.updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } })
   ```

## Development

### Running in Development Mode

Backend with auto-reload:
```bash
npm run dev:server
```

Frontend:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port (default: 3001)
- `VITE_API_URL` - Frontend API base URL

## License

MIT

>>>>>>> 7b46e9e (Initial commit)
