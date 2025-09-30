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
    const { projectName, technologies, projectType, features, challenges } = body;

    // Validate required fields
    if (!projectName || !technologies || !projectType) {
      return NextResponse.json(
        { error: 'Project name, technologies, and project type are required' },
        { status: 400 }
      );
    }

    // Generate project description
    const result = await contentAgent.generateProjectDescription({
      projectName,
      technologies: Array.isArray(technologies) ? technologies : [technologies],
      projectType,
      features: Array.isArray(features) ? features : [features || ''],
      challenges: Array.isArray(challenges) ? challenges : [challenges || '']
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
    console.error('Project description generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
