import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/biography_entity.dart';
import '../repositories/about_repository.dart';

class UpdateBiographyUseCase {
  final AboutRepository repository;

  UpdateBiographyUseCase(this.repository);

  Future<Either<Failure, BiographyEntity>> call({
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
  }) async {
    return await repository.updateBiography(
      featuredBiography: featuredBiography,
      fullBiography: fullBiography,
      visible: visible,
    );
  }
}
