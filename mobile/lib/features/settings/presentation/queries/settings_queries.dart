// Settings Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/setting_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class SettingsQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<List<SettingEntity>> getSettings({
    String? category,
    bool? isPublic,
  }) async {
    final useCase = sl<GetSettingsUseCase>();
    final result = await useCase(GetSettingsParams(
      category: category,
      isPublic: isPublic,
    ));
    return result.fold(
      (failure) => throw Exception(failure.message),
      (settings) => settings,
    );
  }

  // TODO: Add more query methods as use cases are implemented
  // static Future<SettingEntity> getSettingByKey(String key) async { ... }
  // static Future<SettingEntity> createSetting(CreateSettingParams params) async { ... }
  // static Future<SettingEntity> updateSetting(UpdateSettingParams params) async { ... }
  // static Future<void> deleteSetting(String id) async { ... }
  // static Future<Map<String, String>> getCoreProfileSettings() async { ... }
  // static Future<Map<String, String>> getSocialMediaSettings() async { ... }
  // static Future<Map<String, String>> getContactSettings() async { ... }
  // static Future<Map<String, String>> getSiteSettings() async { ... }
  // static Future<void> updateCoreProfileSettings(Map<String, String> settings) async { ... }
  // static Future<void> updateSocialMediaSettings(Map<String, String> settings) async { ... }
  // static Future<void> updateContactSettings(Map<String, String> settings) async { ... }
  // static Future<void> updateSiteSettings(Map<String, String> settings) async { ... }
}
