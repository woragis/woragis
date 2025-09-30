import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Core
import '../database/database_helper.dart';
import '../database/sync_manager.dart';
import '../network/network_info.dart';
import '../query/query_client.dart';

// Core BLoCs
import '../presentation/bloc/theme/theme_bloc.dart';
import '../presentation/bloc/language/language_bloc.dart';
import '../presentation/bloc/navigation/navigation_bloc.dart';

// Auth
import '../../features/auth/data/datasources/auth_local_datasource.dart';
import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/usecases.dart';

// Blog
// import '../../features/blog/data/datasources/blog_local_datasource.dart';
// import '../../features/blog/data/datasources/blog_remote_datasource.dart';
// import '../../features/blog/data/datasources/blog_remote_datasource_query.dart';
// import '../../features/blog/data/repositories/blog_repository_impl.dart';
// import '../../features/blog/domain/repositories/blog_repository.dart';
// import '../../features/blog/domain/usecases/usecases.dart';
// import '../../features/blog/presentation/bloc/create_blog_post/create_blog_post_bloc.dart';
// import '../../features/blog/presentation/bloc/blog_filter/blog_filter_bloc.dart';

// Projects
// import '../../features/projects/data/datasources/projects_local_datasource.dart';
// import '../../features/projects/data/datasources/projects_remote_datasource.dart';
// import '../../features/projects/data/datasources/projects_remote_datasource_query.dart';
// import '../../features/projects/data/repositories/projects_repository_impl.dart';
// import '../../features/projects/domain/repositories/projects_repository.dart';

// Frameworks
// import '../../features/frameworks/data/datasources/frameworks_local_datasource.dart';
// import '../../features/frameworks/data/datasources/frameworks_remote_datasource.dart';
// import '../../features/frameworks/data/datasources/frameworks_remote_datasource_query.dart';
// import '../../features/frameworks/data/repositories/frameworks_repository_impl.dart';
// import '../../features/frameworks/domain/repositories/frameworks_repository.dart';

// About
// import '../../features/about/data/datasources/about_local_datasource.dart';
// import '../../features/about/data/datasources/about_remote_datasource.dart';
// import '../../features/about/data/datasources/about_remote_datasource_query.dart';
// import '../../features/about/data/repositories/about_repository_impl.dart';
// import '../../features/about/domain/repositories/about_repository.dart';

// Education
// import '../../features/education/data/datasources/education_local_datasource.dart';
// import '../../features/education/data/datasources/education_remote_datasource.dart';
// import '../../features/education/data/datasources/education_remote_datasource_query.dart';
// import '../../features/education/data/repositories/education_repository_impl.dart';
// import '../../features/education/domain/repositories/education_repository.dart';

// Experience
// import '../../features/experience/data/datasources/experience_local_datasource.dart';
// import '../../features/experience/data/datasources/experience_remote_datasource.dart';
// import '../../features/experience/data/datasources/experience_remote_datasource_query.dart';
// import '../../features/experience/data/repositories/experience_repository_impl.dart';
// import '../../features/experience/domain/repositories/experience_repository.dart';

// Money
// import '../../features/money/data/datasources/money_local_datasource.dart';
// import '../../features/money/data/datasources/money_remote_datasource.dart';
// import '../../features/money/data/datasources/money_remote_datasource_query.dart';
// import '../../features/money/data/repositories/money_repository_impl.dart';
// import '../../features/money/domain/repositories/money_repository.dart';

// Testimonials
// import '../../features/testimonials/data/datasources/testimonials_local_datasource.dart';
// import '../../features/testimonials/data/datasources/testimonials_remote_datasource.dart';
// import '../../features/testimonials/data/datasources/testimonials_remote_datasource_query.dart';
// import '../../features/testimonials/data/repositories/testimonials_repository_impl.dart';
// import '../../features/testimonials/domain/repositories/testimonials_repository.dart';

// Settings
// import '../../features/settings/data/datasources/settings_local_datasource.dart';
// import '../../features/settings/data/datasources/settings_remote_datasource.dart';
// import '../../features/settings/data/datasources/settings_remote_datasource_query.dart';
// import '../../features/settings/data/repositories/settings_repository_impl.dart';
// import '../../features/settings/domain/repositories/settings_repository.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // Core
  sl.registerLazySingleton<DatabaseHelper>(() => DatabaseHelper());
  sl.registerLazySingleton<SyncManager>(() => SyncManager());
  
  // External
  sl.registerLazySingleton(() => http.Client());
  sl.registerLazySingleton(() => Connectivity());
  
  // SharedPreferences (for BLoCs)
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton<SharedPreferences>(() => sharedPreferences);
  
  // Core - Network Info
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  
  // Core - Query Client Manager
  sl.registerLazySingleton<QueryClientManager>(() => QueryClientManager());
  
  // Initialize Query Client Manager
  await sl<QueryClientManager>().initialize();

  // Core BLoCs (for local UI state only)
  _initCoreBLoCs();

  // Auth
  _initAuth();
  
  // Blog
  // _initBlog();
  
  // Projects
  // _initProjects();
  
  // Frameworks
  // _initFrameworks();
  
  // About
  // _initAbout();
  
  // Education
  // _initEducation();
  
  // Experience
  // _initExperience();
  
  // Money
  // _initMoney();
  
  // Testimonials
  // _initTestimonials();
  
  // Settings
  // _initSettings();
}

// Core BLoCs - Local UI State Only
void _initCoreBLoCs() {
  // Theme BLoC - manages dark/light mode (local state)
  sl.registerFactory(() => ThemeBloc(sharedPreferences: sl()));
  
  // Language BLoC - manages app language (local state)
  sl.registerFactory(() => LanguageBloc(sharedPreferences: sl()));
  
  // Navigation BLoC - manages bottom nav and routing (local state)
  sl.registerFactory(() => NavigationBloc());
}

