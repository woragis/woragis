import { NextRequest, NextResponse } from 'next/server';
import { adminAgent } from '@/lib/ai/agents/admin-agent';
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
    const { action, params } = body;

    // Validate required fields
    if (!action || !params) {
      return NextResponse.json(
        { error: 'Action and parameters are required' },
        { status: 400 }
      );
    }

    let result;

    // Process admin assistance based on action
    switch (action) {
      case 'form_assistance':
        result = await adminAgent.assistWithForm(params);
        break;
      case 'content_optimization':
        result = await adminAgent.optimizeContent(params);
        break;
      case 'content_analysis':
        result = await adminAgent.analyzeContentQuality(params);
        break;
      case 'tag_suggestions':
        result = await adminAgent.suggestTagsAndCategories(params);
        break;
      case 'portfolio_insights':
        result = await adminAgent.generatePortfolioInsights(params);
        break;
      case 'content_generation':
        result = await adminAgent.assistContentGeneration(params);
        break;
      case 'workflow_optimization':
        result = await adminAgent.optimizeWorkflow(params);
        break;
      case 'batch_process':
        result = await adminAgent.batchProcess(params);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid admin action' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: (result as any).error || 'An error occurred during processing' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: result,
      metadata: (result as any).metadata
    });

  } catch (error) {
    console.error('Admin assistance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
