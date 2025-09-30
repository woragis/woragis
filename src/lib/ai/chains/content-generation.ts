import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { chatModel } from '../config/openai-config';
import { 
  BLOG_POST_PROMPT, 
  PROJECT_DESCRIPTION_PROMPT, 
  ABOUT_CONTENT_PROMPT,
  SEO_OPTIMIZATION_PROMPT 
} from '../../prompts/content-prompts';

// Blog Post Generation Chain
export const blogPostGenerationChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(BLOG_POST_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// Project Description Generation Chain
export const projectDescriptionChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(PROJECT_DESCRIPTION_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// About Content Generation Chain
export const aboutContentChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(ABOUT_CONTENT_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// SEO Optimization Chain
export const seoOptimizationChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(SEO_OPTIMIZATION_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// Content Generation Service
export class ContentGenerationService {
  // Generate blog post
  static async generateBlogPost(params: {
    topic: string;
    audience: string;
    tone: string;
    length: string;
  }) {
    try {
      const result = await blogPostGenerationChain.invoke(params);
      return {
        success: true,
        content: result,
        metadata: {
          type: 'blog_post',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Blog post generation failed',
        metadata: {
          type: 'blog_post',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate project description
  static async generateProjectDescription(params: {
    projectName: string;
    technologies: string;
    projectType: string;
    features: string;
    challenges: string;
  }) {
    try {
      const result = await projectDescriptionChain.invoke(params);
      return {
        success: true,
        content: result,
        metadata: {
          type: 'project_description',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Project description generation failed',
        metadata: {
          type: 'project_description',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate about content
  static async generateAboutContent(params: {
    category: string;
    currentInfo: string;
    goals: string;
    experienceLevel: string;
  }) {
    try {
      const result = await aboutContentChain.invoke(params);
      return {
        success: true,
        content: result,
        metadata: {
          type: 'about_content',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'About content generation failed',
        metadata: {
          type: 'about_content',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Optimize content for SEO
  static async optimizeForSEO(params: {
    content: string;
    keywords: string;
    audience: string;
    contentType: string;
  }) {
    try {
      const result = await seoOptimizationChain.invoke(params);
      return {
        success: true,
        content: result,
        metadata: {
          type: 'seo_optimization',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SEO optimization failed',
        metadata: {
          type: 'seo_optimization',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Batch content generation
  static async generateBatchContent(requests: Array<{
    type: 'blog' | 'project' | 'about' | 'seo';
    params: any;
  }>) {
    const results = [];
    
    for (const request of requests) {
      let result;
      
      switch (request.type) {
        case 'blog':
          result = await this.generateBlogPost(request.params);
          break;
        case 'project':
          result = await this.generateProjectDescription(request.params);
          break;
        case 'about':
          result = await this.generateAboutContent(request.params);
          break;
        case 'seo':
          result = await this.optimizeForSEO(request.params);
          break;
        default:
          result = {
            success: false,
            error: `Unknown content type: ${request.type}`
          };
      }
      
      results.push({
        type: request.type,
        ...result
      });
    }
    
    return {
      success: true,
      results,
      totalProcessed: requests.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }
}
