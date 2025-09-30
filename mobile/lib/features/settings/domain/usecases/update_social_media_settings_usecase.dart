import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/settings_repository.dart';

class UpdateSocialMediaSettingsUseCase {
  final SettingsRepository repository;

  UpdateSocialMediaSettingsUseCase(this.repository);

  Future<Either<Failure, void>> call(Map<String, String> settings) async {
    return await repository.updateSocialMediaSettings(settings);
  }
}
