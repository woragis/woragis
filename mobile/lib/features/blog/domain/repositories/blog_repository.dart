import 'package:dartz/dartz.dart';
import '../entities/blog_post_entity.dart';
import '../entities/blog_tag_entity.dart';
import '../entities/blog_stats_entity.dart';
import '../entities/blog_tag_with_count_entity.dart';
import '../entities/blog_order_update_entity.dart';
import '../../../../core/error/failures.dart';

abstract class BlogRepository {
  // Blog posts methods
  Future<Either<Failure, List<BlogPostEntity>>> getBlogPosts({
    int? page,
    int? limit,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<Either<Failure, BlogPostEntity>> getBlogPostById(String id);
  Future<Either<Failure, BlogPostEntity>> getBlogPostBySlug(String slug);
  
  Future<Either<Failure, BlogPostEntity>> createBlogPost({
    required String title,
    required String slug,
    required String excerpt,
    required String content,
    String? featuredImage,
    int? readingTime,
    required bool featured,
    required bool published,
    DateTime? publishedAt,
    required int order,
    required bool visible,
    required bool public,
  });

  Future<Either<Failure, BlogPostEntity>> updateBlogPost({
    required String id,
    String? title,
    String? slug,
    String? excerpt,
    String? content,
    String? featuredImage,
    int? readingTime,
    bool? featured,
    bool? published,
    DateTime? publishedAt,
    int? order,
    bool? visible,
    bool? public,
  });

  Future<Either<Failure, void>> deleteBlogPost(String id);

  // Blog tags methods
  Future<Either<Failure, List<BlogTagEntity>>> getBlogTags({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  });

  Future<Either<Failure, BlogTagEntity>> getBlogTagById(String id);
  Future<Either<Failure, BlogTagEntity>> getBlogTagBySlug(String slug);

  Future<Either<Failure, BlogTagEntity>> createBlogTag({
    required String name,
    required String slug,
    String? description,
    String? color,
  });

  Future<Either<Failure, BlogTagEntity>> updateBlogTag({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? color,
  });

  Future<Either<Failure, void>> deleteBlogTag(String id);

  // Blog post tags relationship methods
  Future<Either<Failure, void>> assignTagToPost({
    required String postId,
    required String tagId,
  });

  Future<Either<Failure, void>> removeTagFromPost({
    required String postId,
    required String tagId,
  });

  Future<Either<Failure, List<BlogTagEntity>>> getPostTags(String postId);

  // Order management methods
  Future<Either<Failure, void>> updateBlogPostOrder(List<BlogPostOrderUpdateEntity> orders);
  Future<Either<Failure, void>> updateBlogTagOrder(List<BlogTagOrderUpdateEntity> orders);

  // Toggle convenience methods
  Future<Either<Failure, BlogPostEntity>> toggleBlogPostVisibility(String id);
  Future<Either<Failure, BlogPostEntity>> toggleBlogPostFeatured(String id);
  Future<Either<Failure, BlogPostEntity>> toggleBlogPostPublished(String id);

  // Statistics methods
  Future<Either<Failure, void>> incrementViewCount(String postId);
  Future<Either<Failure, void>> incrementLikeCount(String postId);
  Future<Either<Failure, BlogStatsEntity>> getBlogStats();
  Future<Either<Failure, BlogStatsEntity>> getPublicBlogStats();

  // Enhanced tag methods
  Future<Either<Failure, List<BlogTagWithCountEntity>>> getBlogTagsWithCount();
  Future<Either<Failure, List<BlogTagWithCountEntity>>> getPopularBlogTags({int? limit});

  // Offline/Cache methods
  Future<Either<Failure, List<BlogPostEntity>>> getCachedBlogPosts();
  Future<Either<Failure, void>> cacheBlogPosts(List<BlogPostEntity> posts);
  Future<Either<Failure, List<BlogTagEntity>>> getCachedBlogTags();
  Future<Either<Failure, void>> cacheBlogTags(List<BlogTagEntity> tags);
}
