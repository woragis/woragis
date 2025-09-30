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
    const { category, currentInfo, goals, experienceLevel } = body;

    // Validate required fields
    if (!category || !currentInfo) {
      return NextResponse.json(
        { error: 'Category and current information are required' },
        { status: 400 }
      );
    }

    // Generate about content
    const result = await contentAgent.generateBlogPost({
      topic: `${category} - ${currentInfo}`,
      audience: 'portfolio visitors',
      tone: 'professional and personal',
      length: '500-800 words'
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
    console.error('About content generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
