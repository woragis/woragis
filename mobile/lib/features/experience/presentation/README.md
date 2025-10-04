# Experience Domain - Presentation Layer

This directory contains the presentation layer for the experience domain, providing comprehensive work experience management with professional portfolio features.

## Structure

```
presentation/
├── bloc/
│   └── experience_bloc.dart               # Experience domain BLoC with events and states
├── pages/
│   ├── experience_list_page.dart          # Experience list with search, filtering, and views
│   ├── experience_detail_page.dart        # Detailed experience view with actions
│   ├── create_experience_page.dart        # Create/edit experience form
│   ├── experience_ordering_page.dart      # Drag-and-drop experience reordering
│   └── pages.dart                         # Export file for all pages
├── queries/
│   └── experience_queries.dart            # Utility functions for direct use case calls
└── README.md                              # This file
```

## Features

### 💼 **Experience Management**

1. **Experience List Page** (`experience_list_page.dart`)
   - **Search & Filter**: Real-time search and company filtering
   - **View Modes**: Toggle between grid and list view
   - **Visibility Filter**: Show only visible experiences
   - **Company Dropdown**: Filter by specific companies
   - **Responsive Cards**: Professional experience cards with icons
   - **Empty States**: Helpful guidance when no experiences exist
   - **Pull-to-Refresh**: Easy data refresh functionality

2. **Experience Detail Page** (`experience_detail_page.dart`)
   - **Comprehensive Display**: Full experience information with visual hierarchy
   - **Company Icon**: Network image with fallback icon
   - **Achievement Lists**: Bullet-pointed key achievements
   - **Technology Tags**: Visual skill/technology indicators
   - **Visibility Status**: Clear visibility indicator with color coding
   - **Action Menu**: Edit, delete, and visibility toggle options
   - **Confirmation Dialogs**: Safe deletion with confirmation

3. **Create/Edit Experience Page** (`create_experience_page.dart`)
   - **Comprehensive Form**: All experience fields with validation
   - **Dynamic Lists**: Add/remove achievements and technologies
   - **Icon Preview**: Live preview of company icon
   - **Form Validation**: Required fields and URL validation
   - **Visibility Control**: Toggle experience visibility
   - **Auto-save**: Form state preservation during editing
   - **Rich Input**: Multi-line descriptions and structured data

4. **Experience Ordering Page** (`experience_ordering_page.dart`)
   - **Drag & Drop**: Intuitive reordering with ReorderableListView
   - **Visual Feedback**: Clear order indicators and drag handles
   - **Bulk Update**: Efficient order saving for all experiences
   - **Instructions**: User guidance for the reordering process
   - **Order Preservation**: Maintains order across sessions

### 🎯 **BLoC Integration**

The experience BLoC (`experience_bloc.dart`) handles all experience states:

**Events:**
- `GetExperienceListRequested` - Load experiences with filters
- `GetExperienceByIdRequested` - Load specific experience
- `CreateExperienceRequested` - Create new experience
- `UpdateExperienceRequested` - Update existing experience
- `DeleteExperienceRequested` - Delete experience
- `UpdateExperienceOrderRequested` - Reorder experiences

**States:**
- `ExperienceInitial` - Initial state
- `ExperienceLoading` - Loading state for async operations
- `ExperienceError` - Error state with error message
- `ExperienceListLoaded` - Experience list loaded
- `ExperienceLoaded` - Single experience loaded
- `ExperienceCreated` - Experience created successfully
- `ExperienceUpdated` - Experience updated successfully
- `ExperienceDeleted` - Experience deleted successfully
- `ExperienceOrderUpdated` - Experience order updated successfully

## UI/UX Features

### 🎨 **Design System**
- **Color Theme**: Indigo (`Colors.indigo.shade600`) for professional look
- **Material Design 3**: Modern, consistent UI components
- **Responsive Layout**: Works on different screen sizes
- **Loading States**: Progress indicators and skeleton screens
- **Error Handling**: User-friendly error messages with retry options

### 🔍 **Search & Filtering**
- **Real-time Search**: Instant filtering as you type
- **Company Filter**: Dropdown with all unique companies
- **Visibility Toggle**: Show/hide non-visible experiences
- **Combined Filters**: Multiple filters work together seamlessly

### 📱 **View Modes**
- **List View**: Traditional list with detailed information
- **Grid View**: Compact cards for quick browsing
- **Toggle Button**: Easy switching between view modes
- **Consistent Information**: Same data displayed in both views

### 🎯 **Form Features**
- **Dynamic Lists**: Add/remove achievements and technologies with chips
- **Live Preview**: See company icon as you enter URL
- **Form Validation**: Comprehensive validation with helpful error messages
- **Auto-complete**: Smart suggestions for common fields
- **Keyboard Navigation**: Efficient form navigation

## Experience Data Structure

### 📋 **Experience Fields**
- **Basic Information**:
  - Job Title (required)
  - Company (required)
  - Employment Period (required)
  - Location (optional)
  - Job Description (required)