// Auth
void _initAuth() {
  // Data sources
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(),
  );
  
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(
      client: sl(),
      baseUrl: 'http://localhost:3000/api', // This should come from environment
    ),
  );

  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerLazySingleton(() => GetCurrentUserUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => RefreshTokenUseCase(sl()));
  sl.registerLazySingleton(() => ChangePasswordUseCase(sl()));
  sl.registerLazySingleton(() => UpdateProfileUseCase(sl()));
}

// TODO: Uncomment these functions when the corresponding feature files are created

// Blog
// void _initBlog() {
//   // Data sources
//   sl.registerLazySingleton<BlogLocalDataSource>(
//     () => BlogLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<BlogRemoteDataSource>(
//     () => BlogRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<BlogRemoteDataSourceQuery>(
//     () => BlogRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<BlogRepository>(
//     () => BlogRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );

//   // Use cases
//   sl.registerLazySingleton(() => GetBlogPostsUseCase(sl()));
//   sl.registerLazySingleton(() => GetBlogPostByIdUseCase(sl()));
//   sl.registerLazySingleton(() => GetBlogPostBySlugUseCase(sl()));
//   sl.registerLazySingleton(() => CreateBlogPostUseCase(sl()));
//   sl.registerLazySingleton(() => UpdateBlogPostUseCase(sl()));
//   sl.registerLazySingleton(() => DeleteBlogPostUseCase(sl()));
//   sl.registerLazySingleton(() => IncrementViewCountUseCase(sl()));
//   sl.registerLazySingleton(() => IncrementLikeCountUseCase(sl()));
//   sl.registerLazySingleton(() => GetBlogTagsUseCase(sl()));
//   sl.registerLazySingleton(() => CreateBlogTagUseCase(sl()));
//   
//   // BLoCs (local UI state only - NOT for server data)
//   sl.registerFactory(() => CreateBlogPostBloc());  // Form validation & multi-step
//   sl.registerFactory(() => BlogFilterBloc());       // Filters, sorting, view mode
// }

// Projects
// void _initProjects() {
//   // Data sources
//   sl.registerLazySingleton<ProjectsLocalDataSource>(
//     () => ProjectsLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<ProjectsRemoteDataSource>(
//     () => ProjectsRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<ProjectsRemoteDataSourceQuery>(
//     () => ProjectsRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<ProjectsRepository>(
//     () => ProjectsRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// Frameworks
// void _initFrameworks() {
//   // Data sources
//   sl.registerLazySingleton<FrameworksLocalDataSource>(
//     () => FrameworksLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<FrameworksRemoteDataSource>(
//     () => FrameworksRemoteDataSourceImpl(
//       client: sl(),
//     ),
//   );
//   
//   sl.registerLazySingleton<FrameworksRemoteDataSourceQuery>(
//     () => FrameworksRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<FrameworksRepository>(
//     () => FrameworksRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// About
// void _initAbout() {
//   // Data sources
//   sl.registerLazySingleton<AboutLocalDataSource>(
//     () => AboutLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<AboutRemoteDataSource>(
//     () => AboutRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<AboutRemoteDataSourceQuery>(
//     () => AboutRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<AboutRepository>(
//     () => AboutRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// Education
// void _initEducation() {
//   // Data sources
//   sl.registerLazySingleton<EducationLocalDataSource>(
//     () => EducationLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<EducationRemoteDataSource>(
//     () => EducationRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<EducationRemoteDataSourceQuery>(
//     () => EducationRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<EducationRepository>(
//     () => EducationRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// Experience
// void _initExperience() {
//   // Data sources
//   sl.registerLazySingleton<ExperienceLocalDataSource>(
//     () => ExperienceLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<ExperienceRemoteDataSource>(
//     () => ExperienceRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<ExperienceRemoteDataSourceQuery>(
//     () => ExperienceRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<ExperienceRepository>(
//     () => ExperienceRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// Money
// void _initMoney() {
//   // Data sources
//   sl.registerLazySingleton<MoneyLocalDataSource>(
//     () => MoneyLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<MoneyRemoteDataSource>(
//     () => MoneyRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<MoneyRemoteDataSourceQuery>(
//     () => MoneyRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<MoneyRepository>(
//     () => MoneyRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// Testimonials
// void _initTestimonials() {
//   // Data sources
//   sl.registerLazySingleton<TestimonialsLocalDataSource>(
//     () => TestimonialsLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<TestimonialsRemoteDataSource>(
//     () => TestimonialsRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<TestimonialsRemoteDataSourceQuery>(
//     () => TestimonialsRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<TestimonialsRepository>(
//     () => TestimonialsRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }

// Settings
// void _initSettings() {
//   // Data sources
//   sl.registerLazySingleton<SettingsLocalDataSource>(
//     () => SettingsLocalDataSourceImpl(),
//   );
//   
//   sl.registerLazySingleton<SettingsRemoteDataSource>(
//     () => SettingsRemoteDataSourceImpl(
//       client: sl(),
//       baseUrl: 'http://localhost:3000/api',
//     ),
//   );
//   
//   sl.registerLazySingleton<SettingsRemoteDataSourceQuery>(
//     () => SettingsRemoteDataSourceQueryImpl(
//       queryClientManager: sl(),
//       dio: sl<QueryClientManager>().dio,
//     ),
//   );

//   // Repository
//   sl.registerLazySingleton<SettingsRepository>(
//     () => SettingsRepositoryImpl(
//       remoteDataSource: sl(),
//       localDataSource: sl(),
//     ),
//   );
// }