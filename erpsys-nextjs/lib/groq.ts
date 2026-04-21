import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function chat(
  messages: ChatMessage[],
  context?: string,
): Promise<string> {
  try {
    const systemPrompt = context
      ? `You are a helpful educational assistant for a Smart Class Tracker ERP system. ${context}`
      : `You are a helpful educational assistant for a Smart Class Tracker ERP system.
        You help students with their coursework, assignments, grades, and academic inquiries.
        Provide clear, concise, and helpful responses.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      model: process.env.GROQ_MODEL || "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from Groq API");
    }

    return response;
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

export async function generateContextualResponse(
  userMessage: string,
  userType: "student" | "admin",
  context: string,
): Promise<string> {
  const systemContext = `${context}
    The user is a ${userType}.
    Provide helpful, accurate, and context-aware responses.
    Keep responses concise and educational.`;

  return chat(
    [
      {
        role: "user",
        content: userMessage,
      },
    ],
    systemContext,
  );
}
