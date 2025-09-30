import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_post_entity.dart';
import '../repositories/blog_repository.dart';

class GetBlogPostBySlugUseCase {
  final BlogRepository repository;

  GetBlogPostBySlugUseCase(this.repository);

  Future<Either<Failure, BlogPostEntity>> call(String slug) async {
    return await repository.getBlogPostBySlug(slug);
  }
}
