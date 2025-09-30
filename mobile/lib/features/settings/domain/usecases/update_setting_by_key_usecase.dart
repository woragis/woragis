import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/setting_entity.dart';
import '../repositories/settings_repository.dart';

class UpdateSettingByKeyUseCase {
  final SettingsRepository repository;

  UpdateSettingByKeyUseCase(this.repository);

  Future<Either<Failure, SettingEntity>> call({
    required String key,
    required String value,
  }) async {
    return await repository.updateSettingByKey(
      key: key,
      value: value,
    );
  }
}
