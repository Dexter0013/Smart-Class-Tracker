# 🚀 Complete Setup Guide - ERP System

> Step-by-step guide to set up and run the Smart Class Tracker ERP System with route protection and Groq chatbot.

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **npm** v9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com))
- **MongoDB Atlas Account** ([Free signup](https://www.mongodb.com/cloud/atlas))
- **Groq API Account** ([Free signup](https://console.groq.com))

---

## Step 1: Clone Repository

```bash
git clone https://github.com/your-repo/Smart-Class-Tracker.git
cd Smart-Class-Tracker/erpsys-nextjs
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs:

- Next.js 16, React 19, TypeScript
- Prisma ORM, MongoDB driver
- Groq SDK for chatbot
- Tailwind CSS, authentication libraries
- And 20+ other packages

**Time:** ~2-3 minutes

---

## Step 3: Create `.env.local`

This file stores your API keys and secrets.

### Create the file:

**Mac/Linux:**

```bash
touch .env.local
```

**Windows:**

```bash
echo. > .env.local
```

### Add these values:

```bash
# ========== DATABASE ==========
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/studentdb"

# ========== AUTHENTICATION ==========
JWT_SECRET="your-generated-64-character-hex-string"
JWT_EXPIRATION="7d"

# ========== APP ==========
NEXT_PUBLIC_API_URL="http://localhost:3000"

# ========== GROQ AI ==========
GROQ_API_KEY="gsk_your-api-key-here"
GROQ_MODEL="mixtral-8x7b-32768"
```

---

## Step 4: Get API Keys

### 4a. MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** (free tier available)
3. Create an account with email & password
4. Create an organization and project
5. Click **"Create"** → **"Free Tier"** → **AWS** → **Select region** → **Create**
6. Wait for cluster to be created (~5 minutes)
7. Once created, click **"Connect"**
8. Select **"Drivers"** → **Node.js** → Copy connection string
9. Replace `<username>` and `<password>` with your MongoDB user credentials
10. Replace `<database>` with `studentdb`

**Example:**

```
mongodb+srv://admin:password123@cluster0.mongodb.net/studentdb
```

Add to `.env.local` as `DATABASE_URL`

### 4b. Groq API (Chatbot AI)

1. Go to https://console.groq.com
2. Click **"Sign up"** (Google/GitHub login available)
3. Verify email
4. Once logged in, go to **API Keys** section
5. Click **"Create API Key"**
6. Copy the generated key (starts with `gsk_`)

**Example:**

```
gsk_4r7xJ9pL2mK8nQ0vZ3bW5dE6fH9iJ1kL
```

Add to `.env.local` as `GROQ_API_KEY`

### 4c. JWT_SECRET (Authentication)

Generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**

```
a7f3c9e2b1d4f6a8c5e9b2d7f1a4c6e9b3d5f8a1c4e7b9d2f5a8c1e4b7d0f3
```

Copy this value and add to `.env.local` as `JWT_SECRET`

---

## Step 5: Verify `.env.local`

Your `.env.local` should now look like:

```bash
DATABASE_URL="mongodb+srv://admin:password123@cluster0.xyz.mongodb.net/studentdb"
JWT_SECRET="a7f3c9e2b1d4f6a8c5e9b2d7f1a4c6e9b3d5f8a1c4e7b9d2f5a8c1e4b7d0f3"
JWT_EXPIRATION="7d"
NEXT_PUBLIC_API_URL="http://localhost:3000"
GROQ_API_KEY="gsk_4r7xJ9pL2mK8nQ0vZ3bW5dE6fH9iJ1kL"
GROQ_MODEL="mixtral-8x7b-32768"
```

✅ All values filled in? Continue!

---

## Step 6: Initialize Database

### Push Schema to MongoDB

```bash
npx prisma db push
```

This creates 10 collections in MongoDB:

- User, Department, Student, Instructor
- Semester, Course, Class, Enrollment
- Assessment, StudentMark

**Output:**

```
The following migration(s) have been created and applied to your database:
```

---

npm run db:seed      # Add sample data
npm run dev          # Start dev server (http://localhost:3000)

**Output:**

```
▲ Next.js 16.2.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.56.1:3000
✓ Ready in 2.4s
```

Open **http://localhost:3000** in your browser

---

## Step 9: Test the System

### Home Page

- ✅ Visit http://localhost:3000
- ✅ See home portal with Admin/Student login buttons

### Route Protection Test

- ❌ Try http://localhost:3000/admin/dashboard without login → Redirects to home
- ❌ Try http://localhost:3000/student/dashboard without login → Redirects to home

### Admin Login

1. Click "Admin Login" button
2. **Username:** `admin2`
3. **Password:** `123`
4. ✅ Should see admin dashboard with stats and chatbot

### Admin Dashboard Features

- View system statistics
- Manage students, courses, departments
- Manage instructors, semesters, classes
- 🤖 Try chatbot (bottom right)

### Student Login

1. Go back to home (click logo or type localhost:3000)
2. Click "Student Login" button
3. **Username:** `stud1`
4. **Password:** `123`
5. ✅ Should see student dashboard

### Student Dashboard Features

- View enrolled courses
- Check grades
- View profile
- 🤖 Try chatbot (bottom right)

### Instructor Login

1. Go back to home
2. Click "Instructor Login" button
3. **Username:** `inst1`
4. **Password:** `123`
5. ✅ Should see instructor dashboard with classes

### Instructor Dashboard Features

- View classes & students
- Process assessments & inputs marks

---

## 🔒 Route Protection Verification

All these routes should require login:

```
Protected Routes (redirect to / if not logged in):
- /admin/dashboard
- /admin/students
- /admin/courses
- /student/courses
- /student/grades
- /admin/instructors
- /instructor/dashboard
- /instructor/enrollments
- /instructor/assessments
- /instructor/marks
- /admin/semesters
- /admin/classes
```

Try accessing a protected route without login - you should be redirected to home page.

---

## ✨ Chatbot Verification

1. **Login as admin** → Go to dashboard
2. Look for 💬 **Chat button** in bottom-right
3. Click to open chatbot
4. Try asking: "What are the main features of this ERP system?"
5. Should get AI response from Groq

**Note:** Chatbot is **only available after login** on dashboards.

---

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push schema changes to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (visual database UI)
npx prisma studio
```

---

## Troubleshooting

### "Can't reach database server"

```bash
# Check MongoDB connection string
# Make sure:
# 1. MongoDB Atlas cluster is running
# 2. DATABASE_URL is correct in .env.local
# 3. Your IP is whitelisted in MongoDB Atlas Network Access
# 4. Format is: mongodb+srv://user:pass@cluster.net/dbname
```

### "Invalid API key" (Groq)

```bash
# Get new key from https://console.groq.com/keys
# Update GROQ_API_KEY in .env.local
# Restart dev server: npm run dev
```

### "Invalid credentials" when logging in

```bash
# Check database was seeded:
npm run db:seed

# Verify with Prisma Studio:
npx prisma studio
```

### "Port 3000 already in use"

```bash
# Use different port:
npm run dev -- -p 3001
```

### Chatbot not appearing

```bash
# 1. Make sure you're logged in (dashboard only)
# 2. Check GROQ_API_KEY is set in .env.local
# 3. Restart dev server
```

### After login, can't access routes

```bash
# Check cookies:
# 1. Open browser DevTools (F12)
# 2. Go to Application → Cookies
# 3. Make sure "auth" cookie exists
# 4. If not, login again or clear cookies

# Check JWT_SECRET:
# Verify JWT_SECRET in .env.local matches
```

---

## Project Structure

```
erpsys-nextjs/
├── app/
│   ├── admin/              # Admin pages (protected)
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── courses/
│   │   ├── departments/
│   │   ├── instructors/
│   │   ├── semesters/
│   │   ├── classes/
│   │   └── login/
│   ├── student/            # Student pages (protected)
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── grades/
│   │   ├── profile/
│   │   ├── login/
│   │   └── register/
│   ├── instructor/         # Instructor pages (protected)
│   │   ├── dashboard/
│   │   ├── enrollments/
│   │   ├── assessments/
│   │   ├── marks/
│   │   └── login/
│   ├── api/                # API endpoints
│   │   ├── admin/          # Protected admin APIs
│   │   ├── student/        # Protected student APIs
│   │   ├── auth/           # Login/logout/register
│   │   └── chat/           # Groq chatbot API
│   ├── layout.tsx
│   ├── page.tsx            # Home page (public)
│   └── globals.css
├── components/
│   ├── ChatBot.tsx         # Groq-powered chatbot
│   ├── LoginForm.tsx       # Login form with auth checking
│   ├── Navbar.tsx          # Navigation
│   └── ...
├── lib/
│   ├── auth.ts             # JWT utilities
│   ├── db.ts               # Prisma client
│   ├── groq.ts             # Groq API integration
│   └── types.ts
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── proxy.ts                # ⭐ Route protection
├── .env.local              # Environment variables (create this)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── SETUP_GUIDE.md          # This file
├── FILES_NEEDED.md
├── DEPLOYMENT.md
└── README.md
```

---

## Default Credentials

### Admin Account

- **URL:** http://localhost:3000/admin/login
- **Username:** `admin2`
- **Password:** `123`
- **Access:** All management features via migrated old database.

### Student Account

- **URL:** http://localhost:3000/student/login
- **Username:** `stud1`
- **Password:** `123`
- **Access:** Courses, grades, profile via migrated old database.

### Instructor Account

- **URL:** http://localhost:3000/instructor/login
- **Username:** `inst1`
- **Password:** `123`
- **Access:** Classes, grades input, assessments assigned to the specific faculty member.

---

## Next Steps

1. ✅ Complete setup from this guide
2. ✅ Test login and route protection
3. ✅ Explore admin panel
4. ✅ Try student dashboard
5. ✅ Test chatbot
6. ✅ Create additional users/data
7. ✅ Deploy to production (see DEPLOYMENT.md)

---

## Documentation

- **README.md** - Project overview
- **FILES_NEEDED.md** - Requirements checklist
- **DEPLOYMENT.md** - Deploy to Vercel/Docker/Railway
- **SETUP_GUIDE.md** - This file

---

## Getting Help

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Groq Docs:** https://console.groq.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Environment Variables Summary

| Variable              | Purpose            | Where to Get                   |
| --------------------- | ------------------ | ------------------------------ |
| `DATABASE_URL`        | MongoDB connection | MongoDB Atlas                  |
| `JWT_SECRET`          | Auth token signing | Generate with node             |
| `GROQ_API_KEY`        | Chatbot AI         | Groq console                   |
| `JWT_EXPIRATION`      | Token validity     | Set to "7d"                    |
| `NEXT_PUBLIC_API_URL` | API URL            | Set to "http://localhost:3000" |
| `GROQ_MODEL`          | LLM model          | Set to "mixtral-8x7b-32768"    |

---

## Version Info

- **Next.js:** 16.2.3
- **React:** 19.2.4
- **Prisma:** 5.21.1
- **MongoDB:** Latest (Atlas)
- **Node.js:** v18+
- **TypeScript:** 5

---

**Last Updated:** April 22, 2026

✨ **Your ERP System is ready!** 🚀

For deployment, see **DEPLOYMENT.md**
