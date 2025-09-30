import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/experience_repository.dart';

class DeleteExperienceUseCase {
  final ExperienceRepository repository;

  DeleteExperienceUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteExperience(id);
  }
}
