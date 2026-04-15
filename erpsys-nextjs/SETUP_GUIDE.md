# 🚀 ERP System Setup Guide

> Complete guide to set up and run the Smart Class Tracker ERP System locally or in production.

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **npm** v9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com))
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Groq API Account** ([Sign up free](https://console.groq.com))

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-repo/Smart-Class-Tracker.git
cd Smart-Class-Tracker/erpsys-nextjs
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages from `package.json`:
- Next.js 16
- React 19
- Prisma ORM
- Tailwind CSS
- Groq SDK
- And more...

---

## Step 3: Set Up Environment Variables

### Create `.env.local` file

```bash
# Linux/Mac
touch .env.local

# Windows
echo. > .env.local
```

### Add the following content:

```bash
# ========== DATABASE ==========
# MongoDB Atlas Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/databasename
DATABASE_URL="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/studentdb"

# ========== AUTHENTICATION ==========
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="a7f3c9e2b1d4f6a8c5e9b2d7f1a4c6e9b3d5f8a1c4e7b9d2f5a8c1e4b7d0f3"
JWT_EXPIRATION="7d"

# ========== APP ==========
NEXT_PUBLIC_API_URL="http://localhost:3000"

# ========== GROQ AI ==========
# Get from: https://console.groq.com/keys
GROQ_API_KEY="gsk_your-api-key-here"
GROQ_MODEL="mixtral-8x7b-32768"
```

---

## Step 4: Get Required API Keys

### MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" (free tier available)
3. Create a cluster
4. Click "Connect" → "Drivers"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<databasename>` with your values
7. Add to `.env.local` as `DATABASE_URL`

### Groq API

1. Go to https://console.groq.com/keys
2. Log in or create account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env.local` as `GROQ_API_KEY`

### JWT Secret

Generate a secure random string:

```bash
# Mac/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add to `.env.local` as `JWT_SECRET`

---

## Step 5: Initialize Database

### Push Prisma Schema to MongoDB

```bash
npx prisma db push
```

This creates:
- User collection
- Student collection
- Instructor collection
- Department collection
- Course collection
- Class collection
- Semester collection
- Assessment collection
- Enrollment collection
- StudentMark collection

### Seed Sample Data

```bash
npm run db:seed
```

This creates:
- **Admin user:** `admin` / `admin123`
- **Student user:** `student001` / `student123`
- Sample departments, instructors, courses, classes, etc.

---

## Step 6: Start Development Server

```bash
npm run dev
```

**Output:**
```
▲ Next.js 16.2.3
- Local:         http://localhost:3000
```

Open http://localhost:3000 in your browser

---

## Step 7: Test Login

### Admin Login
- **URL:** http://localhost:3000/admin/login
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Dashboard, manage students, courses, departments, instructors, semesters, classes

### Student Login
- **URL:** http://localhost:3000/student/login
- **Username:** `student001`
- **Password:** `student123`
- **Access:** Dashboard, view courses, check grades, update profile

---

## Project Structure

```
erpsys-nextjs/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   ├── admin/                # Admin endpoints (protected)
│   │   ├── student/              # Student endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   └── chat/                 # Chatbot API
│   ├── admin/                    # Admin pages
│   │   ├── login/               # Admin login
│   │   ├── dashboard/           # Admin dashboard (with chatbot)
│   │   ├── students/            # Manage students
│   │   ├── courses/             # Manage courses
│   │   ├── departments/         # Manage departments
│   │   ├── instructors/         # Manage instructors
│   │   ├── semesters/           # Manage semesters
│   │   └── classes/             # Manage classes
│   ├── student/                  # Student pages
│   │   ├── login/               # Student login
│   │   ├── register/            # Student registration
│   │   ├── dashboard/           # Student dashboard (with chatbot)
│   │   ├── courses/             # View courses (with chatbot)
│   │   ├── grades/              # View grades (with chatbot)
│   │   └── profile/             # Student profile (with chatbot)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home portal page
│   └── globals.css              # Global styles
├── components/                    # Reusable components
│   ├── Navbar.tsx               # Navigation bar
│   ├── ChatBot.tsx              # Chatbot component
│   └── ...
├── lib/                          # Utilities
│   ├── auth.ts                  # Authentication functions
│   ├── db.ts                    # Prisma database client
│   ├── groq.ts                  # Groq AI integration
│   └── types.ts                 # TypeScript types
├── prisma/                       # Prisma ORM
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
├── .env.local                   # Environment variables (CREATE THIS)
├── .env                         # Git-tracked env (optional overrides)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind CSS config
└── middleware.ts                # Next.js middleware (optional)
```

---

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push Prisma schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database UI)
npx prisma studio
```

---

## Default Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator

### Student Account
- **Username:** `student001`
- **Password:** `student123`
- **Role:** Student
- **Roll No:** `CSE21001`
- **Department:** Computer Science & Engineering

---

## Features

### Student Features
- ✅ View enrolled courses
- ✅ Check grades and assessments
- ✅ Update profile information
- ✅ Chat with AI Assistant (Groq-powered)
- ✅ Secure login/authentication

### Admin Features
- ✅ Manage students (CRUD operations)
- ✅ Manage courses and departments
- ✅ Manage instructors
- ✅ Manage semesters
- ✅ Manage classes and enrollments
- ✅ View system statistics
- ✅ Chat with AI Assistant (Admin context)

### Technical Features
- ✅ MongoDB Atlas cloud database
- ✅ JWT-based authentication
- ✅ Groq API integration (LLM)
- ✅ Responsive Tailwind CSS design
- ✅ TypeScript type safety
- ✅ Prisma ORM
- ✅ Protected API routes

---

## Troubleshooting

### "Can't reach database server"
- Check MongoDB Atlas cluster is running
- Verify `DATABASE_URL` in `.env.local`
- Ensure IP is whitelisted in MongoDB Atlas

### "Invalid API key" (Groq)
- Go to https://console.groq.com/keys
- Generate new API key
- Update `GROQ_API_KEY` in `.env.local`

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall
- Clear `.next` build cache

### Port 3000 already in use
- Use different port: `npm run dev -- -p 3001`
- Or kill process using port 3000

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
5. Deploy

### Railway

1. Push code to GitHub
2. Go to https://railway.app
3. Create new project
4. Connect GitHub repo
5. Add environment variables
6. Deploy

### Docker

```bash
docker build -t erpsys .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  -e GROQ_API_KEY="..." \
  erpsys
```

---

## Support & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Groq Docs:** https://console.groq.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## License

This project is part of Smart Class Tracker ERP System.

---

## Version Info

- **Next.js:** 16.2.3
- **React:** 19.2.4
- **Prisma:** 5.21.1
- **Tailwind CSS:** 4
- **Node.js:** v18+

---

**Last Updated:** April 15, 2026

✨ Happy Learning!
