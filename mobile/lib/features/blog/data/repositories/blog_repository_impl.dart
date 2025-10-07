import 'package:dartz/dartz.dart';
import '../../domain/entities/blog_post_entity.dart';
import '../../domain/entities/blog_tag_entity.dart';
import '../../domain/repositories/blog_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/blog_local_datasource.dart';
import '../datasources/blog_remote_datasource.dart';

class BlogRepositoryImpl implements BlogRepository {
  final BlogRemoteDataSource remoteDataSource;
  final BlogLocalDataSource localDataSource;

  BlogRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
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
  }) async {
    try {
      final posts = await remoteDataSource.getBlogPosts(
        page: page,
        limit: limit,
        published: published,
        featured: featured,
        visible: visible,
        public: public,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );

      // Cache the posts locally
      await localDataSource.cacheBlogPosts(posts);

      return Right(posts);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedPosts = await localDataSource.getCachedBlogPosts(
          published: published,
          featured: featured,
          visible: visible,
          public: public,
          search: search,
        );
        return Right(cachedPosts);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BlogPostEntity>> getBlogPostById(String id) async {
    try {
      final post = await remoteDataSource.getBlogPostById(id);
      // Cache the post locally
      await localDataSource.cacheBlogPost(post);
      return Right(post);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedPost = await localDataSource.getCachedBlogPost(id);
        if (cachedPost != null) {
          return Right(cachedPost);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BlogPostEntity>> getBlogPostBySlug(String slug) async {
    try {
      final post = await remoteDataSource.getBlogPostBySlug(slug);
      // Cache the post locally
      await localDataSource.cacheBlogPost(post);
      return Right(post);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedPost = await localDataSource.getCachedBlogPostBySlug(slug);
        if (cachedPost != null) {
          return Right(cachedPost);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final post = await remoteDataSource.createBlogPost(
        title: title,
        slug: slug,
        excerpt: excerpt,
        content: content,
        featuredImage: featuredImage,
        readingTime: readingTime,
        featured: featured,
        published: published,
        publishedAt: publishedAt,
        order: order,
        visible: visible,
        public: public,
      );

      // Cache the new post
      await localDataSource.cacheBlogPost(post);

      return Right(post);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final post = await remoteDataSource.updateBlogPost(
        id: id,
        title: title,
        slug: slug,
        excerpt: excerpt,
        content: content,
        featuredImage: featuredImage,
        readingTime: readingTime,
        featured: featured,
        published: published,
        publishedAt: publishedAt,
        order: order,
        visible: visible,
        public: public,
      );

      // Update cached post
      await localDataSource.updateCachedBlogPost(post);

      return Right(post);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteBlogPost(String id) async {
    try {
      await remoteDataSource.deleteBlogPost(id);
      await localDataSource.removeCachedBlogPost(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BlogTagEntity>>> getBlogTags({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  }) async {
    try {
      final tags = await remoteDataSource.getBlogTags(
        page: page,
        limit: limit,
        visible: visible,
        search: search,
      );

      // Cache the tags locally
      await localDataSource.cacheBlogTags(tags);

      return Right(tags);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedTags = await localDataSource.getCachedBlogTags(
          limit: limit,
          visible: visible,
          search: search,
        );
        return Right(cachedTags);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BlogTagEntity>> getBlogTagById(String id) async {
    try {
      final tag = await remoteDataSource.getBlogTagById(id);
      // Cache the tag locally
      await localDataSource.cacheBlogTag(tag);
      return Right(tag);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedTag = await localDataSource.getCachedBlogTag(id);
        if (cachedTag != null) {
          return Right(cachedTag);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BlogTagEntity>> getBlogTagBySlug(String slug) async {
    try {
      final tag = await remoteDataSource.getBlogTagBySlug(slug);
      // Cache the tag locally
      await localDataSource.cacheBlogTag(tag);
      return Right(tag);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedTag = await localDataSource.getCachedBlogTagBySlug(slug);
        if (cachedTag != null) {
          return Right(cachedTag);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BlogTagEntity>> createBlogTag({
    required String name,
    required String slug,
    String? description,
    String? color,
  }) async {
    try {
      final tag = await remoteDataSource.createBlogTag(
        name: name,
        slug: slug,
        description: description,
        color: color,
      );

      // Cache the new tag
      await localDataSource.cacheBlogTag(tag);

      return Right(tag);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BlogTagEntity>> updateBlogTag({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? color,
  }) async {
    try {
      final tag = await remoteDataSource.updateBlogTag(
        id: id,
        name: name,
        slug: slug,
        description: description,
        color: color,
      );

      // Update cached tag
      await localDataSource.updateCachedBlogTag(tag);

      return Right(tag);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteBlogTag(String id) async {
    try {
      await remoteDataSource.deleteBlogTag(id);
      await localDataSource.removeCachedBlogTag(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> assignTagToPost({
    required String postId,
    required String tagId,
  }) async {
    try {
      await remoteDataSource.assignTagToPost(postId: postId, tagId: tagId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> removeTagFromPost({
    required String postId,
    required String tagId,
  }) async {
    try {
      await remoteDataSource.removeTagFromPost(postId: postId, tagId: tagId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BlogTagEntity>>> getPostTags(String postId) async {
    try {
      final tags = await remoteDataSource.getPostTags(postId);
      return Right(tags);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> incrementViewCount(String postId) async {
    try {
      await remoteDataSource.incrementViewCount(postId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> incrementLikeCount(String postId) async {
    try {
      await remoteDataSource.incrementLikeCount(postId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BlogPostEntity>>> getCachedBlogPosts() async {
    try {
      final posts = await localDataSource.getCachedBlogPosts();
      return Right(posts);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheBlogPosts(List<BlogPostEntity> posts) async {
    try {
      await localDataSource.cacheBlogPosts(posts);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BlogTagEntity>>> getCachedBlogTags() async {
    try {
      final tags = await localDataSource.getCachedBlogTags();
      return Right(tags);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheBlogTags(List<BlogTagEntity> tags) async {
    try {
      await localDataSource.cacheBlogTags(tags);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
