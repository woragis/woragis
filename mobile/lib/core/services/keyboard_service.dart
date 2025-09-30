import 'package:flutter/services.dart';

/// Service to handle keyboard-related issues and provide consistent keyboard behavior
class KeyboardService {
  static final KeyboardService _instance = KeyboardService._internal();
  factory KeyboardService() => _instance;
  KeyboardService._internal();

  /// Initialize keyboard service with proper state management
  static Future<void> initialize() async {
    try {
      // Reset text input state to prevent keyboard event conflicts
      await SystemChannels.textInput.invokeMethod('TextInput.hide');
      
      // Small delay to ensure proper initialization
      await Future.delayed(const Duration(milliseconds: 100));
    } catch (e) {
      // Ignore errors during initialization
      print('KeyboardService initialization warning: $e');
    }
  }

  /// Show keyboard for text input
  static Future<void> showKeyboard() async {
    try {
      await SystemChannels.textInput.invokeMethod('TextInput.show');
    } catch (e) {
      print('KeyboardService show warning: $e');
    }
  }

  /// Hide keyboard
  static Future<void> hideKeyboard() async {
    try {
      await SystemChannels.textInput.invokeMethod('TextInput.hide');
    } catch (e) {
      print('KeyboardService hide warning: $e');
    }
  }

  /// Reset keyboard state to prevent event conflicts
  static Future<void> resetKeyboardState() async {
    try {
      await SystemChannels.textInput.invokeMethod('TextInput.hide');
      await Future.delayed(const Duration(milliseconds: 50));
      await SystemChannels.textInput.invokeMethod('TextInput.show');
    } catch (e) {
      print('KeyboardService reset warning: $e');
    }
  }
}
