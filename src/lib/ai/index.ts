// AI Library Main Export
// This file provides a centralized export for all AI functionality

// Configuration
export { 
  openaiConfig, 
  imageConfig, 
  chatModel, 
  textModel, 
  validateOpenAIConfig,
  rateLimitConfig,
  costConfig 
} from './config/openai-config';

// Agents
export { contentAgent } from './agents/content-agent';
export { imageAgent } from './agents/image-agent';
export { chatAgent } from './agents/chat-agent';
export { adminAgent } from './agents/admin-agent';

// Import agents for internal use
import { contentAgent } from './agents/content-agent';
import { imageAgent } from './agents/image-agent';
import { chatAgent } from './agents/chat-agent';
import { adminAgent } from './agents/admin-agent';

// Chains
export { 
  blogPostGenerationChain,
  projectDescriptionChain,
  aboutContentChain,
  seoOptimizationChain,
  ContentGenerationService 
} from './chains/content-generation';

// Import services for internal use
import { ContentGenerationService } from './chains/content-generation';
import { aiRateLimiter } from './utils/rate-limiter';
import { aiCostTracker } from './utils/cost-tracker';
import { validateOpenAIConfig } from './config/openai-config';

export { 
  contentEnhancementChain,
  contentAnalysisChain,
  tagSuggestionChain,
  ContentEnhancementService 
} from './chains/content-enhancement';

// Tools
export { databaseTools } from './tools/database-tools';
export { fileTools } from './tools/file-tools';

// Prompts
export * from '../prompts/content-prompts';
export * from '../prompts/chat-prompts';

// Utilities
export { aiRateLimiter } from './utils/rate-limiter';
export { aiCostTracker, calculateCost } from './utils/cost-tracker';

// Types
export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    type: string;
    generatedAt?: string;
    [key: string]: any;
  };
}

export interface ContentGenerationParams {
  topic: string;
  audience?: string;
  tone?: string;
  length?: string;
}

export interface ProjectDescriptionParams {
  projectName: string;
  technologies: string[];
  projectType: string;
  features: string[];
  challenges: string[];
}

export interface ImageGenerationParams {
  type: 'instrument' | 'martial_arts' | 'project' | 'blog' | 'hobby' | 'social' | 'custom';
  params: {
    [key: string]: any;
  };
}

export interface ChatParams {
  message: string;
  context?: string;
  visitorType?: 'potential_client' | 'developer' | 'student' | 'general';
}

export interface AdminParams {
  action: 'form_assistance' | 'content_optimization' | 'content_analysis' | 'tag_suggestions' | 'portfolio_insights' | 'content_generation' | 'workflow_optimization' | 'batch_process';
  params: {
    [key: string]: any;
  };
}

// Main AI Service Class
export class AIService {
  // Content Generation
  static async generateBlogPost(params: ContentGenerationParams): Promise<AIResponse> {
    return await contentAgent.generateBlogPost(params);
  }

  static async generateProjectDescription(params: ProjectDescriptionParams): Promise<AIResponse> {
    return await contentAgent.generateProjectDescription(params);
  }

  static async generateAboutContent(params: {
    category: string;
    currentInfo: string;
    goals?: string;
    experienceLevel?: string;
  }): Promise<AIResponse> {
    return await ContentGenerationService.generateAboutContent({
      category: params.category,
      currentInfo: params.currentInfo,
      goals: params.goals || 'Create engaging and informative content',
      experienceLevel: params.experienceLevel || 'intermediate'
    });
  }

  // Content Enhancement
  static async enhanceContent(params: {
    content: string;
    contentType: string;
    goals: string;
    audience?: string;
  }): Promise<AIResponse> {
    return await contentAgent.enhanceContent(params);
  }

  static async analyzeContent(params: {
    content: string;
    contentType: string;
    goals?: string;
  }): Promise<AIResponse> {
    return await contentAgent.analyzeContent(params);
  }

  static async suggestTags(params: {
    content: string;
    contentType: string;
    existingTags?: string[];
  }): Promise<AIResponse> {
    return await contentAgent.suggestTags(params);
  }

