# About Domain - Presentation Layer

This directory contains the presentation layer for the **About** domain, which manages the display and interaction with personal information, biography, anime preferences, and music genres in the portfolio application.

## 📁 Directory Structure

```
presentation/
├── bloc/
│   └── about_bloc.dart              # State management for about information
├── pages/
│   ├── about_overview_page.dart     # Main about page with overview
│   ├── edit_about_page.dart         # Edit personal information form
│   ├── anime_management_page.dart   # Anime and shows management
│   ├── music_genres_page.dart       # Music genres management
│   └── pages.dart                   # Export file for all pages
└── README.md                        # This documentation
```

## 🎯 Features

### 1. **Personal Information Management**
- **Overview Page**: Comprehensive personal profile display
- **Edit Profile**: Form for updating personal information
- **Biography Management**: Featured and full biography sections
- **Visibility Control**: Public/private profile settings

### 2. **Anime & Shows Management**
- **Anime List**: Grid and list view with search and filtering
- **Status Tracking**: Watch status (watching, completed, on hold, dropped, plan to watch)
- **Progress Tracking**: Episode progress and ratings
- **Cover Images**: Visual representation of anime/shows

### 3. **Music Genres Management**
- **Genre List**: Grid and list view with search functionality
- **Genre Organization**: Order management and visibility settings
- **Color Coding**: Visual distinction between different genres

### 4. **Visual Design**
- **Material Design 3**: Modern UI components with consistent theming
- **Color-coded Elements**: Visual distinction for different content types
- **Status Indicators**: Clear visibility and status indicators
- **Responsive Layout**: Grid and list view options

## 🏗️ Architecture

### **BLoC Pattern Implementation**

The about domain uses the BLoC (Business Logic Component) pattern for state management:

#### **Events**
- `LoadAboutCore`: Load about core information
- `RefreshAboutCore`: Refresh the current about data
- `UpdateAboutCore`: Update personal information

#### **States**
- `AboutInitial`: Initial state
- `AboutLoading`: Loading state with progress indicator
- `AboutLoaded`: Success state with about data
- `AboutError`: Error state with error message

#### **BLoC Features**
- **Data Management**: Handle about core, biography, anime, and music data
- **Error Handling**: Comprehensive error handling with retry options
- **Loading States**: Proper loading indicators and state management
- **Update Operations**: Real-time updates for personal information

### **Data Access**

The about domain uses the repository pattern with proper caching for efficient data access:

```dart
// Get about core information through BLoC
context.read<AboutBloc>().add(const LoadAboutCore());

// Get biography through BLoC
context.read<AboutBloc>().add(const LoadBiography());

// Get anime list through BLoC
context.read<AboutBloc>().add(const LoadAnimeList());

// Get music genres through BLoC
context.read<AboutBloc>().add(const LoadMusicGenres());
```

## 📱 Pages Overview

### **1. About Overview Page**

**Features:**
- Personal profile header with avatar and basic information
- Biography section with featured and full biography
- Anime section with recent shows and status
- Music genres section with favorite genres
- Quick actions for editing and management

**UI Components:**
- Profile header with avatar and name
- Biography cards with featured and full content
- Anime cards with cover images and status
- Music genre chips with color coding
- Quick action buttons for navigation

### **2. Edit About Page**

**Features:**
- Comprehensive form for personal information
- Biography editing with featured and full sections
- Current profession management
- Visibility settings
- Form validation with error messages

**Form Sections:**
- **Basic Information**: Name and current profession
- **Biography**: Featured and full biography editing
- **Settings**: Visibility and privacy settings

### **3. Anime Management Page**

**Features:**
- Grid and list view toggle
- Search functionality across titles and descriptions
- Status filtering (watching, completed, on hold, dropped, plan to watch)
- Progress tracking with visual indicators
- Cover image display with fallback icons

**UI Components:**
- Search bar with clear functionality
- Filter chips for status selection
- Grid view with anime cards
- List view with detailed information
- Progress indicators and ratings

### **4. Music Genres Page**

**Features:**
- Grid and list view toggle
- Search functionality across genre names and descriptions
- Color-coded genre representation
- Order management display
- Visibility status indicators

**UI Components:**
- Search bar with real-time filtering
- Grid view with genre cards
- List view with detailed information
- Color-coded genre icons
- Order and visibility indicators

## 🎨 UI/UX Features

### **Visual Design**
- **Material Design 3**: Consistent with app theme
- **Color-coded Elements**: Visual distinction for different content types
- **Status Indicators**: Clear visibility and status indicators
- **Responsive Cards**: Adaptive layout for different screen sizes

### **User Experience**
- **Search & Filter**: Intuitive filtering with clear visual feedback
- **Grid/List Toggle**: User preference for display mode
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

### **Performance Optimizations**
- **Efficient Filtering**: Client-side filtering for better performance
- **Memory Management**: Proper disposal of controllers and resources
- **Lazy Loading**: Load data as needed

## 🚀 Usage Examples

### **Basic Navigation**
```dart
// Navigate to about overview
context.go('/about');

// Navigate to edit about
context.go('/about/edit');

// Navigate to anime management
context.go('/about/anime');

// Navigate to music genres
context.go('/about/music');
```

### **BLoC Integration**
```dart
// Load about information
context.read<AboutBloc>().add(const LoadAboutCore());

// Update about information
context.read<AboutBloc>().add(UpdateAboutCore(
  name: 'John Doe',
  biography: 'Software developer...',
  visible: true,
));

// Refresh about data
context.read<AboutBloc>().add(const RefreshAboutCore());
```

### **BLoC Usage**
```dart
// Get about core information
context.read<AboutBloc>().add(const LoadAboutCore());

// Get biography
context.read<AboutBloc>().add(const LoadBiography());

// Get anime list
context.read<AboutBloc>().add(const LoadAnimeList());
```

## 🔄 Integration Points

### **Dependencies**
- **Domain Layer**: Uses about entities and use cases
- **Core Layer**: Uses dependency injection and error handling
- **App Layer**: Integrates with routing and theming

### **External Integrations**
- **Navigation**: Uses go_router for navigation
- **State Management**: Uses flutter_bloc for state management
- **UI Components**: Uses Material Design 3 components
- **Form Handling**: Uses built-in form validation

## 📋 Future Enhancements

### **Planned Features**
- **Anime Integration**: MyAnimeList API integration
- **Music Integration**: Spotify/Apple Music integration
- **Social Features**: Share profile and preferences
- **Analytics**: Profile view statistics

### **Technical Improvements**
- **Caching**: Implement local caching for better performance
- **Offline Support**: Work offline with cached data
- **Real-time Updates**: Live updates when information changes
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

- **Domain Layer**: About entities and use cases
- **Data Layer**: Repository implementations and data sources
- **Core Layer**: Dependency injection and error handling
- **App Layer**: Routing configuration and theming

---

This presentation layer provides a comprehensive and user-friendly interface for managing personal information, biography, anime preferences, and music genres in the portfolio application, following clean architecture principles and modern Flutter development practices.
