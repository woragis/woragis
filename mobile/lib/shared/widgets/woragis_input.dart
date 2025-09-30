import 'dart:ui';
import 'package:flutter/material.dart';

enum WoragisInputVariant {
  default_,
  modern,
  glass,
  outlined,
  filled,
}

class WoragisInput extends StatelessWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final WoragisInputVariant variant;
  final TextEditingController? controller;
  final bool obscureText;
  final bool enabled;
  final bool readOnly;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final VoidCallback? onTap;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final FormFieldValidator<String>? validator;
  final int? maxLines;
  final int? maxLength;
  final EdgeInsetsGeometry? contentPadding;

  const WoragisInput({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.variant = WoragisInputVariant.default_,
    this.controller,
    this.obscureText = false,
    this.enabled = true,
    this.readOnly = false,
    this.keyboardType,
    this.textInputAction,
    this.prefixIcon,
    this.suffixIcon,
    this.onTap,
    this.onChanged,
    this.onSubmitted,
    this.validator,
    this.maxLines = 1,
    this.maxLength,
    this.contentPadding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: theme.textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.w500,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
        ],
        _buildInputField(context, colorScheme),
        if (helperText != null || errorText != null) ...[
          const SizedBox(height: 4),
          Text(
            errorText ?? helperText!,
            style: theme.textTheme.bodySmall?.copyWith(
              color: errorText != null
                  ? colorScheme.error
                  : colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildInputField(BuildContext context, ColorScheme colorScheme) {
    switch (variant) {
      case WoragisInputVariant.default_:
        return _buildDefaultInput(context, colorScheme);
      case WoragisInputVariant.modern:
        return _buildModernInput(context, colorScheme);
      case WoragisInputVariant.glass:
        return _buildGlassInput(context, colorScheme);
      case WoragisInputVariant.outlined:
        return _buildOutlinedInput(context, colorScheme);
      case WoragisInputVariant.filled:
        return _buildFilledInput(context, colorScheme);
    }
  }

  Widget _buildDefaultInput(BuildContext context, ColorScheme colorScheme) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      enabled: enabled,
      readOnly: readOnly,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      onTap: onTap,
      onChanged: onChanged,
      onFieldSubmitted: onSubmitted,
      validator: validator,
      maxLines: maxLines,
      maxLength: maxLength,
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        contentPadding: contentPadding ?? const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
      ),
    );
  }

  Widget _buildModernInput(BuildContext context, ColorScheme colorScheme) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: colorScheme.primary.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        enabled: enabled,
        readOnly: readOnly,
        keyboardType: keyboardType,
        textInputAction: textInputAction,
        onTap: onTap,
        onChanged: onChanged,
        onFieldSubmitted: onSubmitted,
        validator: validator,
        maxLines: maxLines,
        maxLength: maxLength,
        decoration: InputDecoration(
          hintText: hintText,
          prefixIcon: prefixIcon,
          suffixIcon: suffixIcon,
          filled: true,
          fillColor: colorScheme.surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: colorScheme.outline.withOpacity(0.3),
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: colorScheme.outline.withOpacity(0.3),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: colorScheme.primary,
              width: 2,
            ),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: colorScheme.error,
            ),
          ),
          contentPadding: contentPadding ?? const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildGlassInput(BuildContext context, ColorScheme colorScheme) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            enabled: enabled,
            readOnly: readOnly,
            keyboardType: keyboardType,
            textInputAction: textInputAction,
            onTap: onTap,
            onChanged: onChanged,
            onFieldSubmitted: onSubmitted,
            validator: validator,
            maxLines: maxLines,
            maxLength: maxLength,
            style: TextStyle(color: colorScheme.onSurface),
            decoration: InputDecoration(
              hintText: hintText,
              hintStyle: TextStyle(
                color: colorScheme.onSurface.withOpacity(0.6),
              ),
              prefixIcon: prefixIcon,
              suffixIcon: suffixIcon,
              filled: true,
              fillColor: Colors.transparent,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: colorScheme.primary,
                  width: 2,
                ),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: colorScheme.error,
                ),
              ),
              contentPadding: contentPadding ?? const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOutlinedInput(BuildContext context, ColorScheme colorScheme) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      enabled: enabled,
      readOnly: readOnly,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      onTap: onTap,
      onChanged: onChanged,
      onFieldSubmitted: onSubmitted,
      validator: validator,
      maxLines: maxLines,
      maxLength: maxLength,
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: colorScheme.outline,
            width: 2,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: colorScheme.outline,
            width: 2,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: colorScheme.primary,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: colorScheme.error,
            width: 2,
          ),
        ),
        contentPadding: contentPadding ?? const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
      ),
    );
  }

  Widget _buildFilledInput(BuildContext context, ColorScheme colorScheme) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      enabled: enabled,
      readOnly: readOnly,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      onTap: onTap,
      onChanged: onChanged,
      onFieldSubmitted: onSubmitted,
      validator: validator,
      maxLines: maxLines,
      maxLength: maxLength,
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: colorScheme.primary,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: colorScheme.error,
          ),
        ),
        contentPadding: contentPadding ?? const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
      ),
    );
  }
}

// Specialized input variants
class WoragisSearchInput extends StatelessWidget {
  final String? hintText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClear;
  final bool showClearButton;

  const WoragisSearchInput({
    Key? key,
    this.hintText,
    this.controller,
    this.onChanged,
    this.onClear,
    this.showClearButton = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return WoragisInput(
      variant: WoragisInputVariant.modern,
      hintText: hintText ?? 'Search...',
      controller: controller,
      onChanged: onChanged,
      prefixIcon: Icon(
        Icons.search,
        color: colorScheme.onSurface.withOpacity(0.6),
      ),
      suffixIcon: showClearButton && 
          controller != null && 
          controller!.text.isNotEmpty
          ? IconButton(
              icon: Icon(
                Icons.clear,
                color: colorScheme.onSurface.withOpacity(0.6),
              ),
              onPressed: () {
                controller?.clear();
                onClear?.call();
              },
            )
          : null,
    );
  }
}

class WoragisPasswordInput extends StatefulWidget {
  final String? label;
  final String? hintText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;
  final WoragisInputVariant variant;

  const WoragisPasswordInput({
    Key? key,
    this.label,
    this.hintText,
    this.controller,
    this.onChanged,
    this.validator,
    this.variant = WoragisInputVariant.modern,
  }) : super(key: key);

  @override
  State<WoragisPasswordInput> createState() => _WoragisPasswordInputState();
}

class _WoragisPasswordInputState extends State<WoragisPasswordInput> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return WoragisInput(
      variant: widget.variant,
      label: widget.label,
      hintText: widget.hintText,
      controller: widget.controller,
      onChanged: widget.onChanged,
      validator: widget.validator,
      obscureText: _obscureText,
      suffixIcon: IconButton(
        icon: Icon(
          _obscureText ? Icons.visibility : Icons.visibility_off,
          color: colorScheme.onSurface.withOpacity(0.6),
        ),
        onPressed: () {
          setState(() {
            _obscureText = !_obscureText;
          });
        },
      ),
    );
  }
}
