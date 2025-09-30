import 'package:dartz/dartz.dart';
import '../entities/setting_entity.dart';
import '../../../../core/error/failures.dart';

abstract class SettingsRepository {
  // Settings methods
  Future<Either<Failure, List<SettingEntity>>> getSettings({
    String? category,
    bool? isPublic,
  });

  Future<Either<Failure, SettingEntity>> getSettingByKey(String key);
  Future<Either<Failure, SettingEntity>> getSettingById(String id);

  Future<Either<Failure, SettingEntity>> createSetting({
    required String key,
    required String value,
    String? description,
    String? category,
    required bool isPublic,
  });

  Future<Either<Failure, SettingEntity>> updateSetting({
    required String id,
    String? key,
    String? value,
    String? description,
    String? category,
    bool? isPublic,
  });

  Future<Either<Failure, SettingEntity>> updateSettingByKey({
    required String key,
    required String value,
  });

  Future<Either<Failure, void>> deleteSetting(String id);

  // Bulk operations
  Future<Either<Failure, Map<String, String>>> getSettingsAsMap({
    String? category,
    bool? isPublic,
  });

  Future<Either<Failure, void>> updateSettingsBulk(
    Map<String, String> settings,
  );

  // Category-specific settings
  Future<Either<Failure, Map<String, String>>> getCoreProfileSettings();
  Future<Either<Failure, Map<String, String>>> getSocialMediaSettings();
  Future<Either<Failure, Map<String, String>>> getContactSettings();
  Future<Either<Failure, Map<String, String>>> getSiteSettings();

  Future<Either<Failure, void>> updateCoreProfileSettings(
    Map<String, String> settings,
  );
  Future<Either<Failure, void>> updateSocialMediaSettings(
    Map<String, String> settings,
  );
  Future<Either<Failure, void>> updateContactSettings(
    Map<String, String> settings,
  );
  Future<Either<Failure, void>> updateSiteSettings(
    Map<String, String> settings,
  );

  // Offline/Cache methods
  Future<Either<Failure, List<SettingEntity>>> getCachedSettings();
  Future<Either<Failure, void>> cacheSettings(List<SettingEntity> settings);
  Future<Either<Failure, SettingEntity?>> getCachedSetting(String key);
  Future<Either<Failure, void>> cacheSetting(SettingEntity setting);
}
