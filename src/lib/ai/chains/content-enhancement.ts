import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { chatModel } from '../config/openai-config';
import { 
  CONTENT_ENHANCEMENT_PROMPT,
  CONTENT_ANALYSIS_PROMPT,
  TAG_SUGGESTION_PROMPT 
} from '../../prompts/content-prompts';

// Content Enhancement Chain
export const contentEnhancementChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(CONTENT_ENHANCEMENT_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// Content Analysis Chain
export const contentAnalysisChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(CONTENT_ANALYSIS_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// Tag Suggestion Chain
export const tagSuggestionChain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(TAG_SUGGESTION_PROMPT),
  chatModel,
  new StringOutputParser(),
]);

// Content Enhancement Service
export class ContentEnhancementService {
  // Enhance existing content
  static async enhanceContent(params: {
    originalContent: string;
    goals: string;
    audience: string;
    contentType: string;
  }) {
    try {
      const result = await contentEnhancementChain.invoke(params);
      return {
        success: true,
        enhancedContent: result,
        metadata: {
          type: 'content_enhancement',
          enhancedAt: new Date().toISOString(),
          originalLength: params.originalContent.length,
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content enhancement failed',
        metadata: {
          type: 'content_enhancement',
          enhancedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Analyze content quality
  static async analyzeContent(params: {
    content: string;
    contentType: string;
    goals: string;
  }) {
    try {
      const result = await contentAnalysisChain.invoke(params);
      return {
        success: true,
        analysis: result,
        metadata: {
          type: 'content_analysis',
          analyzedAt: new Date().toISOString(),
          contentLength: params.content.length,
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content analysis failed',
        metadata: {
          type: 'content_analysis',
          analyzedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Suggest tags for content
  static async suggestTags(params: {
    content: string;
    contentType: string;
    existingTags?: string[];
  }) {
    try {
      const result = await tagSuggestionChain.invoke({
        ...params,
        existingTags: params.existingTags?.join(', ') || ''
      });
      return {
        success: true,
        suggestedTags: result,
        metadata: {
          type: 'tag_suggestion',
          suggestedAt: new Date().toISOString(),
          contentLength: params.content.length,
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tag suggestion failed',
        metadata: {
          type: 'tag_suggestion',
          suggestedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Comprehensive content improvement
  static async improveContent(params: {
    content: string;
    contentType: string;
    goals: string;
    audience: string;
    includeAnalysis?: boolean;
    includeTags?: boolean;
  }) {
    const results: any = {
      success: true,
      improvements: {},
      metadata: {
        type: 'comprehensive_improvement',
        improvedAt: new Date().toISOString(),
        params
      }
    };

    try {
      // Enhance content
      const enhancement = await this.enhanceContent({
        originalContent: params.content,
        goals: params.goals,
        audience: params.audience,
        contentType: params.contentType
      });

      results.improvements.enhancement = enhancement;

      // Analyze content if requested
      if (params.includeAnalysis) {
        const analysis = await this.analyzeContent({
          content: params.content,
          contentType: params.contentType,
          goals: params.goals
        });
        results.improvements.analysis = analysis;
      }

      // Suggest tags if requested
      if (params.includeTags) {
        const tags = await this.suggestTags({
          content: params.content,
          contentType: params.contentType
        });
        results.improvements.tags = tags;
      }

      return results;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content improvement failed',
        metadata: {
          type: 'comprehensive_improvement',
          improvedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Batch content enhancement
  static async enhanceBatchContent(requests: Array<{
    content: string;
    contentType: string;
    goals: string;
    audience: string;
  }>) {
    const results = [];
    
    for (const request of requests) {
      const result = await this.enhanceContent({
        originalContent: request.content,
        goals: request.goals,
        audience: request.audience,
        contentType: request.contentType
      });
      results.push({
        originalContent: request.content,
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

  // Content quality scoring
  static async scoreContentQuality(params: {
    content: string;
    contentType: string;
    criteria?: string[];
  }) {
    try {
      const analysis = await this.analyzeContent({
        content: params.content,
        contentType: params.contentType,
        goals: 'quality_assessment'
      });

      // Extract quality score from analysis (this would be more sophisticated in practice)
      const qualityScore = this.extractQualityScore(analysis.analysis || '');
      
      return {
        success: true,
        qualityScore,
        analysis: analysis.analysis,
        recommendations: this.generateRecommendations(qualityScore),
        metadata: {
          type: 'quality_scoring',
          scoredAt: new Date().toISOString(),
          contentLength: params.content.length,
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Quality scoring failed',
        metadata: {
          type: 'quality_scoring',
          scoredAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Helper methods
  private static extractQualityScore(analysis: string): number {
    // Simple extraction - in practice, this would be more sophisticated
    const scoreMatch = analysis.match(/(\d+)\/10|score[:\s]*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 7;
  }

  private static generateRecommendations(score: number): string[] {
    const recommendations = [];
    
    if (score < 5) {
      recommendations.push('Consider significant content restructuring');
      recommendations.push('Improve clarity and readability');
      recommendations.push('Add more specific examples');
    } else if (score < 7) {
      recommendations.push('Enhance content flow and transitions');
      recommendations.push('Add more engaging elements');
    } else if (score < 9) {
      recommendations.push('Fine-tune for better engagement');
      recommendations.push('Consider adding visual elements');
    } else {
      recommendations.push('Content is high quality - maintain current standards');
    }
    
    return recommendations;
  }
}
