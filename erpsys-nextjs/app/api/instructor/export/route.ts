import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import * as xlsx from "xlsx";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const instructor = await prisma.instructor.findUnique({
      where: { userId: user.userId },
    });

    if (!instructor) {
      return NextResponse.json({ message: "Instructor not found" }, { status: 404 });
    }

    // Fetch data filtered by instructor
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: { attendance: { class: { instructorId: instructor.id } } },
      include: {
        student: true,
        attendance: { include: { class: { include: { course: true } } } },
      },
    });

    const enrollments = await prisma.enrollment.findMany({
      where: { class: { instructorId: instructor.id } },
      include: {
        student: { include: { department: true } },
        class: { include: { course: true } },
      },
    });

    // Unique students from enrollments
    const uniqueStudentsMap = new Map();
    enrollments.forEach(e => {
      if (!uniqueStudentsMap.has(e.student.id)) {
        uniqueStudentsMap.set(e.student.id, e.student);
      }
    });
    const students = Array.from(uniqueStudentsMap.values());

    const marks = await prisma.studentMark.findMany({
      where: { assessment: { class: { instructorId: instructor.id } } },
      include: {
        student: true,
        assessment: { include: { class: { include: { course: true } } } },
      },
    });

    const classes = await prisma.class.findMany({
      where: { instructorId: instructor.id },
      include: {
        course: true,
        instructor: true,
        semester: true,
      },
    });

    // Transform Data for Sheets
    const attendanceData = attendanceRecords.map((record) => ({
      "Student Name": record.student.name,
      "Roll No": record.student.rollNo,
      "Course": record.attendance.class.course.courseCode,
      "Date": new Date(record.attendance.date).toLocaleDateString(),
      "Status": record.status,
    }));

    const studentInfoData = students.map((s: any) => ({
      "Name": s.name,
      "Roll No": s.rollNo,
      "Email": s.email,
      "Phone": s.phone || "N/A",
      "Department": s.department.departmentName,
      "Enrollment Date": new Date(s.enrollmentDate).toLocaleDateString(),
    }));

    const finalGradesData = enrollments.map((e) => ({
      "Student Name": e.student.name,
      "Roll No": e.student.rollNo,
      "Course": e.class.course.courseCode,
      "Final Grade": e.finalGrade || "N/A",
    }));

    const assessmentsData = marks.map((m) => ({
      "Student Name": m.student.name,
      "Roll No": m.student.rollNo,
      "Course": m.assessment.class.course.courseCode,
      "Assessment": m.assessment.assessmentName,
      "Marks Obtained": m.marksObtained,
      "Max Marks": m.assessment.maxMarks,
    }));

    const classScheduleData = classes.map((c) => ({
      "Course Code": c.course.courseCode,
      "Course Name": c.course.courseName,
      "Semester": c.semester.semesterName,
      "Schedule": c.schedule || "TBA",
      "Location": c.location || "TBA",
    }));

    // Create Worksheets
    const wb = xlsx.utils.book_new();
    
    if (attendanceData.length > 0) xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(attendanceData), "Attendance");
    if (finalGradesData.length > 0) xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(finalGradesData), "Final Grades");
    if (assessmentsData.length > 0) xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(assessmentsData), "Assessment Marks");
    if (studentInfoData.length > 0) xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(studentInfoData), "Student Info");
    if (classScheduleData.length > 0) xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(classScheduleData), "Class Schedules");

    // Default empty sheet if no data
    if (wb.SheetNames.length === 0) {
      xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([{ Message: "No data available" }]), "Empty");
    }

    // Generate Buffer
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="Class_Data_Export_${new Date().toISOString().split("T")[0]}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
