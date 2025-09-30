import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/settings_repository.dart';

class UpdateCoreProfileSettingsUseCase {
  final SettingsRepository repository;

  UpdateCoreProfileSettingsUseCase(this.repository);

  Future<Either<Failure, void>> call(Map<String, String> settings) async {
    return await repository.updateCoreProfileSettings(settings);
  }
}
