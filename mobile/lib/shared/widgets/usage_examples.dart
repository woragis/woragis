import 'package:flutter/material.dart';
import 'woragis_button.dart';
import 'woragis_card.dart';
import 'woragis_input.dart';

/// Example usage of Woragis widgets without explicit styling
/// All styling is handled by the theme configuration
class WoragisUsageExamples extends StatelessWidget {
  const WoragisUsageExamples({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Woragis Examples'),
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Example 1: Basic buttons without styling
            _BasicButtonsExample(),
            
            SizedBox(height: 32),
            
            // Example 2: Cards without styling
            _BasicCardsExample(),
            
            SizedBox(height: 32),
            
            // Example 3: Inputs without styling
            _BasicInputsExample(),
          ],
        ),
      ),
    );
  }
}

class _BasicButtonsExample extends StatelessWidget {
  const _BasicButtonsExample();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Buttons (No Styling Needed)',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 16),
        
        // These buttons will automatically use the theme styles
        Row(
          children: [
            Expanded(
              child: WoragisButton(
                text: 'Primary Button',
                variant: WoragisButtonVariant.primary,
                onPressed: () {},
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: WoragisButton(
                text: 'Modern Button',
                variant: WoragisButtonVariant.modern,
                onPressed: () {},
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        // Even more variants
        Row(
          children: [
            Expanded(
              child: WoragisButton(
                text: 'Outline',
                variant: WoragisButtonVariant.outline,
                onPressed: () {},
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: WoragisButton(
                text: 'Glass',
                variant: WoragisButtonVariant.glass,
                onPressed: () {},
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _BasicCardsExample extends StatelessWidget {
  const _BasicCardsExample();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Cards (No Styling Needed)',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 16),
        
        // Feature card with automatic styling
        WoragisFeatureCard(
          title: 'Modern Design',
          subtitle: 'Clean and contemporary UI',
          icon: const Icon(Icons.design_services),
          variant: WoragisCardVariant.modern,
          onTap: () {},
        ),
        const SizedBox(height: 16),
        
        // Stats card with automatic styling
        Row(
          children: [
            Expanded(
              child: WoragisStatsCard(
                label: 'Projects',
                value: '24',
                icon: const Icon(Icons.work_outline),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: WoragisStatsCard(
                label: 'Clients',
                value: '18',
                icon: const Icon(Icons.people_outline),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _BasicInputsExample extends StatefulWidget {
  const _BasicInputsExample();

  @override
  State<_BasicInputsExample> createState() => _BasicInputsExampleState();
}

class _BasicInputsExampleState extends State<_BasicInputsExample> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Inputs (No Styling Needed)',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 16),
        
        // Basic input with automatic styling
        WoragisInput(
          label: 'Email Address',
          hintText: 'Enter your email',
          controller: _emailController,
          variant: WoragisInputVariant.modern,
          prefixIcon: const Icon(Icons.email_outlined),
        ),
        const SizedBox(height: 16),
        
        // Password input with automatic styling
        WoragisPasswordInput(
          label: 'Password',
          hintText: 'Enter your password',
          controller: _passwordController,
          variant: WoragisInputVariant.modern,
        ),
        const SizedBox(height: 16),
        
        // Search input with automatic styling
        WoragisSearchInput(
          hintText: 'Search...',
          onChanged: (value) {
            // Search logic
          },
        ),
      ],
    );
  }
}

/// Example of using standard Flutter widgets with theme styling
class StandardWidgetsWithTheme extends StatelessWidget {
  const StandardWidgetsWithTheme({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Standard Widgets'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Standard ElevatedButton - uses theme styling
            const SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: null,
                child: Text('Themed Button'),
              ),
            ),
            const SizedBox(height: 16),
            
            // Standard Card - uses theme styling
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Themed Card',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'This card uses the theme styling automatically',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Standard TextField - uses theme styling
            const TextField(
              decoration: InputDecoration(
                labelText: 'Themed Input',
                hintText: 'Enter text here',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
