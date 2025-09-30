import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { env } from '@/lib/config';
import type { AiAgent, ChatMessage } from '@/types/money';

// Model configurations for different agents
const modelConfigs = {
  'gpt-4': {
    modelName: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4000,
  },
  'gpt-4-turbo': {
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 4000,
  },
  'gpt-3.5-turbo': {
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
  },
  // For now, we'll use OpenAI for all until other providers are configured
  'claude-3-opus': {
    modelName: 'gpt-4', // Fallback to GPT-4
    temperature: 0.7,
    maxTokens: 4000,
  },
  'claude-3-sonnet': {
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 4000,
  },
  'claude-3-haiku': {
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
  },
  'gemini-pro': {
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 4000,
  },
  'custom': {
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
  },
};

export class MoneyChatAgent {
  async sendMessage(params: {
    message: string;
    messages: ChatMessage[];
    agent: AiAgent;
    systemPrompt?: string;
    temperature?: string;
    maxTokens?: string;
  }): Promise<{
    success: boolean;
    response?: string;
    error?: string;
  }> {
    try {
      const config = modelConfigs[params.agent] || modelConfigs['gpt-4'];
      
      // Create chat model with custom configuration
      const model = new ChatOpenAI({
        openAIApiKey: env.OPENAI_API_KEY,
        modelName: config.modelName,
        temperature: params.temperature ? parseFloat(params.temperature) : config.temperature,
        maxTokens: params.maxTokens ? parseInt(params.maxTokens) : config.maxTokens,
        timeout: 60000, // 60 seconds
      });

      // Build message history
      const messageHistory = params.messages
        .slice(-10) // Keep last 10 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create prompt with system message and history
      const systemMessage = params.systemPrompt || 
        "You are a helpful AI assistant. Provide thoughtful, accurate, and concise responses.";

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        ["human", `Previous conversation:\n${messageHistory}\n\nUser: {message}`],
      ]);

      const chain = prompt.pipe(model);
      
      const result = await chain.invoke({
        message: params.message,
      });

      return {
        success: true,
        response: result.content as string,
      };
    } catch (error) {
      console.error('Money chat agent error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate response',
      };
    }
  }
}

// Export singleton instance
export const moneyChatAgent = new MoneyChatAgent();
