import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/biography_entity.dart';
import '../repositories/about_repository.dart';

class GetBiographyUseCase {
  final AboutRepository repository;

  GetBiographyUseCase(this.repository);

  Future<Either<Failure, BiographyEntity>> call() async {
    return await repository.getBiography();
  }
}
