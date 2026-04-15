"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type CoursesJson,
  formatSemesterLabel,
  semesterSortKey,
} from "@/lib/catalog";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CoursesJson | null>(null);
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

  const semesters = useMemo(() => {
    const keys = courses ? Object.keys(courses.CSE_Syllabus_ASTU ?? {}) : [];
    return keys.slice().sort((a, b) => semesterSortKey(a) - semesterSortKey(b));
  }, [courses]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            BVEC Study Hub
          </h1>
          <p className="text-sm opacity-80">
            Choose a semester, then pick a subject.
          </p>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <h2 className="text-sm font-medium mb-3">Semesters</h2>
          {isLoading ? (
            <div className="text-sm opacity-70">Loading…</div>
          ) : semesters.length === 0 ? (
            <div className="text-sm opacity-70">No semesters found in `public/courses.json`.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {semesters.map((semesterKey) => (
                <Link
                  key={semesterKey}
                  href={`/sem/${semesterKey}`}
                  className="rounded-xl border border-black/10 dark:border-white/15 p-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="font-medium">{formatSemesterLabel(semesterKey)}</div>
                  <div className="text-sm opacity-70">
                    {courses?.CSE_Syllabus_ASTU?.[semesterKey]?.focus ?? "View subjects"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
