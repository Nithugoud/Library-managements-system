# Library Management System

A full-stack library management system built with NestJS, PostgreSQL, Prisma, and React with a beautiful, modern UI.

## 🎯 Features

### Backend (NestJS + Prisma + PostgreSQL)
- ✅ **Complete CRUD Operations** for Books, Authors, and Users
- ✅ **JWT Authentication** for secure API access
- ✅ **Borrowing System** with return tracking
- ✅ **Advanced Filtering** for books (search, author, genre, availability, date ranges, pagination)
- ✅ **Swagger/OpenAPI Documentation** at `/api/docs`
- ✅ **Database Migrations** with Prisma
- ✅ **Seeded Data** for quick testing
- ✅ **Docker Support** for easy deployment

### Frontend (React + TypeScript + TailwindCSS)
- ✅ **Beautiful, Modern UI** with gradient effects and animations
- ✅ **Responsive Design** works on desktop and mobile
- ✅ **State Management** with Zustand
- ✅ **API Integration** with React Query
- ✅ **Protected Routes** with authentication
- ✅ **Form Validation** with React Hook Form
- ✅ **Toast Notifications** for user feedback
- ✅ **Dashboard** with statistics and recent books

## 🏗️ Architecture

```
library-management-system/
├── backend/                 # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   ├── src/
│   │   ├── auth/           # JWT authentication
│   │   ├── users/          # User management
│   │   ├── authors/        # Author CRUD
│   │   ├── books/          # Book CRUD with filtering
│   │   ├── borrowed-books/ # Borrowing system
│   │   └── prisma/         # Prisma service
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   └── lib/           # API client
│   ├── Dockerfile
│   └── .env.example
│
└── docker-compose.yml     # Full stack orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL 14+ (or use Docker)
- npm or yarn

### Option 1: Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd library-management-system
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api/docs
   - PostgreSQL: localhost:5432

### Option 2: Running Locally

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/library_db?schema=public"
   JWT_SECRET="your-secret-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start the backend server**
   ```bash
   npm run start:dev
   ```

   The backend will be running at http://localhost:3000
   Swagger docs available at http://localhost:3000/api/docs

#### Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be running at http://localhost:5173

## 🔐 Authentication

### Demo Credentials

**Admin Account:**
- Email: `admin@library.com`
- Password: `admin123`

**Regular User:**
- Email: `john.doe@example.com`
- Password: `password123`

### Getting a JWT Token

#### Using Swagger UI
1. Go to http://localhost:3000/api/docs
2. Find the `/auth/login` endpoint
3. Click "Try it out"
4. Enter credentials and execute
5. Copy the token from the response
6. Click "Authorize" button at top
7. Enter: `Bearer <your-token>`

#### Using cURL
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

#### Using the Frontend
1. Navigate to http://localhost:5173/login
2. Enter demo credentials
3. Token is automatically stored and used for API calls

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user (returns JWT token)

### Books
- `GET /books` - List books (with optional filters)
  - Query params: `search`, `authorId`, `genre`, `available`, `publishedAfter`, `publishedBefore`, `page`, `limit`
- `GET /books/:id` - Get book details
- `POST /books` - Create new book (protected)
- `PATCH /books/:id` - Update book (protected)
- `DELETE /books/:id` - Delete book (protected)

### Authors
- `GET /authors` - List all authors
- `GET /authors/:id` - Get author details with books
- `POST /authors` - Create author (protected)
- `PATCH /authors/:id` - Update author (protected)
- `DELETE /authors/:id` - Delete author (protected)

### Users
- `GET /users` - List all users (protected)
- `GET /users/:id` - Get user details (protected)
- `POST /users` - Create user (protected)

### Borrowed Books
- `POST /borrowed-books/borrow` - Borrow a book (protected)
- `PATCH /borrowed-books/:id/return` - Return a book (protected)
- `GET /borrowed-books/user/:userId` - Get user's borrowed books (protected)
- `GET /borrowed-books` - List all borrowed books (protected)

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  borrowedBooks BorrowedBook[]
}

model Author {
  id        String   @id @default(uuid())
  name      String
  biography String?
  birthDate DateTime?
  country   String?
  books     Book[]
}

model Book {
  id              String   @id @default(uuid())
  title           String
  isbn            String   @unique
  description     String?
  publishedDate   DateTime?
  totalCopies     Int
  availableCopies Int
  genre           String?
  coverImage      String?
  authorId        String
  author          Author
  borrowedBooks   BorrowedBook[]
}

model BorrowedBook {
  id         String       @id @default(uuid())
  borrowDate DateTime     @default(now())
  dueDate    DateTime
  returnDate DateTime?
  status     BorrowStatus @default(BORROWED)
  userId     String
  user       User
  bookId     String
  book       Book
}
```

## 🎨 UI Features

The frontend includes:
- **Modern Gradient Design** with glassmorphism effects
- **Smooth Animations** on page transitions and interactions
- **Responsive Layout** that works on all screen sizes
- **Beautiful Cards** with hover effects
- **Interactive Dashboard** with statistics
- **Form Validation** with inline error messages
- **Toast Notifications** for success/error feedback
- **Loading States** for better UX
- **Protected Routes** with automatic redirects

