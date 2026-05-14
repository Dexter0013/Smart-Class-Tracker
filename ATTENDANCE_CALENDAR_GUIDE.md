# Attendance Calendar System Documentation

## Overview

The Attendance Calendar System provides an intuitive, date-based interface for viewing and managing attendance records. It supports three user roles (Admin, Instructor, and Student) with role-specific views and data properties.

## Features

### 1. **Interactive Calendar View**
- Monthly calendar display with navigation
- Visual indicators showing attendance activity on each day
- Days with attendance records are highlighted
- Shows record count on each date

### 2. **Detailed Day View**
- Side panel displaying selected date details
- Real-time summary statistics:
  - Present count
  - Absent count
  - Late count
  - Total records
- Complete record listing with full details

### 3. **Role-Based Data Display**

#### Admin View
- **Calendar Properties:**
  - Shows all attendance records across all classes
  - Color-coded calendar cells indicate attendance activity
  - Navigation across months

- **Detail Panel:**
  - Student name and roll number
  - Course code and name
  - Instructor name
  - Subject (if recorded)
  - Attendance status (Present/Absent/Late/Unmarked)
  - Summary statistics for selected date

#### Instructor View
- **Calendar Properties:**
  - Shows attendance records for their classes only
  - Filtered by selected class
  - Month navigation

- **Detail Panel:**
  - Student name and roll number
  - Subject (if recorded)
  - Attendance status
  - Class summary statistics

- **Additional Features:**
  - Can mark new attendance entries
  - View history in table format

#### Student View
- **Calendar Properties:**
  - Shows their own attendance across enrolled courses
  - Visual indicator of attendance status per date

- **Detail Panel:**
  - Course code and name
  - Subject (if recorded)
  - Personal attendance status
  - Overall summary

## Component Architecture

### AttendanceCalendar Component

**File:** [components/AttendanceCalendar.tsx](components/AttendanceCalendar.tsx)

**Props:**
```typescript
interface AttendanceCalendarProps {
  attendanceData: Array<{
    id: string;
    date: string;
    subject?: string;
    status?: string;
    class?: {
      id?: string;
      course?: { courseCode: string; courseName: string };
      instructor?: { name: string };
      semester?: { semesterName: string };
    };
    student?: { name: string; rollNo: string };
    records?: Array<{
      id: string;
      status: string;
      student: { name: string; rollNo: string };
    }>;
  }>;
  userRole: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}
```

**Key Features:**
- Auto-groups attendance data by date
- Calculates presence statistics
- Responsive design (grid layout on desktop, stacked on mobile)
- Color-coded status indicators
- Sticky detail panel for easy viewing

## Usage

### Admin Page
- **File:** [app/admin/(authenticated)/attendance/page.tsx](app/admin/(authenticated)/attendance/page.tsx)
- **Features:**
  - Toggle between Calendar and Table views
  - Export functionality
  - Full attendance data access

### Instructor Page
- **File:** [app/instructor/attendance/page.tsx](app/instructor/attendance/page.tsx)
- **Features:**
  - Class selector
  - Mark attendance form
  - Toggle Calendar/Table views
  - View by selected class only

### Student Page
- **File:** [app/student/attendance/page.tsx](app/student/attendance/page.tsx)
- **Features:**
  - View personal attendance
  - Toggle Calendar/Table views
  - Per-course statistics
  - Attendance percentage calculation

## Status Color Scheme

| Status    | Color     | Background | Use Case                |
|-----------|-----------|-----------|------------------------|
| PRESENT   | Green     | bg-green-100  | Student was present    |
| ABSENT    | Red       | bg-red-100    | Student was absent     |
| LATE      | Yellow    | bg-yellow-100 | Student was late       |
| UNMARKED  | Gray      | bg-gray-100   | Not yet marked         |

## Responsive Design

The calendar system is fully responsive:

- **Desktop (≥1024px):** 3-column layout with calendar + detail panel
- **Tablet (≥768px):** Adapts to 2-column layout as needed
- **Mobile (<768px):** Stacked single column layout

## Data Flow

```
API Endpoint ↓
     ↓
Fetch Attendance Data ↓
     ↓
Transform by Date & Role ↓
     ↓
AttendanceCalendar Component ↓
     ↓
User selects date ↓
     ↓
Display detailed records
```

## Key Interactions

### 1. Month Navigation
- Previous/Next buttons navigate months
- Calendar auto-updates for selected month

### 2. Date Selection
- Click any day to view details
- Selected date highlighted in blue
- Detail panel updates in real-time

### 3. View Mode Toggle
- Switch between Calendar and Table views
- State persists per session
- Both views show same data, different layout

### 4. Statistics
- Auto-calculated for selected date
- Summary shows:
  - Count by status
  - Total records
  - Useful for quick analysis

## Technical Details

### Performance Optimizations
- Uses `useMemo` for data grouping to prevent unnecessary recalculations
- Lazy computation of statistics
- Efficient date key formatting

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- Requires React 18+

### Accessibility
- Keyboard-navigable calendar
- Screen reader friendly labels
- Clear visual hierarchy
- High contrast color scheme

## Future Enhancements

1. **Export Options**
   - Export calendar view as PDF
   - Export selected date range

2. **Filtering**
   - Filter by attendance status
   - Filter by course/class
   - Date range picker

3. **Analytics**
   - Attendance trends graph
   - Predictive analytics
   - Comparison views

4. **Notifications**
   - Low attendance alerts
   - Attendance milestone notifications
   - Trend warnings

## API Integration

The calendar system works with existing API endpoints:

- **Admin:** `/api/admin/attendance`
- **Instructor:** `/api/instructor/attendance?classId={id}`
- **Student:** `/api/student/attendance`

## Troubleshooting

### Calendar Not Showing Data
- Verify API endpoint is returning data
- Check data transformation in component
- Ensure date format is ISO 8601 (YYYY-MM-DD)

### Missing Student/Instructor Details
- Check API includes nested relations
- Verify data structure matches component expectations

### Performance Issues
- For large datasets (1000+ records), implement pagination
- Consider caching attendance data
- Add virtual scrolling for large lists

## Code Examples

### Using the Calendar Component

```tsx
import AttendanceCalendar from "@/components/AttendanceCalendar";

export default function MyAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  
  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <AttendanceCalendar 
      attendanceData={attendance} 
      userRole="STUDENT" 
    />
  );
}
```

### Formatting Data for Calendar

```tsx
const attendanceData = attendance.map(record => ({
  id: record.id,
  date: record.date, // ISO format: "2024-05-14"
  subject: record.subject,
  status: record.status, // "PRESENT", "ABSENT", etc.
  class: {
    course: {
      courseCode: "CS101",
      courseName: "Intro to CS"
    },
    instructor: {
      name: "Dr. Smith"
    }
  },
  student: {
    name: "John Doe",
    rollNo: "2024001"
  }
}));
```

## Support

For issues or questions:
1. Check this documentation
2. Review component code comments
3. Check browser console for errors
4. Verify API data format
