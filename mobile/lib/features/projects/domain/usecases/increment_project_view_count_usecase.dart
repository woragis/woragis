import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/projects_repository.dart';

class IncrementProjectViewCountUseCase {
  final ProjectsRepository repository;

  IncrementProjectViewCountUseCase(this.repository);

  Future<Either<Failure, void>> call(String projectId) async {
    return await repository.incrementViewCount(projectId);
  }
}