## 🧪 Testing the Application

### 1. Authentication Flow
```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login (save the token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Book Operations
```bash
# List books with filters
curl http://localhost:3000/books?genre=Fantasy&available=true&page=1&limit=10

# Get specific book
curl http://localhost:3000/books/<book-id>

# Create new book (requires token)
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "isbn": "978-1234567890",
    "totalCopies": 3,
    "genre": "Fiction",
    "authorId": "<author-id>"
  }'
```

### 3. Borrowing Flow
```bash
# Borrow a book
curl -X POST http://localhost:3000/borrowed-books/borrow \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-id>",
    "bookId": "<book-id>",
    "dueDate": "2024-12-31"
  }'

# Return a book
curl -X PATCH http://localhost:3000/borrowed-books/<borrowed-book-id>/return \
  -H "Authorization: Bearer <your-token>"

# Get user's borrowed books
curl http://localhost:3000/borrowed-books/user/<user-id> \
  -H "Authorization: Bearer <your-token>"
```

## 🔧 Development Commands

### Backend
```bash
npm run start:dev      # Start in watch mode
npm run build          # Build for production
npm run start:prod     # Run production build
npm run prisma:studio  # Open Prisma Studio (DB GUI)
npm run prisma:migrate # Run migrations
npm run prisma:seed    # Seed database
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# Remove volumes (clean database)
docker-compose down -v
```

## 📦 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **Swagger** - API documentation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **React Router** - Routing
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 🎯 Design Decisions

### Backend Architecture
1. **Modular Structure**: Each feature (books, authors, users, etc.) is in its own module for maintainability
2. **DTO Validation**: All inputs are validated using class-validator decorators
3. **JWT Strategy**: Stateless authentication for scalability
4. **Prisma ORM**: Type-safe database queries and automatic migrations
5. **Transaction Support**: Critical operations use database transactions (borrowing/returning books)

### Frontend Architecture
1. **Component-Based**: Reusable components for consistency
2. **State Management**: Zustand for auth, React Query for server state
3. **API Abstraction**: Centralized API client with interceptors
4. **Form Handling**: React Hook Form for performance and validation
5. **Protected Routes**: HOC pattern for route protection

### Database Design
1. **UUIDs**: Using UUIDs for primary keys for better scalability
2. **Cascading Deletes**: When an author/book is deleted, related records are cleaned up
3. **Soft Status**: BorrowedBook uses status enum instead of hard deletes
4. **Indexes**: Unique constraints on email and ISBN for data integrity

## 🚀 Production Deployment

### Using Supabase (PostgreSQL)
1. Create a Supabase project at https://supabase.com
2. Copy the connection string
3. Update `DATABASE_URL` in backend `.env`
4. Run migrations: `npm run prisma:migrate`
5. Seed data: `npm run prisma:seed`

### Using Docker
1. Configure environment variables in `docker-compose.yml`
2. Run: `docker-compose up -d`
3. Access via configured ports

### Environment Variables (Production)
```env
# Backend
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-strong-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000

# Frontend
VITE_API_URL="https://your-api-domain.com"
```

## 🔒 Security Considerations

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Expiration**: Tokens expire after 7 days
3. **Input Validation**: All inputs validated with class-validator
4. **SQL Injection Protection**: Prisma provides parameterized queries
5. **CORS Configuration**: Configured for specific origins
6. **Protected Routes**: Sensitive operations require authentication

## 📝 Known Limitations & Future Enhancements

### Current Limitations
- No email verification on registration
- No password reset functionality
- No role-based access control (all authenticated users have same permissions)
- No book reservation system
- No late fee calculation

### Potential Enhancements
- Add email notifications for due dates
- Implement book reviews and ratings
- Add advanced search with full-text search
- Implement book recommendations
- Add export functionality (CSV, PDF)
- Implement audit logs
- Add real-time notifications with WebSockets
- Implement multi-language support

## 🤝 Contributing

This is an assignment project. For production use, consider:
1. Adding comprehensive tests (unit, integration, e2e)
2. Implementing proper error handling
3. Adding rate limiting
4. Implementing logging
5. Setting up CI/CD pipeline
6. Adding monitoring and analytics

## 📄 License

MIT

## 👤 Author

Built as part of a Full-Stack Intern Assignment

---

## 📹 Demo Video Script

To create your demo video, show:

1. **Login** with demo credentials
2. **Dashboard** showing statistics
3. **Books page** with filtering and search
4. **Add a new book** (show the form)
5. **Authors page** with CRUD operations
6. **Users page** showing all users
7. **Borrow a book** flow
8. **My Borrowed Books** page
9. **Return a book**
10. **Swagger documentation** at /api/docs
11. **Mobile responsive** view

Record for 3-5 minutes focusing on key features and the beautiful UI!

---

**Note**: This project demonstrates production-ready code structure, but for actual production deployment, implement additional security measures, comprehensive testing, and proper monitoring.
