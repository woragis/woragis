import OpenAI from 'openai';
import { imageConfig, validateOpenAIConfig } from '../config/openai-config';
// Remove env import as it's not needed

// Image Generation Agent
export class ImageAgent {
  private openai: OpenAI;

  constructor() {
    if (!validateOpenAIConfig()) {
      throw new Error('OpenAI configuration is invalid');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Generate image for instruments
  async generateInstrumentImage(params: {
    instrument: string;
    style?: string;
    context?: string;
  }) {
    try {
      const prompt = `Professional photography of a ${params.instrument} ${params.context ? `in ${params.context}` : ''}. 
      ${params.style ? `Style: ${params.style}.` : 'Clean, modern, professional style.'} 
      High quality, well-lit, suitable for a portfolio website. 
      Focus on the instrument details and craftsmanship.`;

      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt,
        size: imageConfig.size,
        quality: imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'instrument_image',
          generatedAt: new Date().toISOString(),
          params,
          prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Instrument image generation failed',
        metadata: {
          type: 'instrument_image',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate image for martial arts
  async generateMartialArtsImage(params: {
    martialArt: string;
    style?: string;
    context?: string;
  }) {
    try {
      const prompt = `Professional photography of ${params.martialArt} martial arts ${params.context ? `in ${params.context}` : 'training'}. 
      ${params.style ? `Style: ${params.style}.` : 'Dynamic, action-oriented, professional style.'} 
      High quality, well-lit, suitable for a portfolio website. 
      Show the discipline, focus, and technique of the martial art.`;

      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt,
        size: imageConfig.size,
        quality: imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'martial_arts_image',
          generatedAt: new Date().toISOString(),
          params,
          prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Martial arts image generation failed',
        metadata: {
          type: 'martial_arts_image',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate project thumbnail
  async generateProjectThumbnail(params: {
    projectName: string;
    technologies: string[];
    projectType: string;
    style?: string;
  }) {
    try {
      const prompt = `Modern, professional project thumbnail for "${params.projectName}" - a ${params.projectType} project. 
      Technologies: ${params.technologies.join(', ')}. 
      ${params.style ? `Style: ${params.style}.` : 'Clean, modern, tech-focused design.'} 
      Suitable for a developer portfolio. 
      Include subtle tech elements and modern design aesthetics.`;

      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt,
        size: imageConfig.size,
        quality: imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'project_thumbnail',
          generatedAt: new Date().toISOString(),
          params,
          prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Project thumbnail generation failed',
        metadata: {
          type: 'project_thumbnail',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate blog post featured image
  async generateBlogFeaturedImage(params: {
    blogTitle: string;
    topic: string;
    style?: string;
    mood?: string;
  }) {
    try {
      const prompt = `Professional blog post featured image for "${params.blogTitle}" about ${params.topic}. 
      ${params.style ? `Style: ${params.style}.` : 'Modern, clean, professional design.'} 
      ${params.mood ? `Mood: ${params.mood}.` : 'Engaging and informative.'} 
      Suitable for a tech blog. 
      Include relevant visual elements that represent the topic.`;

      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt,
        size: imageConfig.size,
        quality: imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'blog_featured_image',
          generatedAt: new Date().toISOString(),
          params,
          prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Blog featured image generation failed',
        metadata: {
          type: 'blog_featured_image',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate hobby-related image
  async generateHobbyImage(params: {
    hobby: string;
    context?: string;
    style?: string;
  }) {
    try {
      const prompt = `Professional photography of ${params.hobby} ${params.context ? `in ${params.context}` : 'activity'}. 
      ${params.style ? `Style: ${params.style}.` : 'Engaging, personal, professional style.'} 
      High quality, well-lit, suitable for a personal portfolio website. 
      Show the passion and skill involved in this hobby.`;

      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt,
        size: imageConfig.size,
        quality: imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'hobby_image',
          generatedAt: new Date().toISOString(),
          params,
          prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Hobby image generation failed',
        metadata: {
          type: 'hobby_image',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Generate social media asset
  async generateSocialMediaAsset(params: {
    purpose: string;
    content: string;
    platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
    style?: string;
  }) {
    try {
      const dimensions = {
        twitter: '1200x675',
        linkedin: '1200x627',
        instagram: '1080x1080',
        facebook: '1200x630'
      };

      const prompt = `Professional social media asset for ${params.platform} about "${params.purpose}". 
      Content: ${params.content}. 
      ${params.style ? `Style: ${params.style}.` : 'Modern, engaging, professional design.'} 
      Optimized for ${params.platform} platform. 
      Include relevant visual elements and maintain brand consistency.`;

      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt,
        size: dimensions[params.platform] as any,
        quality: imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'social_media_asset',
          generatedAt: new Date().toISOString(),
          params,
          prompt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Social media asset generation failed',
        metadata: {
          type: 'social_media_asset',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Batch image generation
  async generateBatchImages(requests: Array<{
    type: 'instrument' | 'martial_arts' | 'project' | 'blog' | 'hobby' | 'social';
    params: any;
  }>) {
    const results = [];
    
    for (const request of requests) {
      let result;
      
      switch (request.type) {
        case 'instrument':
          result = await this.generateInstrumentImage(request.params);
          break;
        case 'martial_arts':
          result = await this.generateMartialArtsImage(request.params);
          break;
        case 'project':
          result = await this.generateProjectThumbnail(request.params);
          break;
        case 'blog':
          result = await this.generateBlogFeaturedImage(request.params);
          break;
        case 'hobby':
          result = await this.generateHobbyImage(request.params);
          break;
        case 'social':
          result = await this.generateSocialMediaAsset(request.params);
          break;
        default:
          result = {
            success: false,
            error: `Unknown image type: ${request.type}`
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

  // Generate custom image with detailed prompt
  async generateCustomImage(params: {
    prompt: string;
    style?: string;
    size?: string;
    quality?: 'standard' | 'hd';
  }) {
    try {
      const response = await this.openai.images.generate({
        model: imageConfig.model,
        prompt: params.prompt,
        size: (params.size as any) || imageConfig.size,
        quality: params.quality || imageConfig.quality,
        style: imageConfig.style,
        n: imageConfig.n,
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('No image data received from OpenAI');
      }

      return {
        success: true,
        imageUrl: response.data[0].url,
        metadata: {
          type: 'custom_image',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Custom image generation failed',
        metadata: {
          type: 'custom_image',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }
}

// Export singleton instance with lazy initialization
let _imageAgent: ImageAgent | null = null;

export const getImageAgent = (): ImageAgent => {
  if (!_imageAgent) {
    _imageAgent = new ImageAgent();
  }
  return _imageAgent;
};

// For backward compatibility, export a getter
export const imageAgent = {
  generateInstrumentImage: (params: any) => getImageAgent().generateInstrumentImage(params),
  generateMartialArtsImage: (params: any) => getImageAgent().generateMartialArtsImage(params),
  generateProjectThumbnail: (params: any) => getImageAgent().generateProjectThumbnail(params),
  generateBlogFeaturedImage: (params: any) => getImageAgent().generateBlogFeaturedImage(params),
  generateHobbyImage: (params: any) => getImageAgent().generateHobbyImage(params),
  generateSocialMediaAsset: (params: any) => getImageAgent().generateSocialMediaAsset(params),
  generateBatchImages: (requests: any) => getImageAgent().generateBatchImages(requests),
  generateCustomImage: (params: any) => getImageAgent().generateCustomImage(params),
};
