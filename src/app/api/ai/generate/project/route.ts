import { NextRequest, NextResponse } from 'next/server';
import { contentAgent } from '@/lib/ai/agents/content-agent';
import { validateOpenAIConfig } from '@/lib/ai/config/openai-config';
import { projectService } from '@/server/services';

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
    const { 
      projectName, 
      technologies, 
      description, 
      features, 
      goals,
      userId, 
      autoSave = false,
      projectId 
    } = body;

    // Validate required fields
    if (!projectName) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Generate project description
    const result = await contentAgent.generateProjectDescription({
      projectName,
      technologies: technologies || [],
      projectType: description || 'web application',
      features: features || [],
      challenges: [goals || 'Create a useful application']
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

    // If autoSave is enabled and userId is provided, create or update project
    if (autoSave && userId && (result as any).content) {
      try {
        const projectData = {
          title: projectName,
          slug: projectName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
          description: (result as any).content,
          image: '/images/default-project.png', // Default image
          technologies: technologies || [],
          features: features || [],
          goals: goals || 'Create a useful application',
          userId,
          visible: true,
          featured: false,
          order: 0
        };

        const projectResult = projectId 
          ? await projectService.updateProject(projectId, projectData)
          : await projectService.createProject(projectData, userId);

        if (projectResult.success) {
          response.project = projectResult.data;
          response.autoSaved = true;
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        // Don't fail the request if auto-save fails
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Project generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}