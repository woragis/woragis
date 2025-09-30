import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Supported languages
enum AppLanguage {
  english('en', 'English'),
  spanish('es', 'Español'),
  portuguese('pt', 'Português'),
  french('fr', 'Français'),
  italian('it', 'Italiano'),
  japanese('ja', '日本語'),
  korean('ko', '한국어'),
  chinese('zh', '中文');

  final String code;
  final String displayName;

  const AppLanguage(this.code, this.displayName);

  static AppLanguage fromCode(String code) {
    return AppLanguage.values.firstWhere(
      (lang) => lang.code == code,
      orElse: () => AppLanguage.english,
    );
  }
}

// Events
abstract class LanguageEvent extends Equatable {
  const LanguageEvent();

  @override
  List<Object?> get props => [];
}

class LoadLanguage extends LanguageEvent {}

class ChangeLanguage extends LanguageEvent {
  final AppLanguage language;

  const ChangeLanguage(this.language);

  @override
  List<Object> get props => [language];
}

// States
class LanguageState extends Equatable {
  final AppLanguage currentLanguage;
  final Locale locale;

  const LanguageState({
    required this.currentLanguage,
    required this.locale,
  });

  factory LanguageState.initial() {
    return const LanguageState(
      currentLanguage: AppLanguage.english,
      locale: Locale('en'),
    );
  }

  LanguageState copyWith({
    AppLanguage? currentLanguage,
    Locale? locale,
  }) {
    return LanguageState(
      currentLanguage: currentLanguage ?? this.currentLanguage,
      locale: locale ?? this.locale,
    );
  }

  @override
  List<Object> get props => [currentLanguage, locale];
}

// BLoC
class LanguageBloc extends Bloc<LanguageEvent, LanguageState> {
  final SharedPreferences sharedPreferences;
  static const String _languageKey = 'app_language';

  LanguageBloc({required this.sharedPreferences}) : super(LanguageState.initial()) {
    on<LoadLanguage>(_onLoadLanguage);
    on<ChangeLanguage>(_onChangeLanguage);
  }

  Future<void> _onLoadLanguage(
    LoadLanguage event,
    Emitter<LanguageState> emit,
  ) async {
    final languageCode = sharedPreferences.getString(_languageKey);
    
    if (languageCode == null) {
      // Use system language or default to English
      final systemLocale = WidgetsBinding.instance.platformDispatcher.locale;
      final language = AppLanguage.fromCode(systemLocale.languageCode);
      
      emit(state.copyWith(
        currentLanguage: language,
        locale: Locale(language.code),
      ));
      return;
    }

    final language = AppLanguage.fromCode(languageCode);

    emit(state.copyWith(
      currentLanguage: language,
      locale: Locale(language.code),
    ));
  }

  Future<void> _onChangeLanguage(
    ChangeLanguage event,
    Emitter<LanguageState> emit,
  ) async {
    await sharedPreferences.setString(_languageKey, event.language.code);

    emit(state.copyWith(
      currentLanguage: event.language,
      locale: Locale(event.language.code),
    ));
  }
}
