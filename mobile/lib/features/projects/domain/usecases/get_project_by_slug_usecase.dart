import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/project_entity.dart';
import '../repositories/projects_repository.dart';

class GetProjectBySlugUseCase {
  final ProjectsRepository repository;

  GetProjectBySlugUseCase(this.repository);

  Future<Either<Failure, ProjectEntity>> call(String slug) async {
    return await repository.getProjectBySlug(slug);
  }
}
