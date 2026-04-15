import { lmStudioChat, type ChatMessage } from "@/lib/lmstudio";
import { getServerEnv } from "@/lib/server-env";

export const runtime = "nodejs";

type ChatRequestBody = {
  input?: string;
  messages?: ChatMessage[];
  system?: string;
};

export async function POST(req: Request) {
  try {
    const serverEnv = getServerEnv();
    const body = (await req.json()) as ChatRequestBody;

    const messages: ChatMessage[] = [];
    if (body.system?.trim()) {
      messages.push({ role: "system", content: body.system.trim() });
    }

    if (Array.isArray(body.messages) && body.messages.length > 0) {
      messages.push(
        ...body.messages.filter(
          (m): m is ChatMessage =>
            !!m &&
            (m.role === "system" ||
              m.role === "user" ||
              m.role === "assistant") &&
            typeof m.content === "string",
        ),
      );
    } else if (body.input?.trim()) {
      messages.push({ role: "user", content: body.input.trim() });
    }

    if (messages.length === 0) {
      return Response.json(
        { error: "Provide `input` or `messages`." },
        { status: 400 },
      );
    }

    const content = await lmStudioChat(messages, {
      baseUrl: serverEnv.lmStudioBaseUrl,
      apiKey: serverEnv.lmStudioApiKey,
      model: serverEnv.lmStudioModel,
    });

    return Response.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
