import { NextRequest, NextResponse } from 'next/server';
import { imageAgent } from '@/lib/ai/agents/image-agent';
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
    const { type, params } = body;

    // Validate required fields
    if (!type || !params) {
      return NextResponse.json(
        { error: 'Type and parameters are required' },
        { status: 400 }
      );
    }

    let result;

    // Generate image based on type
    switch (type) {
      case 'instrument':
        result = await imageAgent.generateInstrumentImage(params);
        break;
      case 'martial_arts':
        result = await imageAgent.generateMartialArtsImage(params);
        break;
      case 'project':
        result = await imageAgent.generateProjectThumbnail(params);
        break;
      case 'blog':
        result = await imageAgent.generateBlogFeaturedImage(params);
        break;
      case 'hobby':
        result = await imageAgent.generateHobbyImage(params);
        break;
      case 'social':
        result = await imageAgent.generateSocialMediaAsset(params);
        break;
      case 'custom':
        result = await imageAgent.generateCustomImage(params);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid image type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: (result as any).imageUrl,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
