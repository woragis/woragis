import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/setting_entity.dart';
import '../repositories/settings_repository.dart';

class UpdateSettingUseCase {
  final SettingsRepository repository;

  UpdateSettingUseCase(this.repository);

  Future<Either<Failure, SettingEntity>> call({
    required String id,
    String? key,
    String? value,
    String? description,
    String? category,
    bool? isPublic,
  }) async {
    return await repository.updateSetting(
      id: id,
      key: key,
      value: value,
      description: description,
      category: category,
      isPublic: isPublic,
    );
  }
}
