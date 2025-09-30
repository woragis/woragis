import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/setting_entity.dart';
import '../repositories/settings_repository.dart';

class GetSettingByKeyUseCase {
  final SettingsRepository repository;

  GetSettingByKeyUseCase(this.repository);

  Future<Either<Failure, SettingEntity>> call(String key) async {
    return await repository.getSettingByKey(key);
  }
}
