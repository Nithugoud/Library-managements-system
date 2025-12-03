# 🚀 Quick Reference Card

## 📦 Installation

```bash
# With Docker (Easiest)
docker-compose up -d

# Manual Backend
cd backend && npm install
npm run prisma:migrate && npm run prisma:seed
npm run start:dev

# Manual Frontend
cd frontend && npm install
npm run dev
```

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 (dev) or http://localhost:80 (docker) |
| Backend API | http://localhost:3000 |
| Swagger Docs | http://localhost:3000/api/docs |
| Prisma Studio | `npm run prisma:studio` |

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@library.com | admin123 |
| User | john.doe@example.com | password123 |
| User | jane.smith@example.com | password123 |

## 📡 Key API Endpoints

### Public
- `POST /auth/register` - Register
- `POST /auth/login` - Login (get token)
- `GET /books` - List books
- `GET /authors` - List authors

### Protected (requires Bearer token)
- `POST /books` - Create book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book
- `POST /borrowed-books/borrow` - Borrow book
- `PATCH /borrowed-books/:id/return` - Return book
- `GET /borrowed-books/user/:userId` - User's books

## 🎨 Tech Stack

### Backend
- NestJS
- Prisma
- PostgreSQL
- JWT
- Swagger

### Frontend
- React 18
- TypeScript
- TailwindCSS
- React Query
- Zustand
- React Router
- React Hook Form

## 🐳 Docker Commands

```bash
# Start all
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down

# Rebuild
docker-compose up --build

# Clean slate
docker-compose down -v
```

## 🔧 Useful Commands

### Backend
```bash
npm run start:dev          # Dev mode
npm run prisma:studio      # DB GUI
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed data
npm run build              # Production build
```

### Frontend
```bash
npm run dev       # Dev server
npm run build     # Production build
npm run preview   # Preview build
```

## 📝 Testing Flow

1. Login → Get JWT token
2. Create Author → Save author ID
3. Create Book → Use author ID
4. Create User → Save user ID
5. Borrow Book → Use user ID & book ID
6. Return Book → Use borrowed book ID

## 🎬 Demo Script

1. **Login** - Show authentication
2. **Dashboard** - Display statistics
3. **Books** - Search, filter, paginate
4. **Add Book** - Show form validation
5. **Authors** - CRUD operations
6. **Borrow** - Complete borrowing flow
7. **Return** - Return book
8. **Swagger** - API documentation
9. **Mobile** - Responsive design

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Change port in config files |
| DB connection error | Check DATABASE_URL in .env |
| Prisma errors | Run `npx prisma generate` |
| Token expired | Login again |
| Dependencies error | Delete node_modules, reinstall |

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP.md** - Quick setup
- **POSTMAN.md** - API testing
- **DELIVERABLES.md** - Project summary

## ✨ UI Features

- Gradient backgrounds
- Glassmorphism cards
- Smooth animations
- Hover effects
- Toast notifications
- Loading states
- Form validation
- Mobile responsive

## 🎯 Bonus Features Implemented

✅ Swagger documentation
✅ Advanced filtering
✅ Pagination
✅ Beautiful UI
✅ Docker setup
✅ State management
✅ Responsive design
✅ Animations
✅ Form validation
✅ Toast notifications
✅ Dashboard stats
✅ Seed data

## 📈 Project Stats

- **Backend Files**: 20+
- **Frontend Files**: 15+
- **API Endpoints**: 20+
- **Database Models**: 4
- **UI Pages**: 7
- **Lines of Code**: 3000+

## 🏆 Assignment Requirements

✅ NestJS backend
✅ Postgres + Prisma
✅ React TypeScript frontend
✅ Books CRUD + filters
✅ Authors CRUD
✅ Users CRUD
✅ Borrowing flows
✅ JWT authentication
✅ Docker
✅ .env.example
✅ README

## 💡 Tips

- Use Swagger UI for easy API testing
- Check browser console for errors
- Use React DevTools for debugging
- Prisma Studio for database inspection
- Check Docker logs if services fail

---

**Need help?** Check the full README.md!

🚀 **Ready to impress!**
