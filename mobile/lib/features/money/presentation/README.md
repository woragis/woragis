# Money Domain - Presentation Layer

This directory contains the presentation layer for the money domain, including pages, BLoC, and query utilities for managing business ideas and AI chat conversations.

## Structure

```
presentation/
├── bloc/
│   └── money_bloc.dart              # Money domain BLoC with events and states
├── pages/
│   ├── ideas_list_page.dart         # Ideas listing with search and filters
│   ├── idea_detail_page.dart        # Individual idea view and edit
│   ├── create_idea_page.dart        # Create/edit idea form
│   ├── ai_chats_list_page.dart      # AI chats listing
│   ├── ai_chat_page.dart            # AI chat conversation interface
│   ├── create_ai_chat_page.dart     # Create AI chat form
│   └── pages.dart                   # Export file for all pages
├── queries/
│   └── money_queries.dart           # Utility functions for direct use case calls
└── README.md                        # This file
```

## Features

### 💡 **Ideas Management**

1. **Ideas List Page** (`ideas_list_page.dart`)
   - Grid/list view of all business ideas
   - Search functionality with real-time filtering
   - Filter by featured, public, visible status
   - Pull-to-refresh support
   - Empty state with call-to-action
   - Floating action button for creating new ideas

2. **Idea Detail Page** (`idea_detail_page.dart`)
   - View complete idea information
   - Edit mode with form validation
   - Idea metadata display (slug, order, timestamps)
   - Visibility and privacy indicators
   - Delete confirmation dialog
   - Link to create AI chat from idea

3. **Create/Edit Idea Page** (`create_idea_page.dart`)
   - Comprehensive form with validation
   - Auto-generation of slug from title
   - Rich text document editor
   - Settings for visibility, privacy, and ordering
   - Featured idea toggle
   - Form validation with error messages

### 🤖 **AI Chat Management**

4. **AI Chats List Page** (`ai_chats_list_page.dart`)
   - List of all AI conversations
   - Filter by AI agent (GPT-4, Claude, Gemini, etc.)
   - Search chat titles and content
   - Archive/unarchive functionality
   - Agent-specific icons and colors
   - Message count and last activity display

5. **AI Chat Page** (`ai_chat_page.dart`)
   - Real-time chat interface
   - Message bubbles with timestamps
   - Typing indicators
   - Agent-specific styling
   - Auto-scroll to latest messages
   - Archive/active status display
   - Chat settings access

6. **Create AI Chat Page** (`create_ai_chat_page.dart`)
   - AI agent selection with visual indicators
   - Custom system prompt configuration
   - Advanced settings (temperature, max tokens)
   - Model selection based on agent
   - Visibility and archive settings
   - Form validation and error handling

### 🎯 **BLoC Integration**

The money BLoC (`money_bloc.dart`) handles all money domain states:

**Events:**
- `GetIdeasRequested` - Load ideas with filters
- `GetIdeaByIdRequested` - Load specific idea
- `CreateIdeaRequested` - Create new idea
- `UpdateIdeaRequested` - Update existing idea
- `DeleteIdeaRequested` - Delete idea
- `GetAiChatsRequested` - Load AI chats with filters
- `GetAiChatByIdRequested` - Load specific chat
- `CreateAiChatRequested` - Create new AI chat
- `SendMessageRequested` - Send message in chat

**States:**
- `MoneyInitial` - Initial state
- `MoneyLoading` - Loading state for async operations
- `MoneyError` - Error state with error message
- `IdeasLoaded` - Ideas list loaded
- `IdeaLoaded` - Single idea loaded
- `IdeaCreated` - Idea created successfully
- `IdeaUpdated` - Idea updated successfully
- `IdeaDeleted` - Idea deleted successfully
- `AiChatsLoaded` - AI chats list loaded
- `AiChatLoaded` - Single AI chat loaded
- `AiChatCreated` - AI chat created successfully
- `MessageSent` - Message sent successfully

## UI/UX Features

