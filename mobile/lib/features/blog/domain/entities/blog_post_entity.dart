import 'package:equatable/equatable.dart';
import 'blog_tag_entity.dart';

class BlogPostEntity extends Equatable {
  final String id;
  final String userId;
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
  final int? viewCount;
  final int? likeCount;
  final List<BlogTagEntity>? tags;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BlogPostEntity({
    required this.id,
    required this.userId,
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
    this.viewCount,
    this.likeCount,
    this.tags,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        readingTime,
        featured,
        published,
        publishedAt,
        order,
        visible,
        public,
        viewCount,
        likeCount,
        tags,
        createdAt,
        updatedAt,
      ];

  BlogPostEntity copyWith({
    String? id,
    String? userId,
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
    int? viewCount,
    int? likeCount,
    List<BlogTagEntity>? tags,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BlogPostEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      slug: slug ?? this.slug,
      excerpt: excerpt ?? this.excerpt,
      content: content ?? this.content,
      featuredImage: featuredImage ?? this.featuredImage,
      readingTime: readingTime ?? this.readingTime,
      featured: featured ?? this.featured,
      published: published ?? this.published,
      publishedAt: publishedAt ?? this.publishedAt,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      viewCount: viewCount ?? this.viewCount,
      likeCount: likeCount ?? this.likeCount,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
