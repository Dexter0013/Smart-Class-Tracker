"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ChatPanel from "@/app/components/ChatPanel";
import {
  type CoursesJson,
  buildSubjectSystemPrompt,
  decodeParam,
  formatSemesterLabel,
} from "@/lib/catalog";

export default function SubjectQaPage() {
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

  const systemPrompt = useMemo(() => {
    if (!courses) return "";
    return buildSubjectSystemPrompt(courses, semesterKey, subjectName);
  }, [courses, semesterKey, subjectName]);

  const backHref = `/sem/${encodeURIComponent(semesterKey)}/${encodeURIComponent(subjectName)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <header className="mb-6">
          <div className="mb-2">
            <Link href={backHref} className="text-sm opacity-80 hover:opacity-100">
              ← {subjectName}
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Subject Q&amp;A</h1>
          <p className="text-sm opacity-80">
            {formatSemesterLabel(semesterKey)} • {subjectName}
          </p>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mb-4 rounded-xl border border-black/10 dark:border-white/15 p-4">
          <div className="text-sm font-medium">Context</div>
          <div className="text-sm opacity-80 mt-1">
            {isLoading
              ? "Loading subject context…"
              : subject?.context ?? "No subject context found in `public/courses.json`."}
          </div>
        </div>

        {systemPrompt ? (
          <ChatPanel system={systemPrompt} placeholder="Ask a subject question…" />
        ) : (
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-4 text-sm opacity-70">
            {isLoading ? "Loading…" : "Could not build a system prompt for this subject."}
          </div>
        )}
      </div>
    </div>
  );
}

