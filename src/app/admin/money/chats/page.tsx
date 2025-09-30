"use client";

import { useState } from "react";
import { useAiChats, useIdeaNodes, useIdeas, useCreateAiChat, useDeleteAiChat } from "@/hooks/money";
import { AiChatInterface } from "@/components/pages/admin/money";
import { FormModal } from "@/components/common/FormModal";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";
import type { AiAgent } from "@/types/money";

export default function AiChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [newChatNode, setNewChatNode] = useState("");
  const [newChatAgent, setNewChatAgent] = useState<AiAgent>("gpt-4");

  const { data: ideas } = useIdeas();
  const { data: nodes } = useIdeaNodes(selectedIdeaId);
  const { data: chats, isLoading } = useAiChats();
  const createChat = useCreateAiChat();
  const deleteChat = useDeleteAiChat();

  const handleCreateChat = async () => {
    if (!newChatTitle || !newChatNode) return;

    await createChat.mutateAsync({
      title: newChatTitle,
      ideaNodeId: newChatNode,
      agent: newChatAgent,
      visible: true,
      archived: false,
    });

    setNewChatTitle("");
    setNewChatNode("");
    setNewChatAgent("gpt-4");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteChat = async (chatId: string, ideaNodeId: string) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteChat.mutateAsync({ id: chatId, ideaNodeId });
      if (selectedChatId === chatId) {
        setSelectedChatId("");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading chats...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Chats</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Create Chat Modal */}
      <FormModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Create New AI Chat"
        size="lg"
        scrollable={false}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Create a new AI chat session linked to an idea node.
        </p>
        <div className="space-y-4">
              <div>
                <Label htmlFor="chat-title">Chat Title</Label>
                <Input
                  id="chat-title"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter chat title"
                />
              </div>
              <div>
                <Label htmlFor="idea-select">Select Idea</Label>
                <Select value={selectedIdeaId} onValueChange={setSelectedIdeaId}>
                  <SelectTrigger id="idea-select">
                    <SelectValue placeholder="Select an idea" />
                  </SelectTrigger>
                  <SelectContent>
                    {ideas?.map((idea) => (
                      <SelectItem key={idea.id} value={idea.id}>
                        {idea.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedIdeaId && (
                <div>
                  <Label htmlFor="node-select">Select Node</Label>
                  <Select value={newChatNode} onValueChange={setNewChatNode}>
                    <SelectTrigger id="node-select">
                      <SelectValue placeholder="Select a node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes?.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="agent-select">AI Agent</Label>
                <Select
                  value={newChatAgent}
                  onValueChange={(value) => setNewChatAgent(value as AiAgent)}
                >
                  <SelectTrigger id="agent-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateChat} disabled={!newChatTitle || !newChatNode}>
            Create Chat
          </Button>
        </div>
      </FormModal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat list */}
        <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-[700px] overflow-y-auto bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Chats</h2>
          {!chats || chats.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No chats yet. Create one to get started!</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedChatId === chat.id 
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700" 
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white">{chat.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Agent: {chat.agent}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {chat.messages.length} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id, chat.ideaNodeId);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat interface */}
        <div className="lg:col-span-2">
          {selectedChatId ? (
            <AiChatInterface chatId={selectedChatId} />
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center h-[700px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Select a chat from the list to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
