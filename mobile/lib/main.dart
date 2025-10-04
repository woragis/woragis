import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:io';
import 'app/router/app_router.dart';
import 'app/config/app_config.dart';
import 'core/config/env_config.dart';
import 'core/injection/injection_container.dart' as di;
import 'core/services/keyboard_service.dart';

// Import sqflite_common_ffi for desktop platforms
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize database factory for desktop platforms
  if (Platform.isLinux || Platform.isWindows || Platform.isMacOS) {
    // Initialize FFI for desktop platforms
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }
  
  // Initialize environment configuration
  await EnvConfig.init();
  
  // Add a small delay to ensure dotenv is fully initialized
  await Future.delayed(const Duration(milliseconds: 100));
  
  // Print config in debug mode
  EnvConfig.printConfig();
  
  // Initialize keyboard service to fix keyboard event handling issues
  await KeyboardService.initialize();
  
  // Initialize dependency injection
  await di.init();
  
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: AppConfig.providers,
      child: MaterialApp.router(
        title: 'Woragis',
        theme: AppConfig.lightTheme,
        darkTheme: AppConfig.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: AppRouter.router,
        debugShowCheckedModeBanner: false,
        builder: (context, child) {
          return KeyboardDismissOnTap(
            child: child!,
          );
        },
      ),
    );
  }
}

// Widget to dismiss keyboard when tapping outside input fields
class KeyboardDismissOnTap extends StatelessWidget {
  final Widget child;

  const KeyboardDismissOnTap({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Dismiss keyboard when tapping outside input fields
        FocusScope.of(context).unfocus();
      },
      child: child,
    );
  }
}
