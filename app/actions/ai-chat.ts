"use server";

import { callAIStream } from "@/lib/ai-api.js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function streamAIResponse(
  message: string,
  history: Message[],
): Promise<ReadableStream> {
  if (!message || typeof message !== "string") {
    throw new Error("Message is required");
  }

  // Build conversation context
  let conversationContext = "";
  if (history && history.length > 0) {
    // Take last 10 messages for context
    const recentHistory = history.slice(-10);
    conversationContext = recentHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
      )
      .join("\n");
  }

  const systemPrompt = `You are a helpful AI assistant for the NYU-GO application, a shuttle bus tracking system for NYU students. 
You can help users with:
- Understanding how to use the app
- Finding bus schedules and routes
- Tracking shuttle locations
- General questions about NYU transportation

Be friendly, concise, and helpful. If you don't know something specific about the app, be honest about it.

App Instructions:
- The NYU-GO app provides real-time tracking of NYU shuttle buses.
- Users can view bus locations on a map, see estimated arrival times, and get route information.
- Add routes to home screen to track shuttle buses.
- The remaining time shown is an estimate and may vary due to traffic conditions. And it means the time left for the shuttle to arrive at the selected stop (on top of the home screen).
- You can mark stops as favorites for quick access.

`;

  const userPrompt = conversationContext
    ? `${conversationContext}\nUser: ${message}`
    : message;

  // Call the AI streaming API
  const stream = await callAIStream(
    process.env.OPENAI_MODEL || "gpt-4o-mini",
    userPrompt,
    systemPrompt,
    {
      temperature: 0.7,
      max_tokens: 1000,
    },
  );

  // Create a readable stream
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for await (const chunk of stream as any) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          if (content) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.error(error);
      }
    },
  });

  return readableStream;
}