  // Image Generation
  static async generateImage(params: ImageGenerationParams): Promise<AIResponse> {
    const { type, params: imageParams } = params;
    
    switch (type) {
      case 'instrument':
        return await imageAgent.generateInstrumentImage(imageParams as {
          instrument: string;
          style?: string;
          context?: string;
        });
      case 'martial_arts':
        return await imageAgent.generateMartialArtsImage(imageParams as {
          martialArt: string;
          style?: string;
          context?: string;
        });
      case 'project':
        return await imageAgent.generateProjectThumbnail(imageParams as {
          projectName: string;
          technologies: string[];
          projectType: string;
          style?: string;
        });
      case 'blog':
        return await imageAgent.generateBlogFeaturedImage(imageParams as {
          blogTitle: string;
          topic: string;
          style?: string;
          mood?: string;
        });
      case 'hobby':
        return await imageAgent.generateHobbyImage(imageParams as {
          hobby: string;
          context?: string;
          style?: string;
        });
      case 'social':
        return await imageAgent.generateSocialMediaAsset(imageParams as {
          purpose: string;
          content: string;
          platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
          style?: string;
        });
      case 'custom':
        return await imageAgent.generateCustomImage(imageParams as {
          prompt: string;
          style?: string;
          size?: string;
          quality?: 'standard' | 'hd';
        });
      default:
        return {
          success: false,
          error: 'Invalid image type'
        };
    }
  }

  // Chat
  static async chat(params: ChatParams): Promise<AIResponse> {
    return await chatAgent.chat(params);
  }

  static async recommendProjects(params: {
    interests: string[];
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    projectType?: 'web' | 'mobile' | 'backend' | 'fullstack';
  }): Promise<AIResponse> {
    return await chatAgent.recommendProjects(params);
  }

  // Admin
  static async adminAssist(params: AdminParams): Promise<AIResponse> {
    const { action, params: adminParams } = params;
    
    switch (action) {
      case 'form_assistance':
        return await adminAgent.assistWithForm(adminParams as {
          formType: 'blog' | 'project' | 'about' | 'experience' | 'education';
          currentData?: any;
          goals?: string;
        });
      case 'content_optimization':
        return await adminAgent.optimizeContent(adminParams as {
          content: string;
          contentType: string;
          goals: string[];
          targetAudience?: string;
        });
      case 'content_analysis':
        return await adminAgent.analyzeContentQuality(adminParams as {
          content: string;
          contentType: string;
          criteria?: string[];
        });
      case 'tag_suggestions':
        return await adminAgent.suggestTagsAndCategories(adminParams as {
          content: string;
          contentType: string;
          existingTags?: string[];
        });
      case 'portfolio_insights':
        return await adminAgent.generatePortfolioInsights(adminParams as {
          timeframe?: 'week' | 'month' | 'quarter' | 'year';
          focus?: 'content' | 'engagement' | 'seo' | 'all';
        });
      case 'content_generation':
        return await adminAgent.assistContentGeneration(adminParams as {
          contentType: 'blog' | 'project' | 'about' | 'experience';
          topic?: string;
          requirements?: string[];
          style?: string;
        });
      case 'workflow_optimization':
        return await adminAgent.optimizeWorkflow(adminParams as {
          currentWorkflow: string;
          painPoints?: string[];
          goals?: string[];
        });
      case 'batch_process':
        return await adminAgent.batchProcess(adminParams as {
          operations: Array<{
            type: 'analyze' | 'optimize' | 'suggest' | 'generate';
            content?: string;
            contentType?: string;
            requirements?: any;
          }>;
        });
      default:
        return {
          success: false,
          error: 'Invalid admin action'
        };
    }
  }

  // Utility Methods
  static async checkRateLimit(identifier: string): Promise<boolean> {
    const result = await aiRateLimiter.checkRateLimit(identifier, 60, 60000); // 60 requests per minute
    return result.allowed;
  }

  static trackCost(operation: string, cost: number): void {
    aiCostTracker.trackCost(operation, cost);
  }

  static getCostStats() {
    return aiCostTracker.getCostStats();
  }

  // Health Check
  static async healthCheck(): Promise<{
    openai: boolean;
    rateLimiter: boolean;
    costTracker: boolean;
  }> {
    return {
      openai: validateOpenAIConfig(),
      rateLimiter: true, // Always available (memory fallback)
      costTracker: true
    };
  }
}

// Default export
export default AIService;
