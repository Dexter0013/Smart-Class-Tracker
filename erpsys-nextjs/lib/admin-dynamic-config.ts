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

