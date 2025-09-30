import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/about_core_entity.dart';
import '../repositories/about_repository.dart';

class UpdateAboutCoreUseCase {
  final AboutRepository repository;

  UpdateAboutCoreUseCase(this.repository);

  Future<Either<Failure, AboutCoreEntity>> call({
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
  }) async {
    return await repository.updateAboutCore(
      name: name,
      currentProfessionId: currentProfessionId,
      biography: biography,
      featuredBiography: featuredBiography,
      visible: visible,
    );
  }
}
