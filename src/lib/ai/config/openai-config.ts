import { env } from '@/lib/config';
import { ChatOpenAI } from '@langchain/openai';

// OpenAI Configuration
export const openaiConfig = {
  apiKey: env.OPENAI_API_KEY,
  model: 'gpt-4o-mini', // Cost-effective model for most tasks
  temperature: 0.7,
  maxTokens: 2000,
  timeout: 30000, // 30 seconds
};

// Image Generation Configuration
export const imageConfig = {
  model: 'dall-e-3',
  size: '1024x1024' as const,
  quality: 'standard' as const,
  style: 'natural' as const,
  n: 1,
};

// Chat Model Instance
export const chatModel = new ChatOpenAI({
  openAIApiKey: openaiConfig.apiKey,
  modelName: openaiConfig.model,
  temperature: openaiConfig.temperature,
  maxTokens: openaiConfig.maxTokens,
  timeout: openaiConfig.timeout,
});

// Text Generation Model Instance
export const textModel = new ChatOpenAI({
  openAIApiKey: openaiConfig.apiKey,
  modelName: openaiConfig.model,
  temperature: openaiConfig.temperature,
  maxTokens: openaiConfig.maxTokens,
  timeout: openaiConfig.timeout,
});

// Validation function
export const validateOpenAIConfig = (): boolean => {
  if (!env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    return false;
  }
  return true;
};

// Rate limiting configuration
export const rateLimitConfig = {
  maxRequestsPerMinute: 60,
  maxTokensPerMinute: 150000,
  maxRequestsPerDay: 1000,
};

// Cost tracking configuration
export const costConfig = {
  gpt4oMiniCostPer1kTokens: 0.00015, // $0.15 per 1M tokens
  dallE3CostPerImage: 0.04, // $0.04 per image
  maxDailyCost: 10, // $10 per day limit
};
