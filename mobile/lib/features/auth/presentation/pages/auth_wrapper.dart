import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/auth_bloc.dart';

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    // Check if user is already authenticated when the app starts
    context.read<AuthBloc>().add(GetCurrentUserRequested());
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthAuthenticated) {
          // User is authenticated, navigate to home
          context.go('/home');
        } else if (state is AuthUnauthenticated) {
          // User is not authenticated, navigate to login
          context.go('/login');
        }
      },
      child: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is AuthLoading) {
            return const SplashScreen();
          }
          
          // Default to showing splash while determining auth state
          return const SplashScreen();
        },
      ),
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade600,
              Colors.blue.shade800,
            ],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // App Logo/Icon
              Icon(
                Icons.person,
                size: 120,
                color: Colors.white,
              ),
              SizedBox(height: 24),
              
              // App Name
              Text(
                'Woragis',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 8),
              
              // Tagline
              Text(
                'Portfolio & Blog',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
                ),
              ),
              SizedBox(height: 48),
              
              // Loading indicator
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                strokeWidth: 3,
              ),
              SizedBox(height: 16),
              
              // Loading text
              Text(
                'Loading...',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Auth Guard widget for protecting routes
class AuthGuard extends StatelessWidget {
  final Widget child;
  final bool requireAuth;

  const AuthGuard({
    super.key,
    required this.child,
    this.requireAuth = true,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        if (requireAuth) {
          if (state is AuthAuthenticated) {
            return child;
          } else if (state is AuthUnauthenticated) {
            // Redirect to login if not authenticated
            WidgetsBinding.instance.addPostFrameCallback((_) {
              context.go('/login');
            });
            return const SplashScreen();
          } else {
            // Show loading while checking auth state
            return const SplashScreen();
          }
        } else {
          // Route doesn't require auth, show child
          return child;
        }
      },
    );
  }
}
