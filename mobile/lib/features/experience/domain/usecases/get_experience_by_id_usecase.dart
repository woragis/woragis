import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/experience_entity.dart';
import '../repositories/experience_repository.dart';

class GetExperienceByIdUseCase {
  final ExperienceRepository repository;

  GetExperienceByIdUseCase(this.repository);

  Future<Either<Failure, ExperienceEntity>> call(String id) async {
    return await repository.getExperienceById(id);
  }
}
