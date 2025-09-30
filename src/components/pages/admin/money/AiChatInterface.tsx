"use client";

import { useState, useRef, useEffect } from "react";
import { useAiChat, useSendMessage, useUpdateAiChat } from "@/hooks/money";
import type { ChatMessage, AiAgent } from "@/types/money";
import {
  Button,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Send, Settings, Sparkles, Bot } from "lucide-react";

interface AiChatInterfaceProps {
  chatId: string;
}

export function AiChatInterface({ chatId }: AiChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chat, isLoading } = useAiChat(chatId);
  const sendMessage = useSendMessage();
  const updateChat = useUpdateAiChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage.mutateAsync({
      chatId,
      message: message.trim(),
    });

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAgentChange = async (newAgent: AiAgent) => {
    if (!chat) return;
    await updateChat.mutateAsync({
      id: chatId,
      chat: { agent: newAgent },
    });
  };

  const getAgentIcon = (agent: string) => {
    if (agent.includes('gpt')) return '🤖';
    if (agent.includes('claude')) return '🧠';
    if (agent.includes('gemini')) return '✨';
    return '🤖';
  };

  const getAgentColor = (agent: string) => {
    if (agent.includes('gpt-4')) return 'text-green-600 dark:text-green-400';
    if (agent.includes('gpt-3')) return 'text-blue-600 dark:text-blue-400';
    if (agent.includes('claude')) return 'text-purple-600 dark:text-purple-400';
    if (agent.includes('gemini')) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      {/* Header with Agent Info and Settings */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            {chat.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Agent Selector - Always visible */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getAgentIcon(chat.agent)}</span>
            <div className="min-w-[200px]">
              <Select value={chat.agent} onValueChange={(value) => handleAgentChange(value as AiAgent)}>
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">
                    <span className="flex items-center gap-2">
                      🤖 <span>GPT-4</span>
                      <span className="text-xs text-green-600 dark:text-green-400">(Best)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="gpt-4-turbo">
                    <span className="flex items-center gap-2">
                      🤖 <span>GPT-4 Turbo</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">(Fast)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="gpt-3.5-turbo">
                    <span className="flex items-center gap-2">
                      🤖 <span>GPT-3.5 Turbo</span>
                      <span className="text-xs text-gray-500">(Quick)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="claude-3-opus">
                    <span className="flex items-center gap-2">
                      🧠 <span>Claude 3 Opus</span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">(Soon)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="claude-3-sonnet">
                    <span className="flex items-center gap-2">
                      🧠 <span>Claude 3 Sonnet</span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">(Soon)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="claude-3-haiku">
                    <span className="flex items-center gap-2">
                      🧠 <span>Claude 3 Haiku</span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">(Soon)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="gemini-pro">
                    <span className="flex items-center gap-2">
                      ✨ <span>Gemini Pro</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">(Soon)</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Message count badge */}
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full">
              {chat.messages.length} messages
            </span>
          </div>
        </div>

        {/* Advanced Settings (collapsible) */}
        {showSettings && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Temperature:</span>
                <span className="ml-2 font-mono text-gray-900 dark:text-white">{chat.temperature || "0.7"}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Max Tokens:</span>
                <span className="ml-2 font-mono text-gray-900 dark:text-white">{chat.maxTokens || "Auto"}</span>
              </div>
            </div>
            {chat.systemPrompt && (
              <div className="text-xs">
                <span className="text-gray-600 dark:text-gray-400">System Prompt:</span>
                <p className="mt-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  {chat.systemPrompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Start a conversation
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Ask anything and get AI-powered responses
            </p>
          </div>
        ) : (
          <>
            {chat.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white"
                      : msg.role === "assistant"
                      ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                      : "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-gray-800 dark:text-yellow-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold opacity-80">
                      {msg.role === "user" ? (
                        <span className="flex items-center gap-1">
                          👤 You
                        </span>
                      ) : msg.role === "assistant" ? (
                        <span className="flex items-center gap-1">
                          {getAgentIcon(chat.agent)} AI Assistant
                        </span>
                      ) : (
                        "System"
                      )}
                    </span>
                    <span className="text-xs opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line, Enter to send)"
              rows={3}
              disabled={sendMessage.isPending}
              className="resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all pr-20"
            />
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
              {message.length}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
              className="h-full min-h-[88px] w-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
            >
              {sendMessage.isPending ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span className="text-xs">...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Send className="w-5 h-5" />
                  <span className="text-xs">Send</span>
                </div>
              )}
            </Button>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className={`flex items-center gap-1 ${getAgentColor(chat.agent)}`}>
            <Bot className="w-3 h-3" />
            Powered by {chat.agent}
          </span>
          {sendMessage.isPending && (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 animate-pulse">
              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-ping" />
              AI is thinking...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
