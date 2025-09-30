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
    const { content, contentType, goals, audience } = body;

    // Validate required fields
    if (!content || !contentType) {
      return NextResponse.json(
        { error: 'Content and content type are required' },
        { status: 400 }
      );
    }

    // Enhance content
    const result = await contentAgent.enhanceContent({
      content,
      contentType,
      goals: goals || 'Improve readability and engagement',
      audience: audience || 'web developers'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enhancedContent: (result as any).enhancedContent || (result as any).content || (result as any).data,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Content enhancement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}