"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type CoursesJson,
  decodeParam,
  formatSemesterLabel,
} from "@/lib/catalog";

export default function SemesterPage() {
  const params = useParams<{ semester: string | string[] }>();
  const semesterKey = decodeParam(params.semester);

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

  const subjects = useMemo(() => {
    return semester?.subjects?.map((s) => s.name) ?? [];
  }, [semester]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <header className="mb-6">
          <div className="mb-2">
            <Link href="/" className="text-sm opacity-80 hover:opacity-100">
              ← Home
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatSemesterLabel(semesterKey)}
          </h1>
          <p className="text-sm opacity-80">{semester?.focus ?? "Choose a subject."}</p>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <h2 className="text-sm font-medium mb-3">Subjects</h2>
          {isLoading ? (
            <div className="text-sm opacity-70">Loading…</div>
          ) : !semester ? (
            <div className="text-sm opacity-70">
              Semester not found in `public/courses.json`.
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-sm opacity-70">No subjects listed.</div>
          ) : (
            <div className="space-y-2">
              {semester.subjects.map((s) => (
                <Link
                  key={s.name}
                  href={`/sem/${encodeURIComponent(semesterKey)}/${encodeURIComponent(s.name)}`}
                  className="block rounded-xl border border-black/10 dark:border-white/15 p-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm opacity-70">{s.context ?? "Open subject"}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

