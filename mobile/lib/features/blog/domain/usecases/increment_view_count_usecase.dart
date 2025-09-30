import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/blog_repository.dart';

class IncrementViewCountUseCase {
  final BlogRepository repository;

  IncrementViewCountUseCase(this.repository);

  Future<Either<Failure, void>> call(String postId) async {
    return await repository.incrementViewCount(postId);
  }
}
