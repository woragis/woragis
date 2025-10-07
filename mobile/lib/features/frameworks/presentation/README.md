# Frameworks Domain - Presentation Layer

This directory contains the presentation layer for the **Frameworks** domain, which manages the display and interaction with frameworks and technologies in the portfolio application.

## 📁 Directory Structure

```
presentation/
├── bloc/
│   └── frameworks_bloc.dart           # State management for frameworks
├── pages/
│   ├── frameworks_list_page.dart      # List view with search and filtering
│   ├── framework_detail_page.dart     # Detailed view of a framework
│   ├── create_framework_page.dart     # Create/edit framework form
│   └── pages.dart                     # Export file for all pages
└── README.md                          # This documentation
```

## 🎯 Features

### 1. **Frameworks Management**
- **List View**: Grid and list display modes with search and filtering
- **Detail View**: Comprehensive framework information display
- **Create/Edit**: Full form for adding or modifying frameworks
- **Search & Filter**: Real-time search with type, visibility, and public filters

### 2. **Advanced Filtering**
- **Type Filtering**: Filter by language, framework, library, tool, database, or other
- **Visibility Filtering**: Show/hide visible frameworks
- **Public Filtering**: Filter public vs private frameworks
- **Sorting Options**: Sort by order, name, type, or creation date
- **Search**: Real-time search across framework names and descriptions

### 3. **Visual Design**
- **Material Design 3**: Modern UI components with consistent theming
- **Color-coded Types**: Visual distinction between different framework types
- **Proficiency Indicators**: Color-coded skill level badges
- **Status Icons**: Visual indicators for visibility and public status
- **Responsive Layout**: Grid and list view options

## 🏗️ Architecture

### **BLoC Pattern Implementation**

The frameworks domain uses the BLoC (Business Logic Component) pattern for state management:

#### **Events**
- `LoadFrameworks`: Load frameworks with optional filtering and pagination
- `RefreshFrameworks`: Refresh the current frameworks list
- `SearchFrameworks`: Search frameworks by search term
- `FilterFrameworks`: Apply type, visibility, or public filters
- `SortFrameworks`: Sort frameworks by specified criteria

#### **States**
- `FrameworksInitial`: Initial state
- `FrameworksLoading`: Loading state with progress indicator
- `FrameworksLoaded`: Success state with frameworks data and metadata
- `FrameworksError`: Error state with error message

#### **BLoC Features**
- **Pagination Support**: Load more frameworks as user scrolls
- **Filter State Management**: Maintain current filter and search state
- **Error Handling**: Comprehensive error handling with retry options
- **Loading States**: Proper loading indicators and state management

### **Data Access**

The frameworks domain uses the repository pattern with proper caching for efficient data access:

```dart
// Get all frameworks through BLoC
context.read<FrameworksBloc>().add(const LoadFrameworks());

// Get visible frameworks through BLoC
context.read<FrameworksBloc>().add(const FilterFrameworks(visible: true));

// Search frameworks through BLoC
context.read<FrameworksBloc>().add(const SearchFrameworks('flutter'));

// Get frameworks by type through BLoC
context.read<FrameworksBloc>().add(const FilterFrameworks(type: 'language'));
```

## 📱 Pages Overview

### **1. Frameworks List Page**

**Features:**
- Grid and list view toggle
- Real-time search with debouncing
- Advanced filtering with chips
- Sort options dropdown
- Pull-to-refresh functionality
- Empty state with call-to-action
- Error state with retry option

**UI Components:**
- Search bar with clear button
- Filter chips for type, visibility, and public status
- Sort dropdown with multiple options
- Grid view with framework cards
- List view with detailed list items
- Loading and error states

### **2. Framework Detail Page**

**Features:**
- Comprehensive framework information display
- Visual framework representation with icon and color
- Type and proficiency level badges
- Visibility status indicators
- Edit and delete actions
- Responsive layout

**UI Components:**
- Header card with icon, name, and badges
- Description section
- Details table with key information
- Visibility status indicators
- Action buttons for edit and delete

### **3. Create/Edit Framework Page**

**Features:**
- Comprehensive form with validation
- Auto-slug generation from name
- Color picker with hex validation
- Type and proficiency level dropdowns
- Visibility and public settings
- Order management
- Form validation with error messages

**Form Sections:**
- **Basic Information**: Name, slug, description
- **Visual Settings**: Icon, color with preview
- **Classification**: Type, proficiency level
- **Settings**: Order, visibility, public status

## 🎨 UI/UX Features

### **Visual Design**
- **Material Design 3**: Consistent with app theme
- **Color-coded Types**: Visual distinction between framework types
- **Proficiency Badges**: Color-coded skill level indicators
- **Status Icons**: Clear visibility and public status indicators
- **Responsive Cards**: Adaptive layout for different screen sizes

