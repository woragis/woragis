import 'package:flutter/material.dart';

/// Woragis Design System - Centralized Style Constants
/// Based on the Next.js design system with purple/indigo theme
class WoragisStyles {
  // Private constructor to prevent instantiation
  WoragisStyles._();

  // ===== COLOR PALETTE =====
  static const Color primaryPurple = Color(0xFF6366F1); // Indigo-500
  static const Color primaryPurpleDark = Color(0xFF4F46E5); // Indigo-600
  static const Color primaryPurpleLight = Color(0xFF818CF8); // Indigo-400
  
  static const Color accentPurple = Color(0xFF8B5CF6); // Violet-500
  static const Color accentPink = Color(0xFFEC4899); // Pink-500
  static const Color accentCyan = Color(0xFF06B6D4); // Cyan-500
  
  // Light theme colors
  static const Color lightBackground = Color(0xFFFFFFFF);
  static const Color lightSurface = Color(0xFFF8FAFC);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightText = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF475569);
  static const Color lightTextMuted = Color(0xFF64748B);
  
  // Dark theme colors
  static const Color darkBackground = Color(0xFF0F0F23);
  static const Color darkSurface = Color(0xFF1A1A2E);
  static const Color darkCard = Color(0xFF1A1A2E);
  static const Color darkBorder = Color(0xFF334155);
  static const Color darkText = Color(0xFFFFFFFF);
  static const Color darkTextSecondary = Color(0xFFCBD5E1);
  static const Color darkTextMuted = Color(0xFF94A3B8);

  // ===== SPACING =====
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacing2Xl = 48.0;
  static const double spacing3Xl = 64.0;

  // ===== BORDER RADIUS =====
  static const double radiusXs = 4.0;
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 20.0;
  static const double radius2Xl = 24.0;
  static const double radiusFull = 999.0;

  // ===== FONT SIZES =====
  static const double fontSizeXs = 10.0;
  static const double fontSizeSm = 12.0;
  static const double fontSizeMd = 14.0;
  static const double fontSizeLg = 16.0;
  static const double fontSizeXl = 18.0;
  static const double fontSize2Xl = 20.0;
  static const double fontSize3Xl = 24.0;
  static const double fontSize4Xl = 28.0;
  static const double fontSize5Xl = 32.0;

  // ===== FONT WEIGHTS =====
  static const FontWeight fontWeightNormal = FontWeight.w400;
  static const FontWeight fontWeightMedium = FontWeight.w500;
  static const FontWeight fontWeightSemibold = FontWeight.w600;
  static const FontWeight fontWeightBold = FontWeight.w700;

  // ===== SHADOWS =====
  static List<BoxShadow> get shadowSm => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.05),
      blurRadius: 4,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> get shadowMd => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get shadowLg => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> get shadowXl => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.15),
      blurRadius: 40,
      offset: const Offset(0, 16),
    ),
  ];

  static List<BoxShadow> shadowPurple({double opacity = 0.3}) => [
    BoxShadow(
      color: primaryPurple.withValues(alpha: opacity),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> shadowPink({double opacity = 0.3}) => [
    BoxShadow(
      color: accentPink.withValues(alpha: opacity),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];

  // ===== GRADIENTS =====
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryPurple, accentPurple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient modernGradient = LinearGradient(
    colors: [primaryPurple, accentPurple, accentPink],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [
      Color(0x1AFFFFFF),
      Color(0x0DFFFFFF),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ===== ANIMATION DURATIONS =====
  static const Duration animationFast = Duration(milliseconds: 150);
  static const Duration animationNormal = Duration(milliseconds: 300);
  static const Duration animationSlow = Duration(milliseconds: 500);

  // ===== ANIMATION CURVES =====
  static const Curve animationCurve = Curves.easeInOutCubic;
  static const Curve bounceCurve = Curves.elasticOut;
  static const Curve smoothCurve = Curves.easeOutCubic;
}

/// Woragis Text Styles
class WoragisTextStyles {
  // Private constructor to prevent instantiation
  WoragisTextStyles._();

  // Display styles
  static TextStyle displayLarge(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSize5Xl,
    fontWeight: WoragisStyles.fontWeightBold,
    color: color,
    height: 1.2,
  );

  static TextStyle displayMedium(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSize4Xl,
    fontWeight: WoragisStyles.fontWeightBold,
    color: color,
    height: 1.2,
  );

  static TextStyle displaySmall(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSize3Xl,
    fontWeight: WoragisStyles.fontWeightBold,
    color: color,
    height: 1.3,
  );

  // Headline styles
  static TextStyle headlineLarge(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSize2Xl,
    fontWeight: WoragisStyles.fontWeightSemibold,
    color: color,
    height: 1.3,
  );

  static TextStyle headlineMedium(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeXl,
    fontWeight: WoragisStyles.fontWeightSemibold,
    color: color,
    height: 1.3,
  );

  static TextStyle headlineSmall(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeLg,
    fontWeight: WoragisStyles.fontWeightSemibold,
    color: color,
    height: 1.4,
  );

  // Title styles
  static TextStyle titleLarge(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeLg,
    fontWeight: WoragisStyles.fontWeightSemibold,
    color: color,
    height: 1.4,
  );

  static TextStyle titleMedium(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeMd,
    fontWeight: WoragisStyles.fontWeightMedium,
    color: color,
    height: 1.4,
  );

  static TextStyle titleSmall(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeSm,
    fontWeight: WoragisStyles.fontWeightMedium,
    color: color,
    height: 1.4,
  );

  // Body styles
  static TextStyle bodyLarge(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeLg,
    fontWeight: WoragisStyles.fontWeightNormal,
    color: color,
    height: 1.6,
  );

  static TextStyle bodyMedium(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeMd,
    fontWeight: WoragisStyles.fontWeightNormal,
    color: color,
    height: 1.6,
  );

  static TextStyle bodySmall(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeSm,
    fontWeight: WoragisStyles.fontWeightNormal,
    color: color,
    height: 1.6,
  );

  // Label styles
  static TextStyle labelLarge(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeMd,
    fontWeight: WoragisStyles.fontWeightMedium,
    color: color,
    height: 1.4,
  );

  static TextStyle labelMedium(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeSm,
    fontWeight: WoragisStyles.fontWeightMedium,
    color: color,
    height: 1.4,
  );

  static TextStyle labelSmall(Color color) => TextStyle(
    fontSize: WoragisStyles.fontSizeXs,
    fontWeight: WoragisStyles.fontWeightMedium,
    color: color,
    height: 1.4,
  );

  // Special styles
  static TextStyle gradientText({
    required List<Color> colors,
    double fontSize = WoragisStyles.fontSizeLg,
    FontWeight fontWeight = WoragisStyles.fontWeightSemibold,
  }) {
    return TextStyle(
      fontSize: fontSize,
      fontWeight: fontWeight,
      foreground: Paint()
        ..shader = LinearGradient(
          colors: colors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ).createShader(const Rect.fromLTWH(0.0, 0.0, 200.0, 70.0)),
      height: 1.4,
    );
  }
}

/// Woragis Button Styles
class WoragisButtonStyles {
  // Private constructor to prevent instantiation
  WoragisButtonStyles._();

  static ButtonStyle primary(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return ElevatedButton.styleFrom(
      backgroundColor: colorScheme.primary,
      foregroundColor: colorScheme.onPrimary,
      elevation: 0,
      shadowColor: colorScheme.primary.withValues(alpha: 0.3),
      padding: const EdgeInsets.symmetric(
        horizontal: WoragisStyles.spacingLg,
        vertical: WoragisStyles.spacingSm,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      ),
      textStyle: WoragisTextStyles.labelLarge(colorScheme.onPrimary),
    );
  }

  static ButtonStyle secondary(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return ElevatedButton.styleFrom(
      backgroundColor: colorScheme.secondary,
      foregroundColor: colorScheme.onSecondary,
      elevation: 0,
      shadowColor: colorScheme.secondary.withValues(alpha: 0.3),
      padding: const EdgeInsets.symmetric(
        horizontal: WoragisStyles.spacingLg,
        vertical: WoragisStyles.spacingSm,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      ),
      textStyle: WoragisTextStyles.labelLarge(colorScheme.onSecondary),
    );
  }

  static ButtonStyle outline(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return OutlinedButton.styleFrom(
      foregroundColor: colorScheme.primary,
      side: BorderSide(color: colorScheme.primary, width: 2),
      padding: const EdgeInsets.symmetric(
        horizontal: WoragisStyles.spacingLg,
        vertical: WoragisStyles.spacingSm,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      ),
      textStyle: WoragisTextStyles.labelLarge(colorScheme.primary),
    );
  }

  static ButtonStyle ghost(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return TextButton.styleFrom(
      foregroundColor: colorScheme.onSurface,
      backgroundColor: Colors.transparent,
      padding: const EdgeInsets.symmetric(
        horizontal: WoragisStyles.spacingMd,
        vertical: WoragisStyles.spacingXs,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusSm),
      ),
      textStyle: WoragisTextStyles.labelMedium(colorScheme.onSurface),
    );
  }
}

/// Woragis Card Styles
class WoragisCardStyles {
  // Private constructor to prevent instantiation
  WoragisCardStyles._();

  static BoxDecoration modern(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return BoxDecoration(
      color: colorScheme.surface,
      borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      border: Border.all(
        color: colorScheme.outline,
        width: 1,
      ),
      boxShadow: WoragisStyles.shadowMd,
    );
  }

  static BoxDecoration glass(BuildContext context) {
    return BoxDecoration(
      color: Colors.white.withValues(alpha: 0.1),
      borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      border: Border.all(
        color: Colors.white.withValues(alpha: 0.2),
        width: 1,
      ),
      boxShadow: WoragisStyles.shadowLg,
    );
  }

  static BoxDecoration gradient(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return BoxDecoration(
      gradient: LinearGradient(
        colors: [
          colorScheme.primary.withValues(alpha: 0.1),
          colorScheme.secondary.withValues(alpha: 0.1),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      border: Border.all(
        color: colorScheme.outline.withValues(alpha: 0.3),
        width: 1,
      ),
      boxShadow: WoragisStyles.shadowPurple(opacity: 0.1),
    );
  }

  static BoxDecoration elevated(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return BoxDecoration(
      color: colorScheme.surface,
      borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
      border: Border.all(
        color: colorScheme.outline,
        width: 1,
      ),
      boxShadow: [
        ...WoragisStyles.shadowLg,
        BoxShadow(
          color: colorScheme.primary.withValues(alpha: 0.05),
          blurRadius: 40,
          offset: const Offset(0, 16),
        ),
      ],
    );
  }
}

/// Woragis Input Styles
class WoragisInputStyles {
  // Private constructor to prevent instantiation
  WoragisInputStyles._();

  static InputDecorationTheme modern(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return InputDecorationTheme(
      filled: true,
      fillColor: colorScheme.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
        borderSide: BorderSide(
          color: colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
        borderSide: BorderSide(
          color: colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
        borderSide: BorderSide(
          color: colorScheme.primary,
          width: 2,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(WoragisStyles.radiusMd),
        borderSide: BorderSide(
          color: colorScheme.error,
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: WoragisStyles.spacingMd,
        vertical: WoragisStyles.spacingSm,
      ),
      hintStyle: WoragisTextStyles.bodyMedium(
        colorScheme.onSurface.withValues(alpha: 0.6),
      ),
      labelStyle: WoragisTextStyles.labelMedium(colorScheme.onSurface),
    );
  }
}

/// Woragis Animation Utilities
class WoragisAnimations {
  // Private constructor to prevent instantiation
  WoragisAnimations._();

  static Widget fadeIn({
    required Widget child,
    Duration duration = WoragisStyles.animationNormal,
    Curve curve = WoragisStyles.animationCurve,
    double begin = 0.0,
    double end = 1.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Opacity(
          opacity: value,
          child: child,
        );
      },
      child: child,
    );
  }

  static Widget slideInUp({
    required Widget child,
    Duration duration = WoragisStyles.animationNormal,
    Curve curve = WoragisStyles.animationCurve,
    double offset = 30.0,
  }) {
    return TweenAnimationBuilder<Offset>(
      duration: duration,
      curve: curve,
      tween: Tween(
        begin: Offset(0, offset),
        end: Offset.zero,
      ),
      builder: (context, value, child) {
        return Transform.translate(
          offset: value,
          child: child,
        );
      },
      child: child,
    );
  }

  static Widget scaleIn({
    required Widget child,
    Duration duration = WoragisStyles.animationNormal,
    Curve curve = WoragisStyles.bounceCurve,
    double begin = 0.8,
    double end = 1.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: child,
        );
      },
      child: child,
    );
  }

  static Widget rotateIn({
    required Widget child,
    Duration duration = WoragisStyles.animationSlow,
    Curve curve = WoragisStyles.animationCurve,
    double begin = -0.1,
    double end = 0.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform.rotate(
          angle: value * 2 * 3.14159,
          child: child,
        );
      },
      child: child,
    );
  }
}
