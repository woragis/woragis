import 'package:flutter/material.dart';
import '../core/database/database_helper.dart';

/// Utility class to reset the local SQLite database
class DatabaseReset {
  static final DatabaseHelper _dbHelper = DatabaseHelper();

  /// Completely resets the database by deleting the file and recreating it
  static Future<void> resetDatabase() async {
    try {
      print('🔄 Starting database reset...');
      
      // Reset the database
      await _dbHelper.resetDatabase();
      
      print('✅ Database reset completed successfully!');
      print('📊 Database has been recreated with fresh schema');
      
    } catch (e) {
      print('❌ Error resetting database: $e');
      rethrow;
    }
  }

  /// Clears all data from the database but keeps the schema
  static Future<void> clearAllData() async {
    try {
      print('🔄 Clearing all data from database...');
      
      // Clear all data
      await _dbHelper.clearAllData();
      
      print('✅ All data cleared successfully!');
      print('📊 Database schema preserved');
      
    } catch (e) {
      print('❌ Error clearing data: $e');
      rethrow;
    }
  }

  /// Shows a confirmation dialog and resets the database
  static Future<void> showResetDialog(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reset Database'),
        content: const Text(
          'This will completely reset the local database and delete all cached data. '
          'This action cannot be undone.\n\n'
          'Are you sure you want to continue?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(
              foregroundColor: Colors.red,
            ),
            child: const Text('Reset'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        // Show loading indicator
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => const AlertDialog(
            content: Row(
              children: [
                CircularProgressIndicator(),
                SizedBox(width: 16),
                Text('Resetting database...'),
              ],
            ),
          ),
        );

        // Reset the database
        await resetDatabase();

        // Close loading dialog
        if (context.mounted) {
          Navigator.of(context).pop();
        }

        // Show success message
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Database reset successfully!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        // Close loading dialog
        if (context.mounted) {
          Navigator.of(context).pop();
        }

        // Show error message
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error resetting database: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }
}
