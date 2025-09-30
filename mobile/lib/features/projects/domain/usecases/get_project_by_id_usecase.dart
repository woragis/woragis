import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/project_entity.dart';
import '../repositories/projects_repository.dart';

class GetProjectByIdUseCase {
  final ProjectsRepository repository;

  GetProjectByIdUseCase(this.repository);

  Future<Either<Failure, ProjectEntity>> call(String id) async {
    return await repository.getProjectById(id);
  }
}