### 🎨 **Design System**
- **Color Coding**: Green for ideas, Purple for AI chats
- **Agent Branding**: Each AI agent has unique colors and icons
- **Material Design 3**: Modern, consistent UI components
- **Responsive Layout**: Works on different screen sizes
- **Loading States**: Skeleton screens and progress indicators

### 🔍 **Search & Filtering**
- **Real-time Search**: Instant filtering as user types
- **Advanced Filters**: Multiple filter options with chips
- **Filter Persistence**: Maintains filters during navigation
- **Clear Filters**: Easy reset of all applied filters

### 📱 **Navigation & UX**
- **Floating Action Buttons**: Quick access to create actions
- **Pull-to-Refresh**: Refresh data with intuitive gesture
- **Empty States**: Helpful messages when no data exists
- **Error Handling**: User-friendly error messages with retry options

## AI Agent Support

The app supports multiple AI agents with distinct branding:

### 🤖 **Supported Agents**
- **GPT-4** - Green color, robot icon
- **GPT-4 Turbo** - Green color, robot icon  
- **GPT-3.5 Turbo** - Blue color, robot icon
- **Claude 3 Opus** - Orange color, psychology icon
- **Claude 3 Sonnet** - Orange color, psychology icon
- **Claude 3 Haiku** - Orange color, psychology icon
- **Gemini Pro** - Purple color, auto-awesome icon
- **Custom Model** - Grey color, settings icon

### ⚙️ **Agent Configuration**
- **Temperature Control**: Slider for creativity level (0.0-2.0)
- **Max Tokens**: Optional token limit setting
- **System Prompts**: Customizable AI behavior
- **Model Selection**: Automatic model mapping per agent

## Usage Examples

### 1. **Create a New Idea**

```dart
// Navigate to create idea page
context.go('/money/ideas/create');

// The form includes:
// - Title (auto-generates slug)
// - Description (optional)
// - Document (detailed content)
// - Settings (featured, visible, public, order)
```

### 2. **Start an AI Chat**

```dart
// Navigate to create AI chat page
context.go('/money/ai-chats/create');

// Or create from an existing idea
context.go('/money/ai-chats/create?ideaId=123');
```

### 3. **Search and Filter Ideas**

```dart
// Ideas list page supports:
// - Text search across title and description
// - Featured only filter
// - Public only filter
// - Sort by date, title, order
```

### 4. **Chat with AI**

```dart
// AI chat page provides:
// - Real-time messaging interface
// - Message history
// - Typing indicators
// - Auto-scroll to latest messages
```

## Form Validation

All forms include comprehensive validation:

### 💡 **Idea Forms**
- **Title**: Required, minimum 3 characters
- **Slug**: Required, lowercase letters/numbers/hyphens only
- **Document**: Required, minimum 10 characters
- **Description**: Optional

### 🤖 **AI Chat Forms**
- **Title**: Required, minimum 3 characters
- **Agent**: Required selection
- **Temperature**: 0.0-2.0 range
- **Max Tokens**: Optional positive integer
- **System Prompt**: Optional

## Error Handling

- **Network Errors**: User-friendly messages with retry options
- **Validation Errors**: Inline form validation with specific messages
- **Loading States**: Prevents multiple submissions
- **Empty States**: Helpful guidance when no data exists

## Future Enhancements

- [ ] Rich text editor for idea documents
- [ ] Image attachments for ideas
- [ ] Idea templates and categories
- [ ] AI chat export functionality
- [ ] Voice message support in AI chats
- [ ] Real-time collaboration on ideas
- [ ] AI-powered idea suggestions
- [ ] Analytics and insights dashboard
- [ ] Offline mode support
- [ ] Push notifications for AI responses

## Integration Points

The money domain integrates with:

1. **Auth Domain**: User authentication and permissions
2. **Core Layer**: Dependency injection and error handling
3. **Data Layer**: Repository pattern for data access
4. **Domain Layer**: Use cases and entities

This creates a comprehensive money-making ideas management system with AI assistance capabilities.
