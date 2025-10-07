import 'package:flutter/material.dart';

enum WoragisButtonVariant {
  primary,
  secondary,
  outline,
  ghost,
  modern,
  glass,
  gradient,
}

enum WoragisButtonSize {
  small,
  medium,
  large,
}

class WoragisButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final WoragisButtonVariant variant;
  final WoragisButtonSize size;
  final IconData? icon;
  final bool isLoading;
  final bool isFullWidth;

  const WoragisButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = WoragisButtonVariant.primary,
    this.size = WoragisButtonSize.medium,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    Widget buttonChild = isLoading
        ? SizedBox(
            width: _getIconSize(),
            height: _getIconSize(),
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getTextColor(colorScheme),
              ),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(
                  icon,
                  size: _getIconSize(),
                  color: _getIconColor(colorScheme),
                ),
                const SizedBox(width: 8),
              ],
              Text(
                text,
                style: TextStyle(
                  fontSize: _getFontSize(),
                  fontWeight: FontWeight.w600,
                  color: _getTextColor(colorScheme),
                ),
              ),
            ],
          );

    Widget button = _buildButton(context, buttonChild);

    if (isFullWidth) {
      button = SizedBox(
        width: double.infinity,
        child: button,
      );
    }

    return button;
  }

  Widget _buildButton(BuildContext context, Widget child) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    switch (variant) {
      case WoragisButtonVariant.primary:
        return ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
            elevation: 0,
            shadowColor: colorScheme.primary.withValues(alpha: 0.3),
            padding: _getPadding(),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: child,
        );

      case WoragisButtonVariant.secondary:
        return ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: colorScheme.secondary,
            foregroundColor: colorScheme.onSecondary,
            elevation: 0,
            shadowColor: colorScheme.secondary.withValues(alpha: 0.3),
            padding: _getPadding(),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: child,
        );

      case WoragisButtonVariant.outline:
        return OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: colorScheme.primary,
            side: BorderSide(color: colorScheme.primary, width: 2),
            padding: _getPadding(),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: child,
        );

      case WoragisButtonVariant.ghost:
        return TextButton(
          onPressed: isLoading ? null : onPressed,
          style: TextButton.styleFrom(
            foregroundColor: colorScheme.onSurface,
            backgroundColor: Colors.transparent,
            padding: _getPadding(),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: child,
        );

      case WoragisButtonVariant.modern:
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                colorScheme.primary,
                colorScheme.secondary,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: colorScheme.primary.withValues(alpha: 0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: isLoading ? null : onPressed,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: _getPadding(),
                child: child,
              ),
            ),
          ),
        );

      case WoragisButtonVariant.glass:
        return Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.2),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: isLoading ? null : onPressed,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: _getPadding(),
                child: child,
              ),
            ),
          ),
        );

      case WoragisButtonVariant.gradient:
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                colorScheme.primary,
                colorScheme.secondary,
              ],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: colorScheme.primary.withValues(alpha: 0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: isLoading ? null : onPressed,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: _getPadding(),
                child: child,
              ),
            ),
          ),
        );
    }
  }

  Color _getTextColor(ColorScheme colorScheme) {
    switch (variant) {
      case WoragisButtonVariant.primary:
      case WoragisButtonVariant.secondary:
      case WoragisButtonVariant.modern:
      case WoragisButtonVariant.gradient:
        return Colors.white;
      case WoragisButtonVariant.outline:
        return colorScheme.primary;
      case WoragisButtonVariant.ghost:
        return colorScheme.onSurface;
      case WoragisButtonVariant.glass:
        return colorScheme.onSurface;
    }
  }

  Color _getIconColor(ColorScheme colorScheme) {
    return _getTextColor(colorScheme);
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case WoragisButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
      case WoragisButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
      case WoragisButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 32, vertical: 16);
    }
  }

  double _getFontSize() {
    switch (size) {
      case WoragisButtonSize.small:
        return 14;
      case WoragisButtonSize.medium:
        return 16;
      case WoragisButtonSize.large:
        return 18;
    }
  }

  double _getIconSize() {
    switch (size) {
      case WoragisButtonSize.small:
        return 16;
      case WoragisButtonSize.medium:
        return 20;
      case WoragisButtonSize.large:
        return 24;
    }
  }
}
