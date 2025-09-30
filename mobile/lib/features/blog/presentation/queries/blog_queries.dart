// Blog Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/blog_post_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class BlogQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<List<BlogPostEntity>> getBlogPosts({
    int? page,
    int? limit,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl<GetBlogPostsUseCase>();
    final result = await useCase(GetBlogPostsParams(
      page: page,
      limit: limit,
      published: published,
      featured: featured,
      visible: visible,
      public: public,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    ));
    return result.fold(
      (failure) => throw Exception(failure.message),
      (posts) => posts,
    );
  }

  // TODO: Add more query methods as use cases are implemented
  // static Future<BlogPostEntity> getBlogPostById(String id) async { ... }
  // static Future<BlogPostEntity> createBlogPost(CreateBlogPostParams params) async { ... }
  // static Future<BlogPostEntity> updateBlogPost(UpdateBlogPostParams params) async { ... }
  // static Future<void> deleteBlogPost(String id) async { ... }
  // static Future<List<BlogTagEntity>> getBlogTags({...}) async { ... }
  // static Future<BlogTagEntity> createBlogTag(CreateBlogTagParams params) async { ... }
  // static Future<BlogTagEntity> updateBlogTag(UpdateBlogTagParams params) async { ... }
  // static Future<void> deleteBlogTag(String id) async { ... }
  // static Future<void> incrementViewCount(String postId) async { ... }
  // static Future<void> incrementLikeCount(String postId) async { ... }
}
