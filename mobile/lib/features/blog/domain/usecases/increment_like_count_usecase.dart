import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/blog_repository.dart';

class IncrementLikeCountUseCase {
  final BlogRepository repository;

  IncrementLikeCountUseCase(this.repository);

  Future<Either<Failure, void>> call(String postId) async {
    return await repository.incrementLikeCount(postId);
  }
}
