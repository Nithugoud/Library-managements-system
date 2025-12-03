# Library Management System - Setup Guide

## Quick Start Commands

### Using Docker (Easiest Method)
```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

Access:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
npm run start:dev
```

#### 2. Frontend Setup  
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

## Demo Credentials

**Admin:**
- Email: admin@library.com
- Password: admin123

**User:**
- Email: john.doe@example.com
- Password: password123

## Testing the API

### 1. Login and Get Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'
```

Save the token from the response.

### 2. Use Token for Protected Routes
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Swagger UI (Recommended for Testing)
1. Go to http://localhost:3000/api/docs
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Now you can test all endpoints!

## Common Issues

### Database Connection Error
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- For Docker: use `postgres` as hostname
- For local: use `localhost` as hostname

### Port Already in Use
- Backend (3000): Change PORT in backend/.env
- Frontend (5173): Change port in vite.config.ts
- Postgres (5432): Change port in docker-compose.yml

### Prisma Errors
```bash
# Reset everything
cd backend
npx prisma migrate reset
npx prisma generate
npm run prisma:seed
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT authentication
│   │   ├── users/         # User management
│   │   ├── authors/       # Author CRUD
│   │   ├── books/         # Book CRUD + filters
│   │   ├── borrowed-books/# Borrowing system
│   │   └── prisma/        # Database service
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Sample data
│
└── frontend/
    └── src/
        ├── components/    # Reusable UI components
        ├── pages/         # Page components
        ├── store/         # State management
        └── lib/           # API client

```

## Available Scripts

### Backend
- `npm run start:dev` - Development mode
- `npm run build` - Build for production
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)
- `npm run prisma:seed` - Add sample data

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Need Help?

1. Check the main README.md for detailed documentation
2. Visit Swagger docs at /api/docs
3. Check backend logs: `docker-compose logs backend`
4. Check frontend logs: `docker-compose logs frontend`

## Demo Video Checklist

✅ Login with demo credentials
✅ Show dashboard with stats
✅ Browse books with filters
✅ Add a new book
✅ Manage authors
✅ Borrow a book
✅ View borrowed books
✅ Return a book
✅ Show Swagger documentation
✅ Show mobile responsive design

Happy coding! 🚀
