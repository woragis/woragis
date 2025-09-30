import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_post_entity.dart';
import '../repositories/blog_repository.dart';

class GetBlogPostByIdUseCase {
  final BlogRepository repository;

  GetBlogPostByIdUseCase(this.repository);

  Future<Either<Failure, BlogPostEntity>> call(String id) async {
    return await repository.getBlogPostById(id);
  }
}
