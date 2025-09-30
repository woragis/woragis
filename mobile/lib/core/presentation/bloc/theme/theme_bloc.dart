import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Events
abstract class ThemeEvent extends Equatable {
  const ThemeEvent();

  @override
  List<Object?> get props => [];
}

class ToggleThemeMode extends ThemeEvent {}

class SetThemeMode extends ThemeEvent {
  final ThemeMode themeMode;

  const SetThemeMode(this.themeMode);

  @override
  List<Object> get props => [themeMode];
}

class LoadThemeMode extends ThemeEvent {}

// States
class ThemeState extends Equatable {
  final ThemeMode themeMode;
  final bool isDarkMode;

  const ThemeState({
    required this.themeMode,
    required this.isDarkMode,
  });

  factory ThemeState.initial() {
    return const ThemeState(
      themeMode: ThemeMode.system,
      isDarkMode: false,
    );
  }

  ThemeState copyWith({
    ThemeMode? themeMode,
    bool? isDarkMode,
  }) {
    return ThemeState(
      themeMode: themeMode ?? this.themeMode,
      isDarkMode: isDarkMode ?? this.isDarkMode,
    );
  }

  @override
  List<Object> get props => [themeMode, isDarkMode];
}

// BLoC
class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  final SharedPreferences sharedPreferences;
  static const String _themeModeKey = 'theme_mode';

  ThemeBloc({required this.sharedPreferences}) : super(ThemeState.initial()) {
    on<LoadThemeMode>(_onLoadThemeMode);
    on<ToggleThemeMode>(_onToggleThemeMode);
    on<SetThemeMode>(_onSetThemeMode);
  }

  Future<void> _onLoadThemeMode(
    LoadThemeMode event,
    Emitter<ThemeState> emit,
  ) async {
    final themeModeString = sharedPreferences.getString(_themeModeKey);
    
    if (themeModeString == null) {
      emit(state.copyWith(
        themeMode: ThemeMode.system,
        isDarkMode: false,
      ));
      return;
    }

    final themeMode = ThemeMode.values.firstWhere(
      (mode) => mode.toString() == themeModeString,
      orElse: () => ThemeMode.system,
    );

    emit(state.copyWith(
      themeMode: themeMode,
      isDarkMode: themeMode == ThemeMode.dark,
    ));
  }

  Future<void> _onToggleThemeMode(
    ToggleThemeMode event,
    Emitter<ThemeState> emit,
  ) async {
    final newThemeMode = state.themeMode == ThemeMode.dark
        ? ThemeMode.light
        : ThemeMode.dark;

    await sharedPreferences.setString(_themeModeKey, newThemeMode.toString());

    emit(state.copyWith(
      themeMode: newThemeMode,
      isDarkMode: newThemeMode == ThemeMode.dark,
    ));
  }

  Future<void> _onSetThemeMode(
    SetThemeMode event,
    Emitter<ThemeState> emit,
  ) async {
    await sharedPreferences.setString(_themeModeKey, event.themeMode.toString());

    emit(state.copyWith(
      themeMode: event.themeMode,
      isDarkMode: event.themeMode == ThemeMode.dark,
    ));
  }
}
