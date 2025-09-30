import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_post_entity.dart';
import '../repositories/blog_repository.dart';

class UpdateBlogPostUseCase {
  final BlogRepository repository;

  UpdateBlogPostUseCase(this.repository);

  Future<Either<Failure, BlogPostEntity>> call(UpdateBlogPostParams params) async {
    return await repository.updateBlogPost(
      id: params.id,
      title: params.title,
      slug: params.slug,
      excerpt: params.excerpt,
      content: params.content,
      featuredImage: params.featuredImage,
      readingTime: params.readingTime,
      featured: params.featured,
      published: params.published,
      publishedAt: params.publishedAt,
      order: params.order,
      visible: params.visible,
      public: params.public,
    );
  }
}

class UpdateBlogPostParams {
  final String id;
  final String? title;
  final String? slug;
  final String? excerpt;
  final String? content;
  final String? featuredImage;
  final int? readingTime;
  final bool? featured;
  final bool? published;
  final DateTime? publishedAt;
  final int? order;
  final bool? visible;
  final bool? public;

  UpdateBlogPostParams({
    required this.id,
    this.title,
    this.slug,
    this.excerpt,
    this.content,
    this.featuredImage,
    this.readingTime,
    this.featured,
    this.published,
    this.publishedAt,
    this.order,
    this.visible,
    this.public,
  });
}
