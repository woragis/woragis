import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/projects_repository.dart';

class DeleteProjectUseCase {
  final ProjectsRepository repository;

  DeleteProjectUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteProject(id);
  }
}
