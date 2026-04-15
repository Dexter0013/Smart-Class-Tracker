export type CoursesJson = {
  system_role: string;
  CSE_Syllabus_ASTU: Record<
    string,
    {
      focus?: string;
      subjects: Array<{
        name: string;
        context?: string;
      }>;
    }
  >;
};

export type MaterialsJson = {
  description?: string;
  base_source?: string;
  semesters: Record<
    string,
    {
      pdf?: string;
      subjects: Record<
        string,
        {
          module_ref?: string;
          pdf?: string;
        }
      >;
    }
  >;
};

export function formatSemesterLabel(semesterKey: string) {
  return semesterKey.replace("_", " ");
}

export function semesterSortKey(semesterKey: string) {
  const match = semesterKey.match(/\d+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export function decodeParam(value: string | string[]) {
  const raw = Array.isArray(value) ? value[0] ?? "" : value;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function buildSubjectSystemPrompt(
  courses: CoursesJson,
  semesterKey: string,
  subjectName: string,
) {
  const semester = courses.CSE_Syllabus_ASTU[semesterKey];
  const subject = semester?.subjects?.find((s) => s.name === subjectName);

  const parts: string[] = [];
  if (courses.system_role?.trim()) parts.push(courses.system_role.trim());
  parts.push(`Semester: ${formatSemesterLabel(semesterKey)}`);
  if (semester?.focus?.trim()) parts.push(`Semester focus: ${semester.focus.trim()}`);
  parts.push(`Subject: ${subjectName}`);
  if (subject?.context?.trim()) parts.push(`Subject context: ${subject.context.trim()}`);

  return parts.join("\n");
}

