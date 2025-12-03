# Library Management System

A full-stack library management application built with NestJS, PostgreSQL, Prisma, and React with TypeScript. This system provides comprehensive features for managing books, authors, users, and borrowing operations with JWT-based authentication.

##  Installation & Setup

### Option 1: Running with Docker (Recommended)

This is the easiest way to run the entire application with a single command.

```bash
# Clone the repository
git clone <repository-url>
cd "ONI project"

# Create environment files from examples
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services with Docker Compose
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost
# Backend API: http://localhost:3000
# Swagger Docs: http://localhost:3000/api
```

The Docker setup includes:
- PostgreSQL database
- Backend API server
- Frontend web application
- Automatic database migrations and seeding

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the following:
DATABASE_URL="postgresql://username:password@localhost:5432/library_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

4. **Setup PostgreSQL Database**

Option A: Using local PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE library_db;
\q
```

Option B: Using Docker for PostgreSQL only
```bash
docker run --name library-postgres \
  -e POSTGRES_USER=library_user \
  -e POSTGRES_PASSWORD=library_password \
  -e POSTGRES_DB=library_db \
  -p 5432:5432 \
  -d postgres:16-alpine

# Update .env with:
# DATABASE_URL="postgresql://library_user:library_password@localhost:5432/library_db?schema=public"
```

5. **Run Prisma migrations**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database schema
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

6. **Start the backend server**
```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend will be running at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

#### Frontend Setup

1. **Navigate to frontend directory (in a new terminal)**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# The default configuration should work:
VITE_API_URL=http://localhost:3000
```

4. **Start the development server**
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

##  Authentication & Testing

### Default Credentials

After seeding the database, you can use these credentials:

**Admin User:**
- Email: `admin@library.com`
- Password: `password123`
- Role: ADMIN

**Regular Users:**
- Email: `john.doe@example.com` / Password: `password123`
- Email: `jane.smith@example.com` / Password: `password123`

### Getting a JWT Token

**Method 1: Using the Frontend**
1. Go to `http://localhost:5173`
2. Click "Login"
3. Enter credentials
4. Token is automatically stored and used

**Method 2: Using cURL**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "password123"
  }'
```

**Method 3: Using Swagger UI**
1. Go to `http://localhost:3000/api`
2. Find the `/auth/login` endpoint
3. Click "Try it out"
4. Enter credentials and execute
5. Copy the `access_token` from the response
6. Click "Authorize" button at the top
7. Enter: `Bearer YOUR_TOKEN_HERE`


##  Project Structure

```
ONI project/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── authors/        # Authors module
│   │   ├── books/          # Books module
│   │   ├── borrowed-books/ # Borrowed books module
│   │   ├── prisma/         # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

**Note:** This application includes pre-seeded data for testing. Use the credentials provided in the Authentication section to get started immediately.

For questions or issues, please refer to the Swagger documentation at `http://localhost:3000/api` when running the application.
