"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function StudentChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your educational assistant. I can help you with questions about your courses, assignments, grades, and provide study guidance. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.id !== "1")
            .map((m) => ({ role: m.role, content: m.content }))
            .concat([{ role: "user", content: input }]),
          context:
            "You are an educational assistant for the Smart Class Tracker ERP system. Help students with their courses, assignments, and academic questions.",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Hello! I'm your educational assistant. I can help you with questions about your courses, assignments, grades, and provide study guidance. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="student" username="Student" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="bg-teal-600 text-white p-6">
            <h1 className="text-2xl font-bold">Educational Assistant</h1>
            <p className="text-teal-100 mt-1">Ask questions about your courses and get help with your studies</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                  <p className="text-sm">Assistant is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question here..."
                disabled={loading}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition font-semibold"
              >
                Send
              </button>
            </form>
            <button
              onClick={handleClearChat}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear Chat History
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-teal-600 mb-2">💡 Tip</h3>
            <p className="text-sm text-gray-600">Ask about your courses and their content</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-teal-600 mb-2">📚 Study Help</h3>
            <p className="text-sm text-gray-600">Request explanations and study guidance</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-teal-600 mb-2">❓ Questions</h3>
            <p className="text-sm text-gray-600">Ask questions about assignments and grades</p>
          </div>
        </div>
      </div>
    </div>
  );
}
