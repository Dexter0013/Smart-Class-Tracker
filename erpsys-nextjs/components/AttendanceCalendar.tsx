"use client";

import { useState, useMemo } from "react";

interface AttendanceDay {
  date: Date;
  records: Array<{
    id: string;
    status: string;
    class?: {
      course?: { courseCode: string; courseName: string };
      instructor?: { name: string };
    };
    student?: { name: string; rollNo: string };
    subject?: string;
  }>;
}

interface AttendanceCalendarProps {
  attendanceData: Array<{
    id: string;
    date: string;
    subject?: string;
    status?: string;
    class?: {
      id: string;
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

export default function AttendanceCalendar({
  attendanceData,
  userRole,
}: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Group attendance data by date
  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceDay["records"]>();

    attendanceData.forEach((item) => {
      const date = new Date(item.date);
      const dateKey = date.toISOString().split("T")[0];

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }

      const records = map.get(dateKey) || [];

      if (userRole === "ADMIN" && item.records) {
        // For admin: show all records from an attendance sheet
        item.records.forEach((record) => {
          records.push({
            id: record.id,
            status: record.status,
            class: {
              course: item.class?.course,
              instructor: item.class?.instructor,
            },
            student: record.student,
            subject: item.subject,
          });
        });
      } else if (userRole === "INSTRUCTOR" && item.records) {
        // For instructor: show attendance records
        item.records.forEach((record) => {
          records.push({
            id: record.id,
            status: record.status,
            student: record.student,
            subject: item.subject,
          });
        });
      } else if (userRole === "STUDENT") {
        // For student: show their own status
        records.push({
          id: item.id,
          status: item.status || "UNMARKED",
          class: {
            course: item.class?.course,
          },
          subject: item.subject,
        });
      }

      map.set(dateKey, records);
    });

    return map;
  }, [attendanceData, userRole]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PRESENT":
        return "bg-green-100 text-green-800";
      case "ABSENT":
        return "bg-red-100 text-red-800";
      case "LATE":
        return "bg-yellow-100 text-yellow-800";
      case "UNMARKED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getAttendanceCount = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    const records = attendanceByDate.get(dateKey) || [];
    return records.length;
  };

  const getStatusSummary = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    const records = attendanceByDate.get(dateKey) || [];

    if (records.length === 0) return null;

    const presentCount = records.filter(
      (r) => r.status.toUpperCase() === "PRESENT"
    ).length;
    const absentCount = records.filter(
      (r) => r.status.toUpperCase() === "ABSENT"
    ).length;
    const lateCount = records.filter(
      (r) => r.status.toUpperCase() === "LATE"
    ).length;

    return { presentCount, absentCount, lateCount, total: records.length };
  };

  const selectedDateKey = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;
  const selectedRecords = selectedDateKey
    ? attendanceByDate.get(selectedDateKey) || []
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-lg font-bold"
              aria-label="Previous month"
            >
              ← 
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-lg font-bold"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-700 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`aspect-square p-2 rounded-lg border-2 transition ${
                  day
                    ? `cursor-pointer ${
                        selectedDate &&
                        selectedDate.toDateString() === day.toDateString()
                          ? "border-blue-500 bg-blue-50"
                          : getAttendanceCount(day) > 0
                          ? "border-green-300 bg-green-50 hover:border-green-500"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`
                    : "border-transparent bg-gray-50"
                }`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <div className="h-full flex flex-col text-sm">
                    <div className="font-semibold text-gray-900">
                      {day.getDate()}
                    </div>
                    {getAttendanceCount(day) > 0 && (
                      <div className="text-xs text-gray-500 mt-auto">
                        {getAttendanceCount(day)} record
                        {getAttendanceCount(day) !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Legend</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-800">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-800">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-gray-800">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-800">Unmarked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Select a Date"}
          </h3>

          {selectedDate && (
            <div className="space-y-4">
              {getStatusSummary(selectedDate) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Summary
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-800">Present:</span>
                      <span className="font-semibold text-gray-900">
                        {getStatusSummary(selectedDate)?.presentCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-800">Absent:</span>
                      <span className="font-semibold text-gray-900">
                        {getStatusSummary(selectedDate)?.absentCount}
                      </span>
                    </div>
                    {getStatusSummary(selectedDate)?.lateCount! > 0 && (
                      <div className="flex justify-between">
                        <span className="text-yellow-800">Late:</span>
                        <span className="font-semibold text-gray-900">
                          {getStatusSummary(selectedDate)?.lateCount}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">{getStatusSummary(selectedDate)?.total}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedRecords.length > 0 ? (
                  selectedRecords.map((record, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 text-sm">
                          {userRole === "ADMIN" && record.student && (
                            <div className="mb-1">
                              <div className="font-semibold text-gray-900">
                                {record.student.name}
                              </div>
                              <div className="text-gray-600 text-xs">
                                Roll: {record.student.rollNo}
                              </div>
                            </div>
                          )}
                          {record.class?.course && (
                            <div className="text-gray-700">
                              <span className="font-medium text-gray-800">
                                {record.class.course.courseCode}
                              </span>
                              {record.class.course.courseName && (
                                <p className="text-xs text-gray-600">
                                  {record.class.course.courseName}
                                </p>
                              )}
                            </div>
                          )}
                          {record.subject && (
                            <div className="text-xs text-gray-600 mt-1">
                              Subject: {record.subject}
                            </div>
                          )}
                          {userRole === "ADMIN" &&
                            record.class?.instructor && (
                              <div className="text-xs text-gray-600 mt-1">
                                Instructor: {record.class.instructor.name}
                              </div>
                            )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No attendance records for this date
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedDate && (
            <div className="text-center py-8 text-gray-500">
              Click on a date to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
