import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/blog_repository.dart';

class DeleteBlogPostUseCase {
  final BlogRepository repository;

  DeleteBlogPostUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteBlogPost(id);
  }
}
