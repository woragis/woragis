import 'package:flutter/material.dart';
import 'home_page.dart';
import 'create_page.dart';

/// Main navigation page with bottom navigation bar
/// This is a simplified version that just shows HomePage
/// Actual navigation is handled by go_router routes
class MainNavigationPage extends StatelessWidget {
  const MainNavigationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const HomePage(),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreatePage(context),
        backgroundColor: Colors.blue.shade600,
        child: const Icon(Icons.add, color: Colors.white),
        tooltip: 'Create',
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  void _showCreatePage(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.9,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: const CreatePage(),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final String label;
  final String route;

  NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
  });
}
