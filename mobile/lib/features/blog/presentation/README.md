# Blog Domain - Presentation Layer

This directory contains the presentation layer for the blog domain, providing comprehensive blog post management, content creation, and tag organization functionality.

## Structure

```
presentation/
├── bloc/
│   ├── blog_bloc.dart                    # Main blog domain BLoC with events and states
│   ├── blog_filter/
│   │   └── blog_filter_bloc.dart         # Blog filtering functionality
│   └── create_blog_post/
│       └── create_blog_post_bloc.dart    # Blog post creation functionality
├── pages/
│   ├── blog_posts_list_page.dart         # Blog posts listing with search and filters
│   ├── blog_post_detail_page.dart        # Individual blog post view and edit
│   ├── create_blog_post_page.dart        # Create/edit blog post form
│   ├── blog_tags_page.dart               # Blog tags management
│   └── pages.dart                        # Export file for all pages
├── queries/
│   └── blog_queries.dart                 # Utility functions for direct use case calls
└── README.md                             # This file
```

## Features

### 📝 **Blog Management**

1. **Blog Posts List Page** (`blog_posts_list_page.dart`)
   - Grid and list view toggle for different display preferences
   - Search functionality with real-time filtering
   - Filter by published, featured, visible, public status
   - Tag-based filtering (placeholder for future implementation)
   - Pull-to-refresh support
   - Empty state with call-to-action
   - Draft and featured post indicators
   - Reading time display
   - Floating action button for creating new posts

2. **Blog Post Detail Page** (`blog_post_detail_page.dart`)
   - Full blog post content display
   - Featured image with overlay indicators
   - Edit mode with comprehensive form
   - Tag display with color coding
   - Post metadata (slug, order, timestamps, view/like counts)
   - Visibility and privacy indicators
   - Draft/featured status badges
   - Delete confirmation dialog
   - Automatic view count increment

3. **Create/Edit Blog Post Page** (`create_blog_post_page.dart`)
   - Comprehensive form with validation
   - Auto-generation of slug from title
   - Featured image URL input with preview
   - Rich content editor (placeholder for future implementation)
   - Reading time auto-calculation
   - Tag selection (placeholder for future implementation)
   - Settings for visibility, privacy, and ordering
   - Featured and published toggles
   - Live preview of post content

4. **Blog Tags Management Page** (`blog_tags_page.dart`)
   - Tag listing with search functionality
   - Create new tags with color coding
   - Edit existing tags
   - Delete tags with confirmation
   - Tag statistics (post count)
   - Color picker for tag customization
   - Auto-slug generation from tag names

### 🎯 **BLoC Integration**

The blog BLoC (`blog_bloc.dart`) handles all blog states:

**Blog Posts Events:**
- `GetBlogPostsRequested` - Load blog posts with filters
- `GetBlogPostByIdRequested` - Load specific blog post
- `CreateBlogPostRequested` - Create new blog post
- `UpdateBlogPostRequested` - Update existing blog post
- `DeleteBlogPostRequested` - Delete blog post
- `IncrementViewCountRequested` - Track post views
- `IncrementLikeCountRequested` - Track post likes

**Blog Tags Events:**
- `GetBlogTagsRequested` - Load blog tags
- `CreateBlogTagRequested` - Create new tag
- `UpdateBlogTagRequested` - Update existing tag
- `DeleteBlogTagRequested` - Delete tag

**States:**
- `BlogInitial` - Initial state
- `BlogLoading` - Loading state for async operations
- `BlogError` - Error state with error message
- `BlogPostsLoaded` - Blog posts list loaded
- `BlogPostLoaded` - Single blog post loaded
- `BlogPostCreated` - Blog post created successfully
- `BlogPostUpdated` - Blog post updated successfully
- `BlogPostDeleted` - Blog post deleted successfully
- `ViewCountIncremented` - View count incremented
- `LikeCountIncremented` - Like count incremented
- `BlogTagsLoaded` - Blog tags list loaded
- `BlogTagCreated` - Blog tag created successfully
- `BlogTagUpdated` - Blog tag updated successfully
- `BlogTagDeleted` - Blog tag deleted successfully

## UI/UX Features

### 🎨 **Design System**
- **Color Coding**: Green theme for blog domain (`Colors.green.shade600`)
- **Grid/List Toggle**: Flexible viewing options for blog posts
- **Material Design 3**: Modern, consistent UI components
- **Responsive Layout**: Works on different screen sizes
- **Loading States**: Skeleton screens and progress indicators

### 🔍 **Search & Filtering**
- **Real-time Search**: Instant filtering as user types
- **Advanced Filters**: Multiple filter options with chips
- **View Toggle**: Switch between grid and list views
- **Filter Persistence**: Maintains filters during navigation
- **Clear Filters**: Easy reset of all applied filters

