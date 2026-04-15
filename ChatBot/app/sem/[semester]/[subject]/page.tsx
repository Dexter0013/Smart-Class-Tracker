"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type CoursesJson,
  decodeParam,
  formatSemesterLabel,
} from "@/lib/catalog";

export default function SubjectHomePage() {
  const params = useParams<{ semester: string | string[]; subject: string | string[] }>();
  const semesterKey = decodeParam(params.semester);
  const subjectName = decodeParam(params.subject);

  const [courses, setCourses] = useState<CoursesJson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/courses.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load courses.json (HTTP ${res.status})`);
        const json = (await res.json()) as CoursesJson;
        if (!cancelled) setCourses(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Request failed");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const semester = courses?.CSE_Syllabus_ASTU?.[semesterKey];

  const subject = useMemo(() => {
    return semester?.subjects?.find((s) => s.name === subjectName);
  }, [semester, subjectName]);

  const subjectBase = `/sem/${encodeURIComponent(semesterKey)}/${encodeURIComponent(subjectName)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <header className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <Link
              href={`/sem/${encodeURIComponent(semesterKey)}`}
              className="text-sm opacity-80 hover:opacity-100"
            >
              ← {formatSemesterLabel(semesterKey)}
            </Link>
            <span className="text-sm opacity-60">/</span>
            <span className="text-sm opacity-80">{subjectName}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{subjectName}</h1>
          <p className="text-sm opacity-80">
            {isLoading ? "Loading…" : subject?.context ?? "Pick an option."}
          </p>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`${subjectBase}/materials`}
            className="rounded-xl border border-black/10 dark:border-white/15 p-5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <div className="font-medium">Materials</div>
            <div className="text-sm opacity-70">
              PDFs and module references from `public/materials.json`.
            </div>
          </Link>

          <Link
            href={`${subjectBase}/qa`}
            className="rounded-xl border border-black/10 dark:border-white/15 p-5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <div className="font-medium">Subject Q&amp;A</div>
            <div className="text-sm opacity-70">
              Chat with subject-specific context from `public/courses.json`.
            </div>
          </Link>
        </div>

        {!isLoading && (!semester || !subject) ? (
          <div className="mt-4 rounded-xl border border-black/10 dark:border-white/15 p-4 text-sm opacity-70">
            This subject/semester pair wasn’t found in `public/courses.json` (links still work if you want to add it).
          </div>
        ) : null}
      </div>
    </div>
  );
}

