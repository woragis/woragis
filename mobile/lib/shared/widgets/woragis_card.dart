import 'dart:ui';
import 'package:flutter/material.dart';

enum WoragisCardVariant {
  default_,
  modern,
  glass,
  gradient,
  elevated,
}

class WoragisCard extends StatelessWidget {
  final Widget child;
  final WoragisCardVariant variant;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? elevation;
  final VoidCallback? onTap;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final List<Color>? gradientColors;
  final bool showHoverEffect;

  const WoragisCard({
    super.key,
    required this.child,
    this.variant = WoragisCardVariant.default_,
    this.padding,
    this.margin,
    this.elevation,
    this.onTap,
    this.borderRadius,
    this.backgroundColor,
    this.gradientColors,
    this.showHoverEffect = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    Widget card = _buildCard(context, colorScheme);
    
    if (onTap != null) {
      card = InkWell(
        onTap: onTap,
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        child: card,
      );
    }
    
    if (margin != null) {
      card = Container(
        margin: margin,
        child: card,
      );
    }
    
    return card;
  }

  Widget _buildCard(BuildContext context, ColorScheme colorScheme) {
    final defaultPadding = padding ?? const EdgeInsets.all(16);
    final defaultBorderRadius = borderRadius ?? BorderRadius.circular(12);
    
    switch (variant) {
      case WoragisCardVariant.default_:
        return Card(
          elevation: elevation ?? 2,
          shadowColor: Colors.black.withValues(alpha: 0.1),
          shape: RoundedRectangleBorder(
            borderRadius: defaultBorderRadius,
            side: BorderSide(
              color: colorScheme.outline,
              width: 1,
            ),
          ),
          color: backgroundColor ?? colorScheme.surface,
          child: Padding(
            padding: defaultPadding,
            child: child,
          ),
        );

      case WoragisCardVariant.modern:
        return Container(
          decoration: BoxDecoration(
            color: backgroundColor ?? colorScheme.surface,
            borderRadius: defaultBorderRadius,
            border: Border.all(
              color: colorScheme.outline,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: defaultPadding,
            child: child,
          ),
        );

      case WoragisCardVariant.glass:
        return Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: defaultBorderRadius,
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.2),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: defaultBorderRadius,
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Padding(
                padding: defaultPadding,
                child: child,
              ),
            ),
          ),
        );

      case WoragisCardVariant.gradient:
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: gradientColors ?? [
                colorScheme.primary.withValues(alpha: 0.1),
                colorScheme.secondary.withValues(alpha: 0.1),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: defaultBorderRadius,
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 0.3),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: colorScheme.primary.withValues(alpha: 0.1),
                blurRadius: 15,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Padding(
            padding: defaultPadding,
            child: child,
          ),
        );

      case WoragisCardVariant.elevated:
        return Container(
          decoration: BoxDecoration(
            color: backgroundColor ?? colorScheme.surface,
            borderRadius: defaultBorderRadius,
            border: Border.all(
              color: colorScheme.outline,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 20,
                offset: const Offset(0, 8),
                spreadRadius: 0,
              ),
              BoxShadow(
                color: colorScheme.primary.withValues(alpha: 0.05),
                blurRadius: 40,
                offset: const Offset(0, 16),
                spreadRadius: 0,
              ),
            ],
          ),
          child: Padding(
            padding: defaultPadding,
            child: child,
          ),
        );
    }
  }
}

// Specialized card variants
class WoragisFeatureCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? icon;
  final VoidCallback? onTap;
  final WoragisCardVariant variant;

  const WoragisFeatureCard({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
    this.onTap,
    this.variant = WoragisCardVariant.modern,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return WoragisCard(
      variant: variant,
      onTap: onTap,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: colorScheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: icon!,
            ),
            const SizedBox(height: 16),
          ],
          Text(
            title,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 8),
            Text(
              subtitle!,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurface.withValues(alpha: 0.7),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class WoragisStatsCard extends StatelessWidget {
  final String label;
  final String value;
  final Widget? icon;
  final Color? valueColor;

  const WoragisStatsCard({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return WoragisCard(
      variant: WoragisCardVariant.gradient,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSurface.withValues(alpha: 0.7),
                ),
              ),
              if (icon != null) icon!,
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: valueColor ?? colorScheme.primary,
            ),
          ),
        ],
      ),
    );
  }
}
