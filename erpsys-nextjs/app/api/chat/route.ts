import { NextRequest, NextResponse } from "next/server";
import { chat, ChatMessage } from "@/lib/groq";

interface ChatRequest {
  messages: ChatMessage[];
  context?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    const response = await chat(messages, context);

    return NextResponse.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process chat request",
      },
      { status: 500 },
    );
  }
}
