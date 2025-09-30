import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_post_entity.dart';
import '../repositories/blog_repository.dart';

class GetBlogPostsUseCase {
  final BlogRepository repository;

  GetBlogPostsUseCase(this.repository);

  Future<Either<Failure, List<BlogPostEntity>>> call(GetBlogPostsParams params) async {
    return await repository.getBlogPosts(
      page: params.page,
      limit: params.limit,
      published: params.published,
      featured: params.featured,
      visible: params.visible,
      public: params.public,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    );
  }
}

class GetBlogPostsParams {
  final int? page;
  final int? limit;
  final bool? published;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetBlogPostsParams({
    this.page,
    this.limit,
    this.published,
    this.featured,
    this.visible,
    this.public,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
