import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_post_entity.dart';
import '../repositories/blog_repository.dart';

class CreateBlogPostUseCase {
  final BlogRepository repository;

  CreateBlogPostUseCase(this.repository);

  Future<Either<Failure, BlogPostEntity>> call(CreateBlogPostParams params) async {
    return await repository.createBlogPost(
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

class CreateBlogPostParams {
  final String title;
  final String slug;
  final String excerpt;
  final String content;
  final String? featuredImage;
  final int? readingTime;
  final bool featured;
  final bool published;
  final DateTime? publishedAt;
  final int order;
  final bool visible;
  final bool public;

  CreateBlogPostParams({
    required this.title,
    required this.slug,
    required this.excerpt,
    required this.content,
    this.featuredImage,
    this.readingTime,
    required this.featured,
    required this.published,
    this.publishedAt,
    required this.order,
    required this.visible,
    required this.public,
  });
}
