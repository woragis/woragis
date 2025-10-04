# Flutter Mobile App - Architecture Documentation

## 🏗️ Clean Architecture with Flutter Query + Selective BLoC

This Flutter application follows **Clean Architecture** principles with a modern twist: **Flutter Query for server state** and **BLoC for local UI state only**.

## 📐 Architecture Layers

```
lib/
├── core/                           # Core functionality
│   ├── database/                   # SQLite offline storage
│   ├── network/                    # Network connectivity
│   ├── query/                      # Flutter Query configuration
│   ├── error/                      # Error handling
│   ├── injection/                  # Dependency injection
│   └── presentation/
│       └── bloc/                   # Core BLoCs (local UI state)
│           ├── theme/              # Theme management
│           ├── language/           # Localization
│           └── navigation/         # Navigation state
│
└── features/                       # Feature modules
    └── [feature]/
        ├── domain/                 # Business logic layer
        │   ├── entities/           # Domain models
        │   ├── repositories/       # Abstract interfaces
        │   └── usecases/           # Business operations
        ├── data/                   # Data layer
        │   ├── models/             # Data models (JSON)
        │   ├── datasources/
        │   │   ├── local/          # SQLite (offline)
        │   │   └── remote_query/   # Flutter Query (server)
        │   └── repositories/       # Repository implementations
        └── presentation/           # UI layer
            ├── pages/              # Screens (use Flutter Query hooks)
            ├── widgets/            # Reusable components
            └── bloc/               # BLoCs (local UI state ONLY)
                ├── forms/          # Complex form validation
                └── filters/        # Local filtering/sorting
```

## 🎯 **Key Architecture Decisions**

### **1. Flutter Query for Server State** ⭐

**Use Flutter Query hooks directly in widgets for:**
- ✅ Data fetching from API
- ✅ Caching and background sync
- ✅ Loading/error states
- ✅ Optimistic updates
- ✅ Automatic refetching

**Example:**
```dart
class BlogPostsPage extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final blogQuery = sl<BlogRemoteDataSourceQuery>()
        .getBlogPosts(BlogPostsParams(published: true));

    return blogQuery.useQueryBuilder(
      builder: (context, query) {
        if (query.isLoading) return LoadingWidget();
        if (query.hasError) return ErrorWidget(query.error);
        return BlogPostsList(posts: query.data!);
      },
    );
  }
}
```

### **2. BLoC for Local UI State Only** 🎨

**Use BLoC ONLY for:**
- ✅ Theme (dark/light mode)
- ✅ Language selection
- ✅ Navigation state
- ✅ Complex form validation
- ✅ Local filtering/sorting
- ✅ View mode (grid/list)
- ✅ Multi-step wizards

**❌ DON'T use BLoC for:**
- ❌ Fetching data from API (use Flutter Query)
- ❌ Caching server data (use Flutter Query)
- ❌ Simple CRUD operations (use Flutter Query)

**Example:**
```dart
class BlogPostsPage extends HookWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => BlogFilterBloc(), // Local UI state
      child: BlocBuilder<BlogFilterBloc, BlogFilterState>(
        builder: (context, filterState) {
          // Use filter state to query server data
          final blogQuery = sl<BlogRemoteDataSourceQuery>()
              .getBlogPosts(BlogPostsParams(
                search: filterState.searchQuery,
                sortBy: filterState.sortBy,
              ));

          return blogQuery.useQueryBuilder(...);
        },
      ),
    );
  }
}
```

### **3. Use Cases for Business Logic**

Use cases encapsulate specific business operations and can be used by:
- Flutter Query mutations
- BLoCs (for complex local operations)
- Direct widget calls

**Simplified approach:**
```dart
// For simple CRUD - use Flutter Query directly
final createMutation = blogDataSource.createBlogPost();
createMutation.mutate(CreateBlogPostData(...));

// For complex business logic - use use cases
final result = await sl<CreateBlogPostUseCase>()(params);
```

## 🔄 **Data Flow**

### **Server Data (Flutter Query)**
```
Widget → Flutter Query → Remote DataSource → API
                ↓
           Cache (automatic)
                ↓
           SQLite (offline)
```

### **Local UI State (BLoC)**
```
User Action → Event → BLoC → State → Widget Update
                              ↓
                    SharedPreferences (persistence)
```

## 📦 **Implemented BLoCs**

### **Core BLoCs** (App-wide local state)
1. **ThemeBloc** - Dark/light mode management
2. **LanguageBloc** - App localization (8 languages)
3. **NavigationBloc** - Bottom navigation and routing

### **Feature BLoCs** (Feature-specific local state)
1. **CreateBlogPostBloc** - Multi-step form with validation
2. **BlogFilterBloc** - Search, filters, sorting, view mode

## 🚀 **State Management Strategy**

