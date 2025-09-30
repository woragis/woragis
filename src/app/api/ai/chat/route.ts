import { NextRequest, NextResponse } from 'next/server';
import { chatAgent } from '@/lib/ai/agents/chat-agent';
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
    const { message, context, visitorType } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Process chat message
    const result = await chatAgent.chat({
      message,
      context: context || 'General inquiry',
      visitorType: visitorType || 'general'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: (result as any).response,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
