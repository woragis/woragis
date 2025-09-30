import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/settings_repository.dart';

class GetSocialMediaSettingsUseCase {
  final SettingsRepository repository;

  GetSocialMediaSettingsUseCase(this.repository);

  Future<Either<Failure, Map<String, String>>> call() async {
    return await repository.getSocialMediaSettings();
  }
}
