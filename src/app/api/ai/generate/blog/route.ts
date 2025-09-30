import { NextRequest, NextResponse } from 'next/server';
import { contentAgent } from '@/lib/ai/agents/content-agent';
import { validateOpenAIConfig } from '@/lib/ai/config/openai-config';

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
    const { topic, audience, tone, length } = body;

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

    return NextResponse.json({
      success: true,
      content: (result as any).content,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
