import { ChatPromptTemplate } from '@langchain/core/prompts';
import { chatModel } from '../config/openai-config';
import { 
  PORTFOLIO_CHAT_PROMPT,
  PROJECT_RECOMMENDATION_PROMPT,
  SKILL_INQUIRY_PROMPT,
  CONTACT_ASSISTANCE_PROMPT,
  GENERAL_FAQ_PROMPT 
} from '../../prompts/chat-prompts';

// Simplified Chat Agent
export class ChatAgent {

  // General chat interaction
  async chat(params: {
    message: string;
    context?: string;
    visitorType?: 'potential_client' | 'developer' | 'student' | 'general';
  }) {
    try {
      const prompt = ChatPromptTemplate.fromTemplate(PORTFOLIO_CHAT_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        input: `Visitor message: "${params.message}"
        
Context: ${params.context || 'General inquiry'}
Visitor type: ${params.visitorType || 'general'}

Please provide a helpful response that addresses their question or interest.`,
        context: params.context || 'General inquiry'
      });

      return {
        success: true,
        response: result.content as string,
        metadata: {
          type: 'chat_response',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chat response failed',
        metadata: {
          type: 'chat_response',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Project recommendations
  async recommendProjects(params: {
    interests: string[];
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    projectType?: 'web' | 'mobile' | 'backend' | 'fullstack';
  }) {
    try {
      const prompt = ChatPromptTemplate.fromTemplate(PROJECT_RECOMMENDATION_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        interests: params.interests.join(', '),
        question: `Recommend projects for someone interested in: ${params.interests.join(', ')}`
      });

      return {
        success: true,
        recommendations: result.content as string,
        metadata: {
          type: 'project_recommendations',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Project recommendation failed',
        metadata: {
          type: 'project_recommendations',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Skill inquiries
  async answerSkillInquiry(params: {
    skill: string;
    context?: string;
    detailLevel?: 'basic' | 'detailed' | 'technical';
  }) {
    try {
      const prompt = ChatPromptTemplate.fromTemplate(SKILL_INQUIRY_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        skill: params.skill,
        context: params.context || 'General question',
        inquiry: `Tell me about Jezreel's experience with ${params.skill}`
      });

      return {
        success: true,
        answer: result.content as string,
        metadata: {
          type: 'skill_inquiry',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Skill inquiry failed',
        metadata: {
          type: 'skill_inquiry',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Contact assistance
  async assistWithContact(params: {
    inquiryType: 'collaboration' | 'job_opportunity' | 'project_inquiry' | 'general';
    message?: string;
    urgency?: 'low' | 'medium' | 'high';
  }) {
    try {
      const input = `Contact inquiry type: ${params.inquiryType}
Message: ${params.message || 'No specific message provided'}
Urgency: ${params.urgency || 'medium'}

Please provide guidance on the best way to contact Jezreel for this type of inquiry.`;

      const prompt = ChatPromptTemplate.fromTemplate(PORTFOLIO_CHAT_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        input,
        context: 'General chat'
      });
      return {
        success: true,
        guidance: result.content as string,
        metadata: {
          type: 'contact_assistance',
          generatedAt: new Date().toISOString(),
          params,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Contact assistance failed',
        metadata: {
          type: 'contact_assistance',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // FAQ responses
  async answerFAQ(params: {
    question: string;
    category?: 'general' | 'technical' | 'projects' | 'contact' | 'background';
  }) {
    try {
      const input = `FAQ question: "${params.question}"
Category: ${params.category || 'general'}

Please provide a helpful answer to this frequently asked question.`;

      const prompt = ChatPromptTemplate.fromTemplate(PORTFOLIO_CHAT_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        input,
        context: 'General chat'
      });
      return {
        success: true,
        answer: result.content as string,
        metadata: {
          type: 'faq_response',
          generatedAt: new Date().toISOString(),
          params,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'FAQ response failed',
        metadata: {
          type: 'faq_response',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Portfolio overview
  async providePortfolioOverview(params: {
    focus?: 'projects' | 'skills' | 'experience' | 'all';
    visitorBackground?: string;
  }) {
    try {
      const input = `Provide a portfolio overview focusing on: ${params.focus || 'all'}
Visitor background: ${params.visitorBackground || 'Not specified'}

Please give a comprehensive but concise overview of Jezreel's portfolio.`;

      const prompt = ChatPromptTemplate.fromTemplate(PORTFOLIO_CHAT_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        input,
        context: 'General chat'
      });
      return {
        success: true,
        overview: result.content as string,
        metadata: {
          type: 'portfolio_overview',
          generatedAt: new Date().toISOString(),
          params,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Portfolio overview failed',
        metadata: {
          type: 'portfolio_overview',
          generatedAt: new Date().toISOString(),
          params
        }
      };
    }
  }

  // Conversation flow management
  async manageConversation(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    currentContext?: string;
  }) {
    try {
      const conversationHistory = params.messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const input = `Conversation history:
${conversationHistory}

Current context: ${params.currentContext || 'General conversation'}

Please provide a natural continuation of this conversation.`;

      const prompt = ChatPromptTemplate.fromTemplate(PORTFOLIO_CHAT_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        input,
        context: 'General chat'
      });
      return {
        success: true,
        response: result.content as string,
        metadata: {
          type: 'conversation_continuation',
          generatedAt: new Date().toISOString(),
          messageCount: params.messages.length,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Conversation management failed',
        metadata: {
          type: 'conversation_continuation',
          generatedAt: new Date().toISOString(),
          messageCount: params.messages.length
        }
      };
    }
  }

  // Visitor intent analysis
  async analyzeVisitorIntent(params: {
    message: string;
    previousMessages?: string[];
  }) {
    try {
      const input = `Analyze visitor intent from this message: "${params.message}"
      
Previous messages: ${params.previousMessages?.join(', ') || 'None'}

Please identify the visitor's intent and suggest appropriate responses or actions.`;

      const prompt = ChatPromptTemplate.fromTemplate(PORTFOLIO_CHAT_PROMPT);
      const chain = prompt.pipe(chatModel);
      
      const result = await chain.invoke({
        input,
        context: 'General chat'
      });
      return {
        success: true,
        intent: result.content as string,
        metadata: {
          type: 'intent_analysis',
          generatedAt: new Date().toISOString(),
          messageLength: params.message.length,
          hasHistory: !!params.previousMessages?.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Intent analysis failed',
        metadata: {
          type: 'intent_analysis',
          analyzedAt: new Date().toISOString()
        }
      };
    }
  }
}

// Export singleton instance
export const chatAgent = new ChatAgent();
