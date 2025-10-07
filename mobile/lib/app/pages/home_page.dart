import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Woragis'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => context.push('/profile'),
            icon: const Icon(Icons.person),
          ),
        ],
      ),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is AuthAuthenticated) {
            return _buildAuthenticatedContent(context, state.user);
          } else if (state is AuthLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          } else {
            // This shouldn't happen due to AuthGuard, but just in case
            return const Center(
              child: Text('Authentication required'),
            );
          }
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.article),
            label: 'Blog',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.work),
            label: 'Projects',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'About',
          ),
        ],
        onTap: (index) {
          switch (index) {
            case 0:
              context.push('/home');
              break;
            case 1:
              context.push('/money/ideas');
              break;
            case 2:
              context.push('/projects');
              break;
            case 3:
              context.push('/profile');
              break;
          }
        },
      ),
    );
  }

  Widget _buildAuthenticatedContent(BuildContext context, user) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome Section
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 30,
                        backgroundColor: Colors.blue.shade600,
                        backgroundImage: user.avatar != null
                            ? NetworkImage(user.avatar!)
                            : null,
                        child: user.avatar == null
                            ? const Icon(
                                Icons.person,
                                size: 30,
                                color: Colors.white,
                              )
                            : null,
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome back!',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey.shade600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              user.firstName != null && user.lastName != null
                                  ? '${user.firstName} ${user.lastName}'
                                  : user.username,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Manage your portfolio, blog posts, and projects all in one place.',
                    style: TextStyle(fontSize: 16),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Quick Actions
          const Text(
            'Quick Actions',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.5,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            children: [
              _buildQuickActionCard(
                context,
                icon: Icons.lightbulb,
                title: 'Money Ideas',
                subtitle: 'Business ideas & AI chats',
                color: Colors.green,
                onTap: () {
                  context.push('/money/ideas');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.auto_awesome,
                title: 'Flutter Query Demo',
                subtitle: 'Automatic caching & sync',
                color: Colors.orange,
                onTap: () {
                  context.push('/money/query');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.work,
                title: 'Projects',
                subtitle: 'Showcase your work',
                color: Colors.blue,
                onTap: () {
                  context.push('/projects');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.code,
                title: 'Frameworks',
                subtitle: 'Manage technologies',
                color: Colors.purple,
                onTap: () {
                  context.push('/frameworks');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.school,
                title: 'Education',
                subtitle: 'Manage certifications',
                color: Colors.orange,
                onTap: () {
                  context.push('/education');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.person,
                title: 'About Me',
                subtitle: 'Personal information',
                color: Colors.teal,
                onTap: () {
                  context.push('/about');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.article,
                title: 'Blog',
                subtitle: 'Write and publish',
                color: Colors.purple,
                onTap: () {
                  context.push('/blog');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.business,
                title: 'Experience',
                subtitle: 'Professional history',
                color: Colors.indigo,
                onTap: () {
                  context.push('/experience');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.star,
                title: 'Testimonials',
                subtitle: 'Client feedback',
                color: Colors.amber,
                onTap: () {
                  context.push('/testimonials');
                },
              ),
              _buildQuickActionCard(
                context,
                icon: Icons.settings,
                title: 'Settings',
                subtitle: 'App preferences',
                color: Colors.grey,
                onTap: () {
                  context.push('/settings');
                },
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Recent Activity (Placeholder)
          const Text(
            'Recent Activity',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.article, color: Colors.blue),
                    title: const Text('Welcome to Woragis!'),
                    subtitle: const Text('Your portfolio management dashboard'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  ),
                  const Divider(),
                  ListTile(
                    leading: const Icon(Icons.check_circle, color: Colors.green),
                    title: const Text('Account Setup Complete'),
                    subtitle: const Text('Your profile is ready to go'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: color,
                size: 32,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
