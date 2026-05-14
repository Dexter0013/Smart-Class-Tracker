# 🎓 Smart Classroom System

An **AI-powered classroom management platform** designed to simplify academic operations and enhance learning experiences through automation, analytics, and intelligent tools.

The **Smart Classroom System** provides a unified digital platform for **students, teachers, and administrators** to manage classroom activities efficiently. It integrates essential academic functions such as **attendance tracking, assignment management, lecture note sharing, student analytics, and AI-assisted learning**.

The system aims to create a **modern digital learning environment** where educators can monitor academic performance, students can access resources easily, and administrators can manage institutional operations effectively.

---

# 🚀 Features

## 👨‍🎓 Student Portal

* View attendance and academic records
* Access lecture notes and course materials
* Submit assignments and quizzes
* Receive announcements and notifications
* Ask doubts using an AI assistant

## 👨‍🏫 Teacher Portal

* Record and manage student attendance
* Upload lecture notes and assignments
* Monitor class performance using analytics dashboards
* Detect weak students using predictive analytics
* Provide feedback and academic guidance

## 👨‍💼 Admin Portal

* Manage students, courses, departments, instructors, semesters, and classes
* Full CRUD operations (Create, Read, Update, Delete) for all entities
* Responsive admin dashboard with real-time data management
* Administrative statistics and system-wide analytics

---

# 🤖 AI & Analytics Features

* Student Performance Prediction
* Weak Student Detection
* AI-powered Doubt Assistant
* Lecture Notes Summarization
* Automatic Quiz Generation
* Academic Performance Analytics

These intelligent features help educators identify struggling students early and support **data-driven academic decisions**.

---

# 🏗 System Architecture

The platform follows a **layered architecture**:

```
Users (Student / Teacher / Admin)
        │
        ▼
Frontend Dashboard
        │
        ▼
Next.js API Routes
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Core Services    AI Services     Analytics Engine
        │
        ▼
Database (Students, Courses, Attendance, Assignments)
```

---

# 🧰 Technology Stack

### Frontend

* React.js 19
* Next.js 16 with TypeScript
* Tailwind CSS 4
* Responsive design optimized for mobile/tablet/desktop

### Backend

* Next.js API Routes
* REST APIs
* JWT Authentication with HTTP-only cookies

### Database

* MongoDB Atlas with Prisma ORM

### AI & Machine Learning

* Groq AI for chatbot integration
* LLM-powered assistance

### Deployment

* Railway / Render / VPS (PM2)
* Vercel (Frontend only)

---

# 📊 Core Modules

```
Smart Classroom System
│
├── Student Portal
│   ├── Attendance
│   ├── Notes
│   ├── Assignments
│   └── AI Assistant
│
├── Teacher Portal
│   ├── Attendance Management
│   ├── Assignment Creation
│   ├── Notes Upload
│   └── Student Analytics
│
├── Admin Portal
│   ├── User Management
│   ├── Course Management
│   └── System Monitoring
│
└── AI Layer
    ├── Performance Prediction
    ├── Weak Student Detection
    └── Learning Assistance
```

---

# ⚙ Installation

Clone the repository

```
git clone https://github.com/yourusername/smart-classroom-system.git
```

Navigate to the project directory

```
cd smart-classroom-system/erpsys-nextjs
```

Install dependencies

```
npm install
```

Setup environment variables

```
Create a .env.local file with:
DATABASE_URL="..."
GROQ_API_KEY="..."
JWT_SECRET="..."
```

Initialize database

```
npm run db:push
npm run db:seed
```

Run the development server

```
npm run dev
```

Access the application at `http://localhost:3000`

**Default Credentials:**
- Admin: `username: admin` | `password: admin123`
- Student: `username: student001` | `password: student123`

---

# 📈 Future Improvements

* AI lecture transcription
* Smart attendance using face recognition
* Personalized learning recommendations
* Mobile application integration
* Advanced analytics dashboard

---

# 🤝 Contribution

Contributions are welcome!
Feel free to open issues or submit pull requests to improve the project.

---

# 📜 License

This project is licensed under the **GPL-3.0 license**.

---

⭐ If you find this project useful, consider giving it a **star** on GitHub!
