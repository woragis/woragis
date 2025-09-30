import { chatModel } from '../config/openai-config';
import { ContentGenerationService } from '../chains/content-generation';
import { ContentEnhancementService } from '../chains/content-enhancement';

// Simplified Content Agent
export class ContentAgent {

  // Generate blog post
  async generateBlogPost(params: {
    topic: string;
    audience?: string;
    tone?: string;
    length?: string;
  }) {
    try {
      const result = await ContentGenerationService.generateBlogPost({
        topic: params.topic,
        audience: params.audience || 'web developers',
        tone: params.tone || 'professional and engaging',
        length: params.length || '800-1200 words'
      });

      return result;
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
  async generateProjectDescription(params: {
    projectName: string;
    technologies: string[];
    projectType: string;
    features: string[];
    challenges: string[];
  }) {
    try {
      const result = await ContentGenerationService.generateProjectDescription({
        projectName: params.projectName,
        technologies: params.technologies.join(', '),
        projectType: params.projectType,
        features: params.features.join(', '),
        challenges: params.challenges.join(', ')
      });

      return result;
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
  async generateAboutContent(params: {
    category: string;
    currentInfo: string;
    goals: string;
    experienceLevel: string;
  }) {
    try {
      const result = await ContentGenerationService.generateAboutContent({
        category: params.category,
        currentInfo: params.currentInfo,
        goals: params.goals,
        experienceLevel: params.experienceLevel
      });

      return result;
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

  // Enhance existing content
  async enhanceContent(params: {
    content: string;
    contentType: string;
    goals: string;
    audience?: string;
  }) {
    try {
      const result = await ContentEnhancementService.enhanceContent({
        originalContent: params.content,
        goals: params.goals,
        audience: params.audience || 'web developers',
        contentType: params.contentType
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content enhancement failed',
        metadata: {
          type: 'content_enhancement',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Analyze content quality
  async analyzeContent(params: {
    content: string;
    contentType: string;
    goals?: string;
  }) {
    try {
      const result = await ContentEnhancementService.analyzeContent({
        content: params.content,
        contentType: params.contentType,
        goals: params.goals || 'general quality assessment'
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content analysis failed',
        metadata: {
          type: 'content_analysis',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Suggest tags and categories
  async suggestTags(params: {
    content: string;
    contentType: string;
    existingTags?: string[];
  }) {
    try {
      const result = await ContentEnhancementService.suggestTags({
        content: params.content,
        contentType: params.contentType,
        existingTags: params.existingTags
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tag suggestion failed',
        metadata: {
          type: 'tag_suggestion',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Optimize content for SEO
  async optimizeForSEO(params: {
    content: string;
    keywords: string[];
    contentType: string;
    audience?: string;
  }) {
    try {
      const result = await ContentGenerationService.optimizeForSEO({
        content: params.content,
        keywords: params.keywords.join(', '),
        audience: params.audience || 'web developers',
        contentType: params.contentType
      });

      return result;
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

  // Batch content operations
  async batchProcess(operations: Array<{
    type: 'generate' | 'enhance' | 'analyze' | 'optimize' | 'tag';
    params: any;
  }>) {
    const results = [];
    
    for (const operation of operations) {
      let result;
      
      switch (operation.type) {
        case 'generate':
          if (operation.params.topic) {
            result = await this.generateBlogPost(operation.params);
          } else {
            result = await this.generateProjectDescription(operation.params);
          }
          break;
        case 'enhance':
          result = await this.enhanceContent(operation.params);
          break;
        case 'analyze':
          result = await this.analyzeContent(operation.params);
          break;
        case 'optimize':
          result = await this.optimizeForSEO(operation.params);
          break;
        case 'tag':
          result = await this.suggestTags(operation.params);
          break;
        default:
          result = {
            success: false,
            error: `Unknown operation type: ${operation.type}`
          };
      }
      
      results.push({
        type: operation.type,
        ...result
      });
    }
    
    return {
      success: true,
      results,
      totalProcessed: operations.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }
}

// Export singleton instance
export const contentAgent = new ContentAgent();