- **Professional Details**:
  - Company Icon (URL)
  - Key Achievements (dynamic list)
  - Technologies & Skills (dynamic list)
  - Visibility Status (public/private)

- **Metadata**:
  - Order (for portfolio display)
  - Creation/Update timestamps
  - User association

### 🏷️ **Technology Tags**
- **Visual Design**: Indigo-themed chips with rounded corners
- **Dynamic Management**: Add/remove technologies easily
- **Portfolio Display**: Clean, professional appearance
- **Responsive Layout**: Wraps appropriately on all screen sizes

### 🎯 **Achievement Lists**
- **Structured Display**: Bullet-pointed lists with proper spacing
- **Dynamic Management**: Add/remove achievements with validation
- **Professional Formatting**: Clean, readable presentation
- **Character Limits**: Reasonable limits for portfolio display

## Portfolio Integration

### 🌐 **Public Display**
- **Ordered Display**: Experiences shown in user-defined order
- **Visibility Control**: Only visible experiences shown publicly
- **Professional Layout**: Clean, resume-style presentation
- **Technology Showcase**: Skills prominently displayed

### 🔒 **Privacy Controls**
- **Visibility Toggle**: Control which experiences are public
- **Private Drafts**: Keep experiences hidden while editing
- **Selective Display**: Choose what to show on portfolio

## Usage Examples

### 1. **Browse Experiences**

```dart
// Navigate to experience list
context.go('/experience');

// Features include:
// - Search by title, company, or description
// - Filter by company or visibility
// - Toggle between list and grid views
// - Pull-to-refresh for latest data
```

### 2. **View Experience Details**

```dart
// Navigate to experience details
context.go('/experience/$experienceId');

// Features include:
// - Full experience information
// - Company icon display
// - Achievement lists
// - Technology tags
// - Edit/delete actions
```

### 3. **Create New Experience**

```dart
// Navigate to create experience
context.go('/experience/create');

// Features include:
// - Comprehensive form with validation
// - Dynamic achievement and technology lists
// - Company icon preview
// - Visibility controls
```

### 4. **Edit Existing Experience**

```dart
// Navigate to edit experience
context.go('/experience/$experienceId/edit');

// Features include:
// - Pre-populated form
// - All create features
// - Update functionality
```

### 5. **Reorder Experiences**

```dart
// Navigate to ordering page
context.go('/experience/ordering');

// Features include:
// - Drag and drop reordering
// - Visual order indicators
// - Bulk order updates
```

## Form Validation

All forms include comprehensive validation:

### 📝 **Required Fields**
- Job Title: Must not be empty
- Company: Must not be empty
- Employment Period: Must not be empty
- Job Description: Must not be empty

### 🌐 **URL Validation**
- Company Icon: Valid URL format required
- Error handling for broken image URLs
- Fallback to default work icon

### 📏 **Length Constraints**
- Reasonable limits for all text fields
- Character counting for descriptions
- Truncation for display purposes

## Error Handling

- **Network Errors**: User-friendly messages with retry options
- **Validation Errors**: Inline form validation with specific messages
- **Loading States**: Prevents multiple submissions during async operations
- **Empty States**: Helpful guidance when no data exists
- **Image Errors**: Fallback display for invalid image URLs

## Accessibility

- **Semantic Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: High contrast for readability
- **Touch Targets**: Appropriate sizing for mobile devices
- **Screen Reader Support**: Proper ARIA labels and descriptions

## Performance Optimizations

- **Lazy Loading**: Load experiences as needed
- **Image Caching**: Efficient image loading and caching
- **Debounced Search**: Optimized search input handling
- **Efficient Reordering**: Minimal API calls for order updates
- **Memory Management**: Proper disposal of controllers and listeners

## Future Enhancements

- [ ] **Experience Templates**: Pre-defined templates for common roles
- [ ] **Import from LinkedIn**: Automatic experience import
- [ ] **PDF Export**: Generate resume PDF from experiences
- [ ] **Experience Analytics**: View statistics and insights
- [ ] **Bulk Operations**: Mass edit or delete experiences
- [ ] **Experience Categories**: Categorize by industry or type
- [ ] **Skills Assessment**: Rate proficiency in technologies
- [ ] **Recommendation Engine**: Suggest relevant experiences
- [ ] **Integration APIs**: Connect with job boards and platforms
- [ ] **Advanced Filtering**: Date ranges, skill filters, etc.

## Integration Points

The experience domain integrates with:

1. **Auth Domain**: User authentication and permissions
2. **Core Layer**: Dependency injection and error handling
3. **Data Layer**: Repository pattern for experience storage
4. **Domain Layer**: Use cases and entities
5. **Portfolio Display**: Public-facing experience showcase

This creates a comprehensive experience management system that allows users to create, manage, and showcase their professional work history with modern UI/UX and robust functionality.
