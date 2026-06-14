# Smart Class Tracker - ERP System

A comprehensive Educational Resource Planning (ERP) system built with Next.js, designed for managing students, instructors, courses, attendance, and assessments in an educational institution.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security](#security)

## ✨ Features

### 1. **Core Infrastructure**

- ⚡ Next.js 16 with TypeScript & Tailwind CSS 4
- 🗄️ MongoDB Atlas integration via Prisma ORM
- 🔐 JWT-based authentication with secure HTTP-only cookies
- 🛡️ Proxy-based route protection with role-based access control
- 📱 Responsive design with Tailwind CSS
- 🎯 CORS-enabled API endpoints

### 2. **Admin Management System**

Complete CRUD operations for:

- 👨‍🎓 **Students** - Create, read, update, delete student records
- 👨‍🏫 **Instructors** - Manage faculty members and their assignments
- 📚 **Courses** - Organize and manage course catalog
- 🏢 **Departments** - Department administration and HOD assignment
- 📅 **Semesters** - Academic semester lifecycle management
- 📖 **Classes** - Class section management and enrollment
- 👥 **Users** - System-wide user account management

**Admin Dashboard** includes:
- Master data management with full CRUD interfaces
- Real-time statistics and analytics (`/api/admin/dashboard/stats`)
- Data export functionality (CSV/Excel via `GET /api/admin/export`)
- Dynamic API routes (`/api/admin/[table]/` and `/api/admin/[table]/[id]`)

### 3. **Instructor Portal**

- 📊 Dedicated Instructor Dashboard (`/instructor/dashboard`)
- 📝 Assessment Management - Create and manage assessments for classes
- 👥 Enrollment Tracking - View and track student enrollments
- 📖 Class Management - Manage assigned classes and course content
- ✏️ Grade Input - Enter and update student marks/grades
- 📋 Attendance Management - Track and update class attendance
- 📤 Data Export - Export class records and attendance data

**Instructor APIs:**
- `POST /api/instructor/assessments` - Create assessments
- `GET/PUT /api/instructor/assessments/[id]` - Manage assessments
- `GET /api/instructor/classes` - View assigned classes
- `GET/PUT /api/instructor/attendance` - Manage attendance
- `POST /api/instructor/marks` - Record student marks
- `GET /api/instructor/enrollments` - View class enrollments

### 4. **Student Portal**

- 📊 Dashboard with enrolled courses (protected route)
- 📈 View grades and academic records
- 👤 Personal profile management
- 📚 Course catalog browsing
- 📍 Attendance tracking
- 🎓 Academic progress overview

**Student APIs:**
- `GET /api/student/profile` - Retrieve student profile
- `GET /api/student/courses` - Enrolled courses
- `GET /api/student/grades` - Academic grades
- `GET /api/student/attendance` - Attendance records
- `POST /api/student/register` - Student registration

### 5. **📞 Attendance Management System**

- 📅 Attendance Calendar Component with visual representation
- 📊 Attendance tracking per class and student
- 🔄 Real-time attendance updates
- 📋 Attendance records with timestamps
- 📤 Attendance data export functionality
- 🎯 Attendance queries by date range and class

**Attendance APIs:**
- `GET /api/admin/attendance` - Retrieve all attendance records
- `POST /api/instructor/attendance` - Mark attendance
- `PUT /api/instructor/attendance/update` - Update attendance records

### 6. **📊 Assessment & Grading System**

- 📝 Assessment creation with max marks configuration
- ✏️ Student mark entry with validation
- 📊 Grade tracking and calculation
- 🏆 Performance analytics
- 📈 Result distribution analysis

**Assessment APIs:**
- `POST /api/instructor/assessments` - Create assessment
- `GET /api/instructor/assessments/[id]` - Get assessment details
- `POST /api/instructor/marks` - Record student marks

### 7. **🤖 Groq AI Chatbot Integration**

- 🧠 AI-powered assistant using Groq API
- 🔐 Authentication-required chatbot (admin/student/instructor dashboards)
- 💬 Real-time conversation with context awareness
- 📝 Chat history and conversation tracking
- 🧹 Clear chat functionality
- ⏰ Message timestamps
- 🎯 Context-aware responses per user role

**Chat Features:**
- Multi-role support (Admin, Student, Instructor)
- Persistent chat history during session
- AI-powered recommendations and assistance
- Instant query resolution

### 8. **🔒 Authentication & Authorization**

- 🔐 Role-based access control (ADMIN, STUDENT, INSTRUCTOR)
- 🛡️ JWT token-based authentication
- 🍪 Secure HTTP-only cookie storage
- 🔑 Password hashing with bcryptjs
- 📤 Auto-redirect for authenticated users
- 📲 Login pages for each user role
- 🚪 Logout functionality with token cleanup
- 🔒 Protected API routes with middleware verification

**Login & Registration:**
- `POST /api/admin/login` - Admin authentication
- `POST /api/instructor/login` - Instructor authentication
- `POST /api/student/login` - Student authentication
- `POST /api/student/register` - Student self-registration
- `POST /api/auth/logout` - Universal logout

### 9. **🛡️ Route Protection**

- Proxy-based authentication middleware
- Automatic redirect to login for unauthenticated access
- Role-specific route enforcement
- Token validation on protected routes
- Seamless user experience with transparent redirects

### 10. **📊 API Endpoints**

**35+ RESTful API endpoints** organized by domain:

- **Authentication:** 4 endpoints (login, register, logout)
- **Admin Management:** 15+ CRUD endpoints
- **Instructor Features:** 10+ specialized endpoints
- **Student Features:** 5+ endpoints
- **Chat:** 1 AI-powered endpoint
- **Export:** Data export to Excel/CSV

### 11. **Database Schema**

**MongoDB collections** with Prisma ORM:

- **User** - System user accounts with role assignment
- **Department** - Department records with HOD relationships
- **Student** - Student records with enrollment tracking
- **Instructor** - Faculty member records
- **Semester** - Academic semester cycles
- **Course** - Course catalog and information
- **Class** - Class sections with instructor assignment
- **Enrollment** - Student-Class relationships with grades
- **Assessment** - Test/assignment definitions
- **StudentMark** - Grade records per assessment
- **Attendance** - Attendance sheet records
- **AttendanceRecord** - Individual attendance entries

All with proper foreign keys, relationships, and unique constraints for data integrity.

### 12. **🌐 Admin Features**

- 📊 Dashboard with real-time statistics
- 🔍 Advanced data filtering and search
- 📤 Bulk data export (Excel/CSV)
- 👤 User account creation and management
- 📋 System-wide data governance
- 🎯 Analytics and reporting

## Tech Stack

### Frontend
- **Framework:** Next.js 16.2.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** React 19.2.4

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Database:** MongoDB Atlas
- **ORM:** Prisma 5.21.1
- **Authentication:** JWT (jose 6.2.2)
- **Password Hashing:** bcryptjs 3.0.3

### External Services
- **AI/Chat:** Groq API (groq-sdk 1.1.2)
- **Data Export:** XLSX 0.18.5

### Development Tools
- **Build Tool:** Next.js
- **Type Checking:** TypeScript 5
- **Database CLI:** Prisma CLI
- **Task Runner:** TSX 4.21.0
- **Validation:** Zod 4.3.6

## Project Structure

```
app/
├── api/                    # API routes
│   ├── admin/             # Admin endpoints
│   ├── instructor/        # Instructor endpoints
│   ├── student/           # Student endpoints
│   ├── auth/              # Authentication endpoints
│   └── chat/              # AI chatbot endpoint
├── admin/                 # Admin dashboard pages
├── instructor/            # Instructor portal pages
├── student/               # Student portal pages
└── [page/layout files]    # Root pages

components/               # Reusable React components
├── LoginForm.tsx
├── Navbar.tsx
├── AdminSidebar.tsx
├── ChatBot.tsx
├── AttendanceCalendar.tsx
└── [other components]

lib/                      # Utility functions & configurations
├── auth.ts               # JWT & authentication utilities
├── db.ts                 # Prisma client
├── groq.ts               # Groq AI integration
├── types.ts              # TypeScript type definitions
├── validations.ts        # Input validation schemas
└── [context files]       # API context providers

prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Database seeding script

public/                   # Static assets

scripts/                  # Utility scripts
├── test_api.js
├── simulate_attendance.js
└── [other scripts]
```

## Security Features

- 🔐 **Role-Based Access Control (RBAC)** - Three-tier permission system (Admin, Instructor, Student)
- 🔐 **JWT Token Authentication** - Secure token-based session management
- 🔐 **HTTP-Only Cookies** - XSS protection through secure cookie storage
- 🔐 **Password Hashing** - Bcryptjs with salt for secure password storage
- 🔐 **Route Protection Proxy** - Middleware for automatic authentication enforcement
- 🔐 **JWT Signature Verification** - Token tampering prevention
- 🔐 **Protected API Endpoints** - Authorization checks on all sensitive operations
- 🔐 **CORS Configuration** - Cross-origin resource sharing restrictions
- 🔐 **Automatic Redirects** - Seamless UX with transparent auth redirects

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB Atlas connection string
- Groq API key (for chatbot functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erpsys-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local`:
   ```
   DATABASE_URL=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Setup the database**
   ```bash
   npm run db:push        # Push schema to MongoDB
   npm run db:seed        # Seed initial data
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run db:seed   # Seed database with sample data
npm run db:push   # Push Prisma schema to database
```

## Usage

### Admin Portal
- Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Manage students, instructors, courses, departments, semesters, and classes
- View system analytics and export data

### Instructor Portal
- Navigate to [http://localhost:3000/instructor/login](http://localhost:3000/instructor/login)
- Create and manage assessments
- Track student enrollments and grades
- Manage attendance records

### Student Portal
- Navigate to [http://localhost:3000/student/login](http://localhost:3000/student/login) or [http://localhost:3000/student/register](http://localhost:3000/student/register)
- View enrolled courses and grades
- Track attendance
- Access AI-powered study assistant via chatbot

## API Documentation

All API endpoints require authentication (JWT token in HTTP-only cookies) except for login and registration endpoints.

### Base URL
```
http://localhost:3000/api
```

### Response Format
All responses follow standard JSON structure:
```json
{
  "success": true/false,
  "data": {},
  "message": "optional message"
}
```

### 9. **Migrated System Credentials**

- **Admin:** username=`admin2` password=`123` (or `admin1` / `hashed_pw_3`)
- **Student:** username=`stud1` password=`123` (or `yashin` / `yashin`)
- **Note:** All 90 original MySQL student accounts were mapped. Other missing accounts synthesize the password: `123`.

### 10. **Historic Data Sync** ⭐ NEW
- Natively mapped relational MariaDB instances (integer schema bindings) into Prisma NOSQL ObjectIds.
- Entire legacy structure was successfully bridged into current application logic without API rewrites.

### 11. **Zod API Validation** ⭐ NEW
- Hard-coded server boundaries protecting MongoDB inserts with statically typed definitions (`lib/validations.ts`).
- Centralized validation automatically casting native HTML string forms into numbers and nested Date objects prior to runtime Prisma operations.

### 12. **Attendance Management System** ⭐ NEW
- Centralized export functionality for attendance records (CSV/PDF).
- Stabilized database integration bugs related to attendance tracking.
- Implemented consistent loading UIs (spinners) across all profiles for better user experience.
- Resolved syntax errors and removed dashboard redundancy in the student attendance portal.
---

## 📦 Tech Stack

**Frontend:**

- React 19 + Next.js 16
- Tailwind CSS 4
- TypeScript

**Backend:**

- Next.js API Routes
- Prisma ORM
- MongoDB Atlas

**AI/Chat:**

- Groq API (mixtral-8x7b-32768)
- Real-time streaming responses

**Authentication & Validation:**

- JWT with jose library
- bcryptjs for password hashing
- Zod validation schema framework (`^4.x` parity)
- Proxy-based route protection

---

## File Structure

```
erpsys-nextjs/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx (protected)
│   │   ├── students/page.tsx (protected)
│   │   ├── instructors/page.tsx (protected)
│   │   ├── courses/page.tsx (protected)
│   │   ├── departments/page.tsx (protected)
│   │   ├── semesters/page.tsx (protected)
│   │   ├── classes/page.tsx (protected)
│   │   └── login/page.tsx (public)
│   ├── student/
│   │   ├── dashboard/page.tsx (protected + chatbot)
│   │   ├── courses/page.tsx (protected + chatbot)
│   │   ├── grades/page.tsx (protected + chatbot)
│   │   ├── profile/page.tsx (protected + chatbot)
│   │   ├── login/page.tsx (public)
│   │   └── register/page.tsx (public)
│   ├── instructor/
│   │   ├── dashboard/page.tsx (protected + chatbot)
│   │   ├── enrollments/page.tsx (protected + chatbot)
│   │   ├── assessments/page.tsx (protected + chatbot)
│   │   ├── marks/page.tsx (protected + chatbot)
│   │   ├── attendance/page.tsx (protected + chatbot)
│   │   └── login/page.tsx (public)
│   ├── api/
│   │   ├── admin/ (20+ protected endpoints)
│   │   ├── student/ (protected endpoints)
│   │   ├── instructor/ (protected endpoints)
│   │   ├── auth/ (login, logout, register)
│   │   └── chat/ (protected - Groq API)
│   ├── layout.tsx
│   └── page.tsx (home - public)
├── components/
│   ├── ChatBot.tsx (Groq-powered chatbot)
│   ├── LoginForm.tsx (auth checking)
│   └── Navbar.tsx
├── lib/
│   ├── auth.ts (JWT utilities)
│   ├── db.ts (Prisma client)
│   ├── groq.ts (Groq API)
│   └── types.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── proxy.ts (⭐ Route protection)
├── .env.local (CREATE THIS)
└── SETUP_GUIDE.md
```

---

## 🚀 Quick Start

### Local Development

```bash
cd erpsys-nextjs
npm install
npm run db:push      # Initialize MongoDB
npm run db:seed      # Add sample data
npm run dev          # Start dev server (http://localhost:3000)
```

### Environment Setup

Create `.env.local` with:

```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/studentdb"
GROQ_API_KEY="gsk_your-api-key"
JWT_SECRET="your-generated-secret-key"
```

See `SETUP_GUIDE.md` for complete setup with step-by-step instructions.

### Production Build

```bash
npm run build
npm run start
```

---

## 📋 Protected Routes

### Admin Routes (Require ADMIN login)

```
/admin/dashboard          - Admin dashboard with stats & chatbot
/admin/students           - Student management
/admin/courses            - Course management
/admin/departments        - Department management
/admin/instructors        - Instructor management
/admin/semesters          - Semester management
/admin/classes            - Class management
```

### Student Routes (Require STUDENT login)

```
/student/dashboard        - Student dashboard with enrolled courses & chatbot
/student/courses          - View enrolled courses with chatbot
/student/grades           - View grades with chatbot
/student/profile          - View/edit profile with chatbot
```

### Instructor Routes (Require INSTRUCTOR login)

```
/instructor/dashboard     - Instructor dashboard
/instructor/enrollments   - View students in assigned classes
/instructor/assessments   - Create assessments for assigned classes
/instructor/marks         - Input grades for students
```

### Public Routes (No login required)

```
/                          - Home portal with login options
/admin/login               - Admin login
/student/login             - Student login
/instructor/login          - Instructor login
/student/register          - Student registration
```

---

## 🔐 Route Protection Features

1. **Proxy Authentication** - All protected routes checked via `proxy.ts`
2. **Auto-Redirect** - Unauthenticated users → home page
3. **Role-Based Access** - Admins can't access student routes and vice versa
4. **Login Page Check** - If already authenticated, redirects to dashboard
5. **Token Validation** - JWT signature verified on every request
6. **Secure Cookies** - Auth token stored in HTTP-only cookies

---

## 📚 Key Features

1. **Complete Admin Panel** - Manage all academic resources (protected)
2. **Student Dashboard** - Access courses, grades, profile (protected)
3. **Instructor Workspace** - Full grading systems matching faculty (protected)
4. **AI Chatbot** - Available only after login (Groq-powered)
5. **Route Protection** - Automatic redirect for unauthenticated access
6. **Full API** - RESTful endpoints for all operations (35+ APIs)
7. **MongoDB Integration** - Scalable cloud database
8. **Security** - JWT auth, RBAC, route protection, secure passwords, Zod payload validation
9. **Responsive Design** - Works on all devices
10. **Production Ready** - Deployable to Vercel, Railway, AWS

---

## 🎯 User Experience Flow

1. User visits `http://localhost:3000` → **Home page** (public)
2. User clicks "Admin Login" → **Admin login page** (public)
3. User enters credentials and submits → **Validates** → **Sets auth cookie**
4. User redirected to → `/admin/dashboard` (protected)
5. Dashboard loads with **chatbot widget** available
6. If user tries to access route without login → **Auto-redirects to home**
7. If user logs out → **Cookie deleted** → **Routes become inaccessible**

---

## 📖 Deployment Ready

This application can be deployed using the following services:

- **Railway** (Recommended for full-stack Next.js with Prisma)
- **Render** (Free tier available for web services)
- **VPS with PM2** (AWS EC2, DigitalOcean, etc.)

*Note: Deploying the full stack directly to Vercel may hit Serverless Function size limits due to Prisma engine size and 10-second timeouts for AI requests. Railway or a VPS is recommended.*

---

## 📝 Documentation

- **SETUP_GUIDE.md** - Complete step-by-step setup instructions

---

## ✨ What's New vs Original ChatBot

| Feature          | Original               | New                  |
| ---------------- | ---------------------- | -------------------- |
| Model Source     | Local LM Studio        | Groq Cloud API       |
| Chatbot Access   | Always visible         | Only after login     |
| Route Protection | Manual checks          | Proxy-based          |
| Setup Complexity | High                   | Low (just API key)   |
| Performance      | Variable               | Optimized            |
| Cost             | Free (local resources) | Free tier available  |
| Integration      | Standalone             | Fully integrated ERP |

---

## 🔧 Troubleshooting

**Can't access protected routes?**

- Make sure you're logged in (check cookies in browser)
- Try logging out and logging in again

**Chatbot not appearing?**

- Only visible on admin/student dashboards after login
- Check GROQ_API_KEY is set in `.env.local`

**Routes redirecting to home?**

- Check auth token in cookies (F12 → Application → Cookies)
- Verify JWT_SECRET is correct

See `SETUP_GUIDE.md` for more troubleshooting.

---

**Status:** 🟢 **PRODUCTION READY**

**Last Updated:** May 14, 2026
Version: 1.3.0 - Operationalized Attendance Export System & UI Consistency
