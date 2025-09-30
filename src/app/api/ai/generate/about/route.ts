import { NextRequest, NextResponse } from 'next/server';
import { contentAgent } from '@/lib/ai/agents/content-agent';
import { validateOpenAIConfig } from '@/lib/ai/config/openai-config';
import { 
  instrumentsService, 
  martialArtsService, 
  languagesService, 
  hobbiesService,
  musicGenreService,
  animeService,
  bookService,
  gameService,
  politicalViewService,
  youtuberService
} from '@/server/services';

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
      category, 
      currentInfo, 
      goals, 
      experienceLevel, 
      userId, 
      autoSave = false,
      itemId 
    } = body;

    // Validate required fields
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Generate about content based on category
    let result;
    switch (category) {
      case 'instruments':
        result = await contentAgent.generateAboutContent({
          category: 'instruments',
          currentInfo: currentInfo || 'Learning various musical instruments',
          goals: goals || 'Master multiple instruments and create music',
          experienceLevel: experienceLevel || 'intermediate'
        });
        break;
      case 'martial-arts':
        result = await contentAgent.generateAboutContent({
          category: 'martial arts',
          currentInfo: currentInfo || 'Training in martial arts',
          goals: goals || 'Improve technique and discipline',
          experienceLevel: experienceLevel || 'intermediate'
        });
        break;
      case 'languages':
        result = await contentAgent.generateAboutContent({
          category: 'languages',
          currentInfo: currentInfo || 'Learning multiple languages',
          goals: goals || 'Achieve fluency in target languages',
          experienceLevel: experienceLevel || 'intermediate'
        });
        break;
      case 'hobbies':
        result = await contentAgent.generateAboutContent({
          category: 'hobbies',
          currentInfo: currentInfo || 'Various personal interests',
          goals: goals || 'Explore new hobbies and interests',
          experienceLevel: experienceLevel || 'beginner'
        });
        break;
      default:
        result = await contentAgent.generateAboutContent({
          category,
          currentInfo: currentInfo || 'Personal information',
          goals: goals || 'Continue learning and growing',
          experienceLevel: experienceLevel || 'intermediate'
        });
    }

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

    // If autoSave is enabled and userId is provided, save to the appropriate service
    if (autoSave && userId && (result as any).content) {
      try {
        const contentData = {
          description: (result as any).content,
          ...(itemId && { id: itemId })
        };

        let serviceResult;
        switch (category) {
          case 'instruments':
            serviceResult = itemId 
              ? await instrumentsService.updateInstrument(itemId, contentData)
              : await instrumentsService.createInstrument(contentData, userId);
            break;
          case 'martial-arts':
            serviceResult = itemId 
              ? await martialArtsService.updateMartialArt(itemId, contentData)
              : await martialArtsService.createMartialArt(contentData, userId);
            break;
          case 'languages':
            serviceResult = itemId 
              ? await languagesService.updateLanguage(itemId, contentData)
              : await languagesService.createLanguage(contentData, userId);
            break;
          case 'hobbies':
            serviceResult = itemId 
              ? await hobbiesService.updateHobby(itemId, contentData)
              : await hobbiesService.createHobby(contentData, userId);
            break;
          case 'music':
            serviceResult = itemId 
              ? await musicGenreService.updateGenre(itemId, contentData)
              : await musicGenreService.createGenre(contentData, userId);
            break;
          case 'anime':
            serviceResult = itemId 
              ? await animeService.updateAnime(itemId, contentData)
              : await animeService.createAnime(contentData, userId);
            break;
          case 'books':
            serviceResult = itemId 
              ? await bookService.updateBook(itemId, contentData)
              : await bookService.createBook(contentData, userId);
            break;
          case 'games':
            serviceResult = itemId 
              ? await gameService.updateGame(itemId, contentData)
              : await gameService.createGame(contentData, userId);
            break;
          case 'politics':
            serviceResult = itemId 
              ? await politicalViewService.updatePoliticalView(itemId, contentData)
              : await politicalViewService.createPoliticalView(contentData, userId);
            break;
          case 'youtubers':
            serviceResult = itemId 
              ? await youtuberService.updateYoutuber(itemId, contentData)
              : await youtuberService.createYoutuber(contentData, userId);
            break;
          default:
            serviceResult = { success: false, error: 'Unknown category' };
        }

        if (serviceResult.success) {
          response.item = serviceResult.data;
          response.autoSaved = true;
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        // Don't fail the request if auto-save fails
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('About content generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}