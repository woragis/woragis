import { NextRequest, NextResponse } from 'next/server';
import { contentAgent } from '@/lib/ai/agents/content-agent';
import { validateOpenAIConfig } from '@/lib/ai/config/openai-config';
import { blogService } from '@/server/services';

export async function POST(request: NextRequest) {
  try {
    // Validate OpenAI configuration
    if (!validateOpenAIConfig()) {
      return NextResponse.json(
        { error: 'OpenAI configuration is invalid' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, audience, tone, length, userId, autoSave = false } = body;

    // Validate required fields
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate blog post
    const result = await contentAgent.generateBlogPost({
      topic,
      audience: audience || 'web developers',
      tone: tone || 'professional and engaging',
      length: length || '800-1200 words'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    const response: any = {
      success: true,
      content: (result as any).content,
      metadata: result.metadata
    };

    // If autoSave is enabled and userId is provided, create a draft blog post
    if (autoSave && userId && (result as any).content) {
      try {
        const blogData = {
          title: topic,
          slug: topic.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
          excerpt: (result as any).content.substring(0, 200) + '...',
          content: (result as any).content,
          featured: false,
          published: false,
          visible: true,
          public: false,
          userId,
          readingTime: Math.ceil((result as any).content.split(' ').length / 200)
        };

        const blogResult = await blogService.createBlogPost(blogData, userId);
        if (blogResult.success) {
          response.blogPost = blogResult.data;
          response.autoSaved = true;
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        // Don't fail the request if auto-save fails
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
