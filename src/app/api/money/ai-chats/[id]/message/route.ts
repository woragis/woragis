import { NextRequest } from "next/server";
import { aiChatsService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";
import { moneyChatAgent } from "@/lib/ai/agents/money-chat-agent";
import type { ChatMessage } from "@/types/money";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/money/ai-chats/[id]/message - Send a message to the AI
export const POST = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const { message } = await request.json();
  
  if (!message || !message.trim()) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get the chat to retrieve configuration
  const chatResult = await aiChatsService.getChatById(id, authResult.userId);
  if (!chatResult.success || !chatResult.data) {
    return new Response(JSON.stringify({ error: "Chat not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const chat = chatResult.data;

  // Create user message
  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: message.trim(),
    timestamp: new Date(),
  };

  // Add user message to chat
  await aiChatsService.addMessage(id, userMessage, authResult.userId);

  // Generate AI response
  const aiResponse = await moneyChatAgent.sendMessage({
    message: message.trim(),
    messages: chat.messages,
    agent: chat.agent as any,
    systemPrompt: chat.systemPrompt || undefined,
    temperature: chat.temperature || undefined,
    maxTokens: chat.maxTokens || undefined,
  });

  // Create assistant message
  const assistantMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: aiResponse.success 
      ? aiResponse.response! 
      : `Error: ${aiResponse.error || 'Failed to generate response'}`,
    timestamp: new Date(),
  };

  // Add assistant message to chat
  const result = await aiChatsService.addMessage(id, assistantMessage, authResult.userId);
  
  return handleServiceResult(
    {
      success: true,
      data: {
        userMessage,
        assistantMessage,
        chat: result.data,
      },
    },
    "Message sent successfully"
  );
});
