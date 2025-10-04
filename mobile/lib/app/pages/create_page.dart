import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CreatePage extends StatelessWidget {
  const CreatePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.close),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'What would you like to create?',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Choose from the available options below',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 32),

            // Money Domain
            _buildDomainSection(
              context,
              title: 'Money & Ideas',
              subtitle: 'Business ideas and AI conversations',
              color: Colors.green,
              icon: Icons.attach_money,
              items: [
                _CreateOption(
                  title: 'New Idea',
                  subtitle: 'Create a business idea',
                  icon: Icons.lightbulb,
                  onTap: () => context.go('/money/ideas/create'),
                ),
                _CreateOption(
                  title: 'AI Chat',
                  subtitle: 'Start an AI conversation',
                  icon: Icons.chat,
                  onTap: () => context.go('/money/ai-chats/create'),
                ),
                _CreateOption(
                  title: 'Idea Canvas',
                  subtitle: 'Visual idea mapping',
                  icon: Icons.account_tree,
                  onTap: () => context.go('/money/ideas/canvas'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Projects Domain
            _buildDomainSection(
              context,
              title: 'Projects',
              subtitle: 'Portfolio and project management',
              color: Colors.blue,
              icon: Icons.work,
              items: [
                _CreateOption(
                  title: 'New Project',
                  subtitle: 'Add a project to your portfolio',
                  icon: Icons.add_box,
                  onTap: () => context.go('/projects/create'),
                ),
                _CreateOption(
                  title: 'New Framework',
                  subtitle: 'Add a technology/framework',
                  icon: Icons.code,
                  onTap: () => context.go('/frameworks/create'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Blog Domain
            _buildDomainSection(
              context,
              title: 'Blog',
              subtitle: 'Content creation and publishing',
              color: Colors.purple,
              icon: Icons.article,
              items: [
                _CreateOption(
                  title: 'New Blog Post',
                  subtitle: 'Write and publish content',
                  icon: Icons.edit,
                  onTap: () => context.go('/blog/create'),
                ),
                _CreateOption(
                  title: 'Blog Tags',
                  subtitle: 'Manage blog categories',
                  icon: Icons.label,
                  onTap: () => context.go('/blog/tags'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // About & Profile Domain
            _buildDomainSection(
              context,
              title: 'About & Profile',
              subtitle: 'Personal information and background',
              color: Colors.orange,
              icon: Icons.person,
              items: [
                _CreateOption(
                  title: 'Education Entry',
                  subtitle: 'Add education background',
                  icon: Icons.school,
                  onTap: () => context.go('/education/create'),
                ),
                _CreateOption(
                  title: 'Work Experience',
                  subtitle: 'Add professional experience',
                  icon: Icons.business,
                  onTap: () => context.go('/experience/create'),
                ),
                _CreateOption(
                  title: 'Testimonial',
                  subtitle: 'Add a client testimonial',
                  icon: Icons.star,
                  onTap: () => context.go('/testimonials/create'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDomainSection(
    BuildContext context, {
    required String title,
    required String subtitle,
    required Color color,
    required IconData icon,
    required List<_CreateOption> items,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: color,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...items.map((item) => _buildCreateOption(item)),
      ],
    );
  }

  Widget _buildCreateOption(_CreateOption option) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Card(
        elevation: 2,
        child: InkWell(
          onTap: option.onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    option.icon,
                    color: Colors.grey.shade700,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        option.title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        option.subtitle,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: Colors.grey.shade400,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CreateOption {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  _CreateOption({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });
}
