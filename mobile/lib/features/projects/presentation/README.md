# Projects Domain - Presentation Layer

This directory contains the presentation layer for the projects domain, including pages, BLoC, and query utilities for managing portfolio projects and showcasing work.

## Structure

```
presentation/
├── bloc/
│   └── projects_bloc.dart           # Projects domain BLoC with events and states
├── pages/
│   ├── projects_list_page.dart      # Projects listing with search and filters
│   ├── project_detail_page.dart     # Individual project view and edit
│   ├── create_project_page.dart     # Create/edit project form
│   ├── project_ordering_page.dart   # Drag-and-drop project reordering
│   └── pages.dart                   # Export file for all pages
├── queries/
│   └── projects_queries.dart        # Utility functions for direct use case calls
└── README.md                        # This file
```

## Features

### 🚀 **Projects Management**

1. **Projects List Page** (`projects_list_page.dart`)
   - Grid and list view toggle for different display preferences
   - Search functionality with real-time filtering
   - Filter by featured, public, visible status
   - Technology-based filtering (placeholder for future implementation)
   - Pull-to-refresh support
   - Empty state with call-to-action
   - Floating action button for creating new projects

2. **Project Detail Page** (`project_detail_page.dart`)
   - Full-screen project image display
   - Complete project information view
   - Edit mode with comprehensive form
   - Framework/technology tags display
   - External links (GitHub, Live Demo, Video)
   - Project metadata (slug, order, timestamps)
   - Visibility and privacy indicators
   - Delete confirmation dialog

3. **Create/Edit Project Page** (`create_project_page.dart`)
   - Comprehensive form with validation
   - Auto-generation of slug from title
   - Image URL input with preview
   - Multiple content sections (description, long description, content)
   - External links management
   - Settings for visibility, privacy, and ordering
   - Featured project toggle
   - Framework selection (placeholder for future implementation)

4. **Project Ordering Page** (`project_ordering_page.dart`)
   - Drag-and-drop reordering interface
   - Visual order indicators
   - Real-time order updates
   - Save changes functionality
   - Instructions and guidance for users

### 🎯 **BLoC Integration**

The projects BLoC (`projects_bloc.dart`) handles all project states:

**Events:**
- `GetProjectsRequested` - Load projects with filters
- `GetProjectByIdRequested` - Load specific project
- `CreateProjectRequested` - Create new project
- `UpdateProjectRequested` - Update existing project
- `DeleteProjectRequested` - Delete project
- `UpdateProjectOrderRequested` - Update project ordering
- `IncrementViewCountRequested` - Track project views
- `IncrementLikeCountRequested` - Track project likes

**States:**
- `ProjectsInitial` - Initial state
- `ProjectsLoading` - Loading state for async operations
- `ProjectsError` - Error state with error message
- `ProjectsLoaded` - Projects list loaded
- `ProjectLoaded` - Single project loaded
- `ProjectCreated` - Project created successfully
- `ProjectUpdated` - Project updated successfully
- `ProjectDeleted` - Project deleted successfully
- `ProjectOrderUpdated` - Project order updated successfully
- `ViewCountIncremented` - View count incremented
- `LikeCountIncremented` - Like count incremented

## UI/UX Features

### 🎨 **Design System**
- **Color Coding**: Blue theme for projects domain
- **Grid/List Toggle**: Flexible viewing options
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
- **Drag-and-Drop**: Intuitive project reordering

## Project Features

### 🖼️ **Image Management**
- **Image URLs**: Support for external image hosting
- **Image Preview**: Real-time preview of project images
- **Image Validation**: URL validation for proper image display
- **Placeholder Support**: Fallback for invalid or missing images

### 🔗 **External Links**
- **GitHub Integration**: Link to source code repositories
- **Live Demo Links**: Direct access to deployed projects
- **Video Links**: Support for project demonstration videos
- **URL Validation**: Proper URL format validation
- **Link Icons**: Visual indicators for different link types

### 🏷️ **Framework Integration**
- **Technology Tags**: Display frameworks and technologies used
- **Framework Selection**: Multi-select framework assignment
- **Visual Indicators**: Color-coded technology chips
- **Technology Filtering**: Filter projects by technology stack

## Usage Examples

### 1. **Create a New Project**

```dart
// Navigate to create project page
context.go('/projects/create');

// The form includes:
// - Title (auto-generates slug)
// - Description and long description
// - Image URL with preview
// - External links (GitHub, Live Demo, Video)
// - Settings (featured, visible, public, order)
// - Framework selection
```

### 2. **Reorder Projects**

```dart
// Navigate to project ordering page
context.go('/projects/order');

// Features:
// - Drag and drop interface
// - Visual order indicators
// - Real-time updates
// - Save changes functionality
```

### 3. **Search and Filter Projects**

```dart
// Projects list page supports:
// - Text search across title and description
// - Featured only filter
// - Public only filter
// - Technology-based filtering
// - Grid/list view toggle
```

### 4. **View Project Details**

```dart
// Project detail page provides:
// - Full project information
// - Image gallery
// - Framework tags
// - External links
// - Edit capabilities
// - Delete functionality
```

## Form Validation

All forms include comprehensive validation:

### 🚀 **Project Forms**
- **Title**: Required, minimum 3 characters
- **Slug**: Required, lowercase letters/numbers/hyphens only
- **Description**: Required, minimum 10 characters
- **Image URL**: Required, valid URL format
- **External URLs**: Optional, valid URL format when provided

### 📝 **Content Fields**
- **Long Description**: Optional detailed description
- **Content**: Optional additional content/features
- **Order**: Numeric value for display ordering

## Error Handling

- **Network Errors**: User-friendly messages with retry options
- **Validation Errors**: Inline form validation with specific messages
- **Loading States**: Prevents multiple submissions
- **Empty States**: Helpful guidance when no data exists
- **Image Errors**: Fallback display for invalid image URLs

## Future Enhancements

- [ ] Image upload functionality
- [ ] Rich text editor for project content
- [ ] Framework selection with autocomplete
- [ ] Project templates and categories
- [ ] Analytics and view tracking
- [ ] Project sharing functionality
- [ ] Bulk operations (delete, reorder, etc.)
- [ ] Project import/export
- [ ] Offline mode support
- [ ] Push notifications for project updates

## Integration Points

The projects domain integrates with:

1. **Auth Domain**: User authentication and permissions
2. **Frameworks Domain**: Technology and framework management
3. **Core Layer**: Dependency injection and error handling
4. **Data Layer**: Repository pattern for data access
5. **Domain Layer**: Use cases and entities

This creates a comprehensive project portfolio management system that allows users to showcase their work effectively with modern UI/UX and robust functionality.
