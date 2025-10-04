import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/framework_entity.dart';

class FrameworkDetailPage extends StatelessWidget {
  final String frameworkId;

  const FrameworkDetailPage({
    super.key,
    required this.frameworkId,
  });

  @override
  Widget build(BuildContext context) {
    // TODO: Replace with actual framework data from BLoC or API
    // For now, using placeholder data
    final framework = FrameworkEntity(
      id: frameworkId,
      userId: 'user123',
      name: 'Flutter',
      slug: 'flutter',
      description: 'A UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.',
      icon: 'flutter',
      color: '#02569B',
      type: FrameworkType.framework,
      proficiencyLevel: ProficiencyLevel.advanced,
      visible: true,
      public: true,
      order: 1,
      createdAt: DateTime.now().subtract(const Duration(days: 365)),
      updatedAt: DateTime.now(),
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(framework.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              context.go('/frameworks/${framework.id}/edit');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Icon and Name
                    Row(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: framework.color != null
                                ? Color(int.parse(framework.color!.replaceFirst('#', '0xFF')))
                                : Colors.blue.shade100,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: framework.icon != null
                              ? Icon(
                                  Icons.code,
                                  color: Colors.white,
                                  size: 40,
                                )
                              : Icon(
                                  Icons.code,
                                  color: Colors.blue.shade700,
                                  size: 40,
                                ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                framework.name,
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: _getTypeColor(framework.type).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Text(
                                      framework.type.name.toUpperCase(),
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: _getTypeColor(framework.type),
                                      ),
                                    ),
                                  ),
                                  if (framework.proficiencyLevel != null) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: _getProficiencyColor(framework.proficiencyLevel!).withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Text(
                                        framework.proficiencyLevel!.name.toUpperCase(),
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: _getProficiencyColor(framework.proficiencyLevel!),
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Description
                    if (framework.description != null)
                      Text(
                        framework.description!,
                        style: const TextStyle(
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Details Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow('Slug', framework.slug),
                    _buildDetailRow('Type', framework.type.name.toUpperCase()),
                    if (framework.proficiencyLevel != null)
                      _buildDetailRow('Proficiency', framework.proficiencyLevel!.name.toUpperCase()),
                    _buildDetailRow('Order', framework.order.toString()),
                    _buildDetailRow('Created', _formatDate(framework.createdAt)),
                    _buildDetailRow('Updated', _formatDate(framework.updatedAt)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Visibility Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Visibility',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Icon(
                          framework.visible ? Icons.visibility : Icons.visibility_off,
                          color: framework.visible ? Colors.green : Colors.grey,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          framework.visible ? 'Visible' : 'Hidden',
                          style: TextStyle(
                            color: framework.visible ? Colors.green : Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          framework.public ? Icons.public : Icons.lock,
                          color: framework.public ? Colors.blue : Colors.grey,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          framework.public ? 'Public' : 'Private',
                          style: TextStyle(
                            color: framework.public ? Colors.blue : Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Actions
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Actions',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              context.go('/frameworks/${framework.id}/edit');
                            },
                            icon: const Icon(Icons.edit),
                            label: const Text('Edit'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // TODO: Implement delete functionality
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Delete functionality coming soon!')),
                              );
                            },
                            icon: const Icon(Icons.delete),
                            label: const Text('Delete'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  Color _getTypeColor(FrameworkType type) {
    switch (type) {
      case FrameworkType.language:
        return Colors.blue;
      case FrameworkType.framework:
        return Colors.green;
      case FrameworkType.library:
        return Colors.orange;
      case FrameworkType.tool:
        return Colors.purple;
      case FrameworkType.database:
        return Colors.red;
      case FrameworkType.other:
        return Colors.grey;
    }
  }

  Color _getProficiencyColor(ProficiencyLevel level) {
    switch (level) {
      case ProficiencyLevel.beginner:
        return Colors.green;
      case ProficiencyLevel.intermediate:
        return Colors.orange;
      case ProficiencyLevel.advanced:
        return Colors.red;
      case ProficiencyLevel.expert:
        return Colors.purple;
    }
  }
}