### 📱 **Navigation & UX**
- **Floating Action Buttons**: Quick access to create actions
- **Pull-to-Refresh**: Refresh data with intuitive gesture
- **Empty States**: Helpful messages when no data exists
- **Error Handling**: User-friendly error messages with retry options
- **Confirmation Dialogs**: Safety prompts for destructive actions

## Blog Features

### 🖼️ **Image Management**
- **Featured Images**: Support for blog post featured images
- **Image URLs**: External image hosting support
- **Image Preview**: Real-time preview of featured images
- **Image Validation**: URL validation for proper image display
- **Placeholder Support**: Fallback for invalid or missing images

### 🏷️ **Tag System**
- **Tag Creation**: Create custom tags with colors and descriptions
- **Tag Management**: Edit and delete existing tags
- **Color Coding**: Visual tag identification with custom colors
- **Tag Statistics**: Display post count per tag
- **Tag Filtering**: Filter posts by tags (placeholder for future)

### 📊 **Content Features**
- **Rich Content**: Support for detailed blog post content
- **Excerpts**: Brief descriptions for post previews
- **Reading Time**: Auto-calculation of estimated reading time
- **Slug Generation**: SEO-friendly URLs from titles
- **Metadata**: Comprehensive post information tracking

## Form Validation

All forms include comprehensive validation:

### 📝 **Blog Post Forms**
- **Title**: Required, minimum 3 characters
- **Slug**: Required, lowercase letters/numbers/hyphens only
- **Excerpt**: Required, minimum 10 characters
- **Content**: Required, minimum 50 characters
- **Featured Image**: Optional, valid URL format when provided
- **Reading Time**: Optional, numeric value

### 🏷️ **Tag Forms**
- **Name**: Required, unique tag names
- **Slug**: Auto-generated from name
- **Description**: Optional detailed description
- **Color**: Optional hex color code validation

## Usage Examples

### 1. **Create a New Blog Post**

```dart
// Navigate to create blog post page
context.go('/blog/create');

// The form includes:
// - Title (auto-generates slug)
// - Excerpt and content
// - Featured image URL with preview
// - Reading time calculation
// - Tag selection
// - Settings (featured, published, visible, public, order)
```

### 2. **Manage Blog Tags**

```dart
// Navigate to blog tags page
context.go('/blog/tags');

// Features:
// - Create new tags with colors
// - Edit existing tags
// - Delete tags with confirmation
// - Search and filter tags
// - View tag statistics
```

### 3. **Search and Filter Posts**

```dart
// Blog posts list page supports:
// - Text search across title and content
// - Published only filter
// - Featured only filter
// - Public only filter
// - Tag-based filtering
// - Grid/list view toggle
```

### 4. **View Blog Post Details**

```dart
// Blog post detail page provides:
// - Full post content with formatting
// - Featured image display
// - Tag chips with colors
// - Post metadata and statistics
// - Edit capabilities
// - Delete functionality
```

## Error Handling

- **Network Errors**: User-friendly messages with retry options
- **Validation Errors**: Inline form validation with specific messages
- **Loading States**: Prevents multiple submissions
- **Empty States**: Helpful guidance when no data exists
- **Image Errors**: Fallback display for invalid image URLs

## Content Management

### 📝 **Blog Post Features**
- **Draft System**: Save posts as drafts before publishing
- **Featured Posts**: Mark important posts as featured
- **Visibility Controls**: Show/hide posts from public view
- **Privacy Settings**: Control public/private access
- **Order Management**: Custom ordering for post display
- **View Tracking**: Automatic view count increment
- **Like System**: Support for post likes (placeholder)

### 🏷️ **Tag Management**
- **Color Customization**: Custom colors for visual organization
- **Slug Generation**: SEO-friendly tag URLs
- **Post Association**: Link tags to blog posts
- **Statistics Tracking**: Count posts per tag
- **Search Functionality**: Find tags quickly

## Future Enhancements

- [ ] Rich text editor for blog post content
- [ ] Image upload functionality for featured images
- [ ] Tag selection interface for blog posts
- [ ] Blog post ordering with drag-and-drop
- [ ] Advanced content formatting (markdown, HTML)
- [ ] Comment system integration
- [ ] Social sharing functionality
- [ ] SEO optimization tools
- [ ] Content scheduling and publishing
- [ ] Blog post templates
- [ ] Analytics and engagement metrics
- [ ] Multi-author support
- [ ] Content versioning and history
- [ ] Bulk operations for posts and tags

## Integration Points

The blog domain integrates with:

1. **Auth Domain**: User authentication and permissions
2. **Core Layer**: Dependency injection and error handling
3. **Data Layer**: Repository pattern for data access
4. **Domain Layer**: Use cases and entities
5. **Settings Domain**: Blog configuration and preferences

This creates a comprehensive blog management system that allows users to create, organize, and publish content with modern UI/UX and robust functionality.
