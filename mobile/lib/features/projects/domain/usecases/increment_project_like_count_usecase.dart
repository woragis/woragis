import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/projects_repository.dart';

class IncrementProjectLikeCountUseCase {
  final ProjectsRepository repository;

  IncrementProjectLikeCountUseCase(this.repository);

  Future<Either<Failure, void>> call(String projectId) async {
    return await repository.incrementLikeCount(projectId);
  }
}