| State Type | Solution | Example |
|------------|----------|---------|
| Server Data | Flutter Query | Blog posts, projects, user data |
| Local UI | BLoC | Theme, language, filters |
| Complex Forms | BLoC | Multi-step wizards, validation |
| Simple Forms | Local state (useState) | Search bar, simple inputs |
| Global App State | BLoC | Navigation, theme, language |

## 💾 **Offline-First Architecture**

### **SQLite + Flutter Query**
- Local datasources use SQLite for offline storage
- Flutter Query manages cache invalidation
- SyncManager handles background sync
- Network-aware query execution

### **Sync Strategy**
1. **Read**: Try cache first, then network
2. **Write**: Optimistic update + queue for sync
3. **Sync**: Background sync when online
4. **Conflict**: Server wins (configurable)

## 🧪 **Testing Strategy**

### **Use Cases**
```dart
test('should return blog posts from repository', () async {
  // Arrange
  final useCase = GetBlogPostsUseCase(mockRepository);
  
  // Act
  final result = await useCase(params);
  
  // Assert
  expect(result, isRight);
});
```

### **BLoCs**
```dart
blocTest<BlogFilterBloc, BlogFilterState>(
  'emits new filter state when search query changed',
  build: () => BlogFilterBloc(),
  act: (bloc) => bloc.add(SearchQueryChanged('flutter')),
  expect: () => [
    predicate<BlogFilterState>(
      (state) => state.searchQuery == 'flutter',
    ),
  ],
);
```

### **Flutter Query**
```dart
testWidgets('displays blog posts from query', (tester) async {
  // Mock the query data source
  when(mockBlogDataSource.getBlogPosts(any))
      .thenAnswer((_) => mockQuery);
  
  await tester.pumpWidget(BlogPostsPage());
  
  expect(find.text('Test Post'), findsOneWidget);
});
```

## 📚 **Key Packages**

### **State Management**
- `flutter_query: ^1.0.3` - Server state management
- `flutter_bloc: ^8.1.4` - Local UI state management
- `flutter_hooks: ^0.20.5` - React-like hooks for Flutter

### **Architecture**
- `get_it: ^7.6.7` - Dependency injection
- `injectable: ^2.3.2` - Code generation for DI
- `dartz: ^0.10.1` - Functional programming (Either, Option)

### **Data**
- `sqflite: ^2.3.0` - SQLite database
- `dio: ^5.4.0` - HTTP client
- `shared_preferences: ^2.2.2` - Key-value storage

### **Offline & Sync**
- `connectivity_plus: ^5.0.2` - Network connectivity
- Custom `SyncManager` for background sync
- Custom `DatabaseHelper` for SQLite management

## 🎓 **Best Practices**

### **DO ✅**
- Use Flutter Query for all server data
- Use BLoC only for local UI state
- Keep BLoCs simple and focused
- Use use cases for complex business logic
- Implement optimistic updates
- Handle errors gracefully
- Write tests for BLoCs and use cases

### **DON'T ❌**
- Don't wrap Flutter Query with BLoC
- Don't use BLoC for simple data fetching
- Don't duplicate state between Flutter Query and BLoC
- Don't forget to dispose BLoCs properly
- Don't ignore linter warnings

## 🔧 **Development Workflow**

### **Adding a New Feature**

1. **Define Domain Models** (entities)
2. **Create Data Models** (with JSON serialization)
3. **Define Repository Interface**
4. **Implement Local DataSource** (SQLite)
5. **Implement Remote DataSource** (Flutter Query)
6. **Implement Repository**
7. **Create Use Cases** (if needed)
8. **Create BLoCs** (for local UI state only)
9. **Build UI** (with Flutter Query hooks)
10. **Register in DI Container**

## 📖 **Examples**

### **Fetching Data (Flutter Query)**
See: `lib/features/blog/presentation/pages/blog_posts_page_with_bloc.dart`

### **Complex Form (BLoC)**
See: `lib/features/blog/presentation/bloc/create_blog_post/create_blog_post_bloc.dart`

### **Filters & Sorting (BLoC)**
See: `lib/features/blog/presentation/bloc/blog_filter/blog_filter_bloc.dart`

### **Theme Management (BLoC)**
See: `lib/core/presentation/bloc/theme/theme_bloc.dart`

## 🚀 **Getting Started**

1. **Install dependencies:**
   ```bash
   flutter pub get
   ```

2. **Generate code:**
   ```bash
   flutter pub run build_runner build
   ```

3. **Run the app:**
   ```bash
   flutter run
   ```

## 🤝 **Contributing**

When contributing, please:
1. Follow the architecture patterns
2. Use Flutter Query for server data
3. Use BLoC only for local UI state
4. Write tests for your code
5. Update this documentation if needed

---

**Remember**: The goal is **simplicity** and **maintainability**. Don't over-engineer with unnecessary state management layers. Flutter Query handles most of the complexity for you! 🎉
