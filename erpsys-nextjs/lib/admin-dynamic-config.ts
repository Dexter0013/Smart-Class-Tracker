export const adminDynamicIncludes: Record<string, any> = {
  class: {
    course: true,
    instructor: true,
    semester: true,
  },
  course: {
    department: true,
  },
  enrollment: {
    student: true,
    class: {
      include: {
        course: true,
        semester: true,
      },
    },
  },
  assessment: {
    class: {
      include: {
        course: true,
        semester: true,
      },
    },
  },
  studentMark: {
    student: true,
    assessment: {
      include: {
        class: {
          include: {
            course: true,
            semester: true,
          },
        },
      },
    },
  },
  student: {
    department: true,
  },
  instructor: {
    department: true,
  },
  department: {
    _count: {
      select: { students: true, instructors: true },
    },
  },
};

export function transformAdminBody(model: string, body: any): any {
  const parsed = { ...body };

  switch (model) {
    case "course":
      if (parsed.credits) {
        parsed.credits = parseInt(parsed.credits, 10) || 3;
      }
      break;
    case "assessment":
      if (parsed.maxMarks) {
        parsed.maxMarks = parseInt(parsed.maxMarks, 10);
      }
      if (parsed.assessmentDate) {
        parsed.assessmentDate = new Date(parsed.assessmentDate);
      }
      break;
    case "studentMark":
      if (parsed.marksObtained) {
        parsed.marksObtained = parseFloat(parsed.marksObtained);
      }
      break;
    case "semester":
      if (parsed.startDate) parsed.startDate = new Date(parsed.startDate);
      if (parsed.endDate) parsed.endDate = new Date(parsed.endDate);
      break;
  }

  return parsed;
}
