import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MoneyHomePageQuery extends StatelessWidget {
  const MoneyHomePageQuery({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Money Ideas - Flutter Query'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Card(
              color: Colors.green.shade50,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.auto_awesome,
                          color: Colors.green.shade600,
                          size: 32,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Flutter Query Implementation',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green.shade800,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Automatic caching, background sync, and offline support',
                                style: TextStyle(
                                  color: Colors.green.shade700,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Action Buttons - MOVED TO TOP
            Text(
              'Try It Out',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade800,
              ),
            ),
            const SizedBox(height: 12),
            
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => context.push('/money/ideas/query'),
                    icon: const Icon(Icons.list),
                    label: const Text('View Ideas List'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade600,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => context.push('/money/ideas/create'),
                    icon: const Icon(Icons.add),
                    label: const Text('Create Idea'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.green.shade600,
                      side: BorderSide(color: Colors.green.shade600),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Features
            Text(
              'Key Features',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade800,
              ),
            ),
            const SizedBox(height: 12),
            
            _buildFeatureCard(
              context,
              icon: Icons.cached,
              title: 'Automatic Caching',
              description: 'Data persists across navigation - no more disappearing content!',
              color: Colors.blue,
            ),
            
            _buildFeatureCard(
              context,
              icon: Icons.sync,
              title: 'Background Sync',
              description: 'Data updates automatically in the background',
              color: Colors.orange,
            ),
            
            _buildFeatureCard(
              context,
              icon: Icons.wifi_off,
              title: 'Offline Support',
              description: 'Works with cached data when offline',
              color: Colors.purple,
            ),
            
            _buildFeatureCard(
              context,
              icon: Icons.speed,
              title: 'Instant Navigation',
              description: 'Navigate back and forth without loading screens',
              color: Colors.teal,
            ),

            const SizedBox(height: 24),

            // Quick Test Instructions
            Card(
              color: Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.help_outline,
                          color: Colors.blue.shade700,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Quick Test',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue.shade800,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildInstructionStep(
                      '1',
                      'Tap "View Ideas List" above',
                    ),
                    _buildInstructionStep(
                      '2',
                      'Tap on any idea to view details',
                    ),
                    _buildInstructionStep(
                      '3',
                      'Use back button - data loads instantly!',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Comparison
            Card(
              color: Colors.amber.shade50,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.compare_arrows,
                          color: Colors.amber.shade700,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'BLoC vs Flutter Query',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.amber.shade800,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildComparisonRow(
                      'Data Caching',
                      '❌ Manual',
                      '✅ Automatic',
                    ),
                    _buildComparisonRow(
                      'Navigation',
                      '❌ Data disappears',
                      '✅ Data persists',
                    ),
                    _buildComparisonRow(
                      'Background Sync',
                      '❌ Manual',
                      '✅ Automatic',
                    ),
                    _buildComparisonRow(
                      'Code Complexity',
                      '❌ High',
                      '✅ Low',
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

  Widget _buildFeatureCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComparisonRow(String feature, String blocResult, String queryResult) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              feature,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(
              blocResult,
              style: TextStyle(
                color: Colors.red.shade600,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          Expanded(
            child: Text(
              queryResult,
              style: TextStyle(
                color: Colors.green.shade600,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInstructionStep(String number, String instruction) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Colors.blue.shade600,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              instruction,
              style: TextStyle(
                color: Colors.grey.shade700,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