### **User Experience**
- **Search & Filter**: Intuitive filtering with clear visual feedback
- **Grid/List Toggle**: User preference for display mode
- **Pull-to-Refresh**: Standard mobile interaction pattern
- **Loading States**: Clear feedback during data operations
- **Error Handling**: User-friendly error messages with retry options
- **Empty States**: Helpful guidance when no data is available

### **Accessibility**
- **Semantic Labels**: Proper labeling for screen readers
- **Color Contrast**: Sufficient contrast for all text and icons
- **Touch Targets**: Adequate size for all interactive elements
- **Keyboard Navigation**: Support for keyboard navigation

## 🔧 Technical Implementation

### **State Management**
- **BLoC Pattern**: Clean separation of business logic and UI
- **Event-driven**: Reactive state updates based on user actions
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Proper loading indicators and state management

### **Data Flow**
1. **User Action** → **Event** → **BLoC** → **Use Case** → **Repository**
2. **Repository** → **Use Case** → **BLoC** → **State** → **UI Update**

### **Form Validation**
- **Real-time Validation**: Immediate feedback on form inputs
- **Comprehensive Rules**: Validation for all required fields
- **User-friendly Messages**: Clear error messages and guidance
- **Auto-generation**: Automatic slug generation from name

### **Performance Optimizations**
- **Lazy Loading**: Load frameworks as needed with pagination
- **Debounced Search**: Prevent excessive API calls during typing
- **Efficient Filtering**: Client-side filtering for better performance
- **Memory Management**: Proper disposal of controllers and resources

## 🚀 Usage Examples

### **Basic Navigation**
```dart
// Navigate to frameworks list
context.go('/frameworks');

// Navigate to specific framework
context.go('/frameworks/${frameworkId}');

// Navigate to create framework
context.go('/frameworks/create');

// Navigate to edit framework
context.go('/frameworks/${frameworkId}/edit');
```

### **BLoC Integration**
```dart
// Load frameworks
context.read<FrameworksBloc>().add(const LoadFrameworks());

// Search frameworks
context.read<FrameworksBloc>().add(SearchFrameworks('flutter'));

// Filter by type
context.read<FrameworksBloc>().add(FilterFrameworks(type: 'framework'));

// Refresh frameworks
context.read<FrameworksBloc>().add(const RefreshFrameworks());
```

### **BLoC Usage**
```dart
// Get all frameworks
context.read<FrameworksBloc>().add(const LoadFrameworks());

// Get visible frameworks
context.read<FrameworksBloc>().add(const FilterFrameworks(visible: true));

// Search frameworks
context.read<FrameworksBloc>().add(const SearchFrameworks('react'));
```

## 🔄 Integration Points

### **Dependencies**
- **Domain Layer**: Uses framework entities and use cases
- **Core Layer**: Uses dependency injection and error handling
- **App Layer**: Integrates with routing and theming

### **External Integrations**
- **Navigation**: Uses go_router for navigation
- **State Management**: Uses flutter_bloc for state management
- **UI Components**: Uses Material Design 3 components
- **Form Handling**: Uses built-in form validation

## 📋 Future Enhancements

### **Planned Features**
- **Bulk Operations**: Select and manage multiple frameworks
- **Import/Export**: Import frameworks from external sources
- **Advanced Filtering**: More sophisticated filtering options
- **Analytics**: Usage statistics and insights
- **Templates**: Pre-defined framework templates

### **Technical Improvements**
- **Caching**: Implement local caching for better performance
- **Offline Support**: Work offline with cached data
- **Real-time Updates**: Live updates when frameworks change
- **Advanced Search**: Full-text search with highlighting

## 🧪 Testing Considerations

### **Unit Tests**
- **BLoC Tests**: Test all events and state transitions
- **Repository Tests**: Test data access and caching logic
- **Validation Tests**: Test form validation logic

### **Widget Tests**
- **Page Tests**: Test all page widgets and interactions
- **Form Tests**: Test form validation and submission
- **Navigation Tests**: Test navigation between pages

### **Integration Tests**
- **End-to-End**: Test complete user workflows
- **API Integration**: Test with real backend services
- **Performance Tests**: Test with large datasets

## 📚 Related Documentation

- **Domain Layer**: Framework entities and use cases
- **Data Layer**: Repository implementations and data sources
- **Core Layer**: Dependency injection and error handling
- **App Layer**: Routing configuration and theming

---

This presentation layer provides a comprehensive and user-friendly interface for managing frameworks and technologies in the portfolio application, following clean architecture principles and modern Flutter development practices.
