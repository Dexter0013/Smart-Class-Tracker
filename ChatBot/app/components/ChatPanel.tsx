"use client";

import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Thinking">
      <span
        className="inline-block h-2 w-2 rounded-full bg-current opacity-60 animate-pulse"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="inline-block h-2 w-2 rounded-full bg-current opacity-60 animate-pulse"
        style={{ animationDelay: "180ms" }}
      />
      <span
        className="inline-block h-2 w-2 rounded-full bg-current opacity-60 animate-pulse"
        style={{ animationDelay: "360ms" }}
      />
    </span>
  );
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPanel({
  system,
  placeholder = "Ask a question…",
}: {
  system: string;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => !isSending && input.trim().length > 0,
    [isSending, input],
  );

  async function send() {
    if (!canSend) return;

    const userText = input.trim();
    setInput("");
    setError(null);

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(nextMessages);
    setIsSending(true);

    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system,
          messages: nextMessages,
        }),
      });

      const json = (await res.json()) as { content?: string; error?: string };
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.content || "" },
      ]);

      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/15">
      <div ref={listRef} className="h-[52vh] overflow-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm opacity-70">
            Ask anything about the syllabus/topics for this subject.
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm whitespace-pre-wrap"
                    : "max-w-[85%] rounded-2xl bg-black/5 dark:bg-white/10 px-4 py-2 text-sm whitespace-pre-wrap"
                }
              >
                {m.role === "assistant" ? (
                  <div className="break-words whitespace-normal [&_p]:m-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1 [&_pre]:my-2 [&_pre]:overflow-auto [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-black/15 dark:[&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:opacity-90 [&_table]:my-2 [&_table]:w-full [&_table]:text-left [&_th]:border [&_th]:border-black/10 dark:[&_th]:border-white/15 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-black/10 dark:[&_td]:border-white/15 [&_td]:px-2 [&_td]:py-1 [&_.katex-display]:my-2 [&_.katex-display]:overflow-auto [&_.footnotes]:mt-4 [&_.footnotes]:text-xs [&_.footnotes]:opacity-80 [&_.footnotes_hr]:my-3 [&_.footnotes_ol]:pl-5 [&_sup]:text-xs [&_sup>a]:no-underline">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        em: ({ node, ...props }) => <strong {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        code: ({ node, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || "");

                          if (match) {
                            return (
                              <SyntaxHighlighter
                                {...props}
                                language={match[1]}
                                style={oneDark}
                                customStyle={{
                                  margin: 0,
                                  background: "transparent",
                                }}
                                codeTagProps={{
                                  style: {
                                    fontSize: "0.875em",
                                  },
                                }}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            );
                          }

                          return (
                            <code
                              {...props}
                              className="rounded bg-black/10 dark:bg-white/10 px-1 py-0.5"
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))
        )}

        {isSending ? (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl bg-black/5 dark:bg-white/10 px-4 py-2 text-sm">
              <ThinkingDots />
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-black/10 dark:border-white/15 p-3">
        {error ? (
          <div className="mb-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <div className="flex gap-2">
          <textarea
            className="flex-1 resize-none rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            rows={2}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <button
            type="button"
            className="h-[44px] rounded-lg bg-foreground text-background px-4 text-sm font-medium disabled:opacity-50"
            onClick={() => void send()}
            disabled={!canSend}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
