import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/pages/pages.dart';
import '../../features/money/presentation/pages/pages.dart';
import '../../features/projects/presentation/pages/pages.dart';
import '../../features/frameworks/presentation/pages/pages.dart';
import '../../features/education/presentation/pages/pages.dart';
import '../../features/about/presentation/pages/pages.dart';
import '../../features/settings/presentation/pages/pages.dart';
import '../../features/experience/presentation/pages/pages.dart';
import '../../features/blog/presentation/pages/pages.dart';
import '../../features/testimonials/presentation/pages/pages.dart';
import '../pages/create_page.dart';
import '../pages/main_navigation_page.dart';

class AppRouter {
  static final GoRouter _router = GoRouter(
    initialLocation: '/',
    routes: [
      // Root route - redirects to auth wrapper
      GoRoute(
        path: '/',
        builder: (context, state) => const AuthWrapper(),
      ),
      
      // Auth routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterPage(),
      ),
      
      // Main navigation (protected)
      GoRoute(
        path: '/home',
        builder: (context, state) => const AuthGuard(
          child: MainNavigationPage(),
        ),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const AuthGuard(
          child: ProfilePage(),
        ),
      ),
       GoRoute(
         path: '/change-password',
         builder: (context, state) => const AuthGuard(
           child: ChangePasswordPage(),
         ),
       ),
       GoRoute(
         path: '/create',
         builder: (context, state) => const AuthGuard(
           child: CreatePage(),
         ),
       ),

      // Projects routes
      GoRoute(
        path: '/projects',
        builder: (context, state) => const AuthGuard(
          child: ProjectsListPage(),
        ),
      ),
      GoRoute(
        path: '/projects/create',
        builder: (context, state) => const AuthGuard(
          child: CreateProjectPage(),
        ),
      ),
      GoRoute(
        path: '/projects/order',
        builder: (context, state) => const AuthGuard(
          child: ProjectOrderingPage(),
        ),
      ),
      GoRoute(
        path: '/projects/:id',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return AuthGuard(
            child: ProjectDetailPage(projectId: projectId),
          );
        },
      ),
      GoRoute(
        path: '/projects/:id/edit',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateProjectPage(projectId: projectId),
          );
        },
      ),

      // Money routes
      GoRoute(
        path: '/money/ideas',
        builder: (context, state) => const AuthGuard(
          child: IdeasListPage(),
        ),
      ),
      GoRoute(
        path: '/money/ideas/create',
        builder: (context, state) => const AuthGuard(
          child: CreateIdeaPage(),
        ),
      ),
      GoRoute(
        path: '/money/ideas/:id',
        builder: (context, state) {
          final ideaId = state.pathParameters['id']!;
          return AuthGuard(
            child: IdeaDetailPage(ideaId: ideaId),
          );
        },
      ),
      GoRoute(
        path: '/money/ideas/:id/edit',
        builder: (context, state) {
          final ideaId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateIdeaPage(ideaId: ideaId),
          );
        },
      ),
      GoRoute(
        path: '/money/ai-chats',
        builder: (context, state) => const AuthGuard(
          child: AiChatsListPage(),
        ),
      ),
      GoRoute(
        path: '/money/ai-chats/create',
        builder: (context, state) {
          final ideaId = state.uri.queryParameters['ideaId'];
          return AuthGuard(
            child: CreateAiChatPage(ideaId: ideaId),
          );
        },
      ),
      GoRoute(
        path: '/money/ai-chats/:id',
        builder: (context, state) {
          final chatId = state.pathParameters['id']!;
          return AuthGuard(
            child: AiChatPage(chatId: chatId),
          );
        },
      ),

      // Frameworks routes
      GoRoute(
        path: '/frameworks',
        builder: (context, state) => const AuthGuard(
          child: FrameworksListPage(),
        ),
      ),
      GoRoute(
        path: '/frameworks/create',
        builder: (context, state) => const AuthGuard(
          child: CreateFrameworkPage(),
        ),
      ),
      GoRoute(
        path: '/frameworks/:id',
        builder: (context, state) {
          final frameworkId = state.pathParameters['id']!;
          return AuthGuard(
            child: FrameworkDetailPage(frameworkId: frameworkId),
          );
        },
      ),
      GoRoute(
        path: '/frameworks/:id/edit',
        builder: (context, state) {
          final frameworkId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateFrameworkPage(frameworkId: frameworkId),
          );
        },
      ),

      // Education routes
      GoRoute(
        path: '/education',
        builder: (context, state) => const AuthGuard(
          child: EducationListPage(),
        ),
      ),
      GoRoute(
        path: '/education/create',
        builder: (context, state) => const AuthGuard(
          child: CreateEducationPage(),
        ),
      ),
      GoRoute(
        path: '/education/:id',
        builder: (context, state) {
          final educationId = state.pathParameters['id']!;
          return AuthGuard(
            child: EducationDetailPage(educationId: educationId),
          );
        },
      ),
      GoRoute(
        path: '/education/:id/edit',
        builder: (context, state) {
          final educationId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateEducationPage(educationId: educationId),
          );
        },
      ),

      // About routes
      GoRoute(
        path: '/about',
        builder: (context, state) => const AuthGuard(
          child: AboutOverviewPage(),
        ),
      ),
      GoRoute(
        path: '/about/edit',
        builder: (context, state) => const AuthGuard(
          child: EditAboutPage(),
        ),
      ),
      GoRoute(
        path: '/about/anime',
        builder: (context, state) => const AuthGuard(
          child: AnimeManagementPage(),
        ),
      ),
      GoRoute(
        path: '/about/music',
        builder: (context, state) => const AuthGuard(
          child: MusicGenresPage(),
        ),
      ),

      // Settings routes
      GoRoute(
        path: '/settings',
        builder: (context, state) => const AuthGuard(
          child: SettingsOverviewPage(),
        ),
      ),
      GoRoute(
        path: '/settings/core-profile',
        builder: (context, state) => const AuthGuard(
          child: CoreProfileSettingsPage(),
        ),
      ),
      GoRoute(
        path: '/settings/social-media',
        builder: (context, state) => const AuthGuard(
          child: SocialMediaSettingsPage(),
        ),
      ),
      GoRoute(
        path: '/settings/contact',
        builder: (context, state) => const AuthGuard(
          child: ContactSettingsPage(),
        ),
      ),
      GoRoute(
        path: '/settings/site',
        builder: (context, state) => const AuthGuard(
          child: SiteSettingsPage(),
        ),
      ),

      // Experience routes
      GoRoute(
        path: '/experience',
        builder: (context, state) => const AuthGuard(
          child: ExperienceListPage(),
        ),
      ),
      GoRoute(
        path: '/experience/create',
        builder: (context, state) => const AuthGuard(
          child: CreateExperiencePage(),
        ),
      ),
      GoRoute(
        path: '/experience/ordering',
        builder: (context, state) => const AuthGuard(
          child: ExperienceOrderingPage(),
        ),
      ),
      GoRoute(
        path: '/experience/:id',
        builder: (context, state) {
          final experienceId = state.pathParameters['id']!;
          return AuthGuard(
            child: ExperienceDetailPage(experienceId: experienceId),
          );
        },
      ),
      GoRoute(
        path: '/experience/:id/edit',
        builder: (context, state) {
          final experienceId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateExperiencePage(experienceId: experienceId),
          );
        },
      ),

      // Blog routes
      GoRoute(
        path: '/blog',
        builder: (context, state) => const AuthGuard(
          child: BlogPostsListPage(),
        ),
      ),
      GoRoute(
        path: '/blog/create',
        builder: (context, state) => const AuthGuard(
          child: CreateBlogPostPage(),
        ),
      ),
      GoRoute(
        path: '/blog/tags',
        builder: (context, state) => const AuthGuard(
          child: BlogTagsPage(),
        ),
      ),
      GoRoute(
        path: '/blog/:id',
        builder: (context, state) {
          final postId = state.pathParameters['id']!;
          return AuthGuard(
            child: BlogPostDetailPage(postId: postId),
          );
        },
      ),
      GoRoute(
        path: '/blog/:id/edit',
        builder: (context, state) {
          final postId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateBlogPostPage(postId: postId),
          );
        },
      ),

      // Testimonials routes
      GoRoute(
        path: '/testimonials',
        builder: (context, state) => const AuthGuard(
          child: TestimonialsListPage(),
        ),
      ),
      GoRoute(
        path: '/testimonials/create',
        builder: (context, state) => const AuthGuard(
          child: CreateTestimonialPage(),
        ),
      ),
      GoRoute(
        path: '/testimonials/:id',
        builder: (context, state) {
          final testimonialId = state.pathParameters['id']!;
          return AuthGuard(
            child: TestimonialDetailPage(testimonialId: testimonialId),
          );
        },
      ),
      GoRoute(
        path: '/testimonials/:id/edit',
        builder: (context, state) {
          final testimonialId = state.pathParameters['id']!;
          return AuthGuard(
            child: CreateTestimonialPage(testimonialId: testimonialId),
          );
        },
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(
        title: const Text('Error'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found: ${state.matchedLocation}',
              style: const TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.push('/'),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );

  static GoRouter get router => _router;
}
