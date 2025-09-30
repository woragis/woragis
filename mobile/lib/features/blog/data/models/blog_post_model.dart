import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/blog_post_entity.dart';
import 'blog_tag_model.dart';

part 'blog_post_model.g.dart';

@JsonSerializable(explicitToJson: true)
class BlogPostModel extends BlogPostEntity {
  @override
  final List<BlogTagModel>? tags;

  const BlogPostModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.slug,
    required super.excerpt,
    required super.content,
    super.featuredImage,
    super.readingTime,
    required super.featured,
    required super.published,
    super.publishedAt,
    required super.order,
    required super.visible,
    required super.public,
    super.viewCount,
    super.likeCount,
    this.tags,
    required super.createdAt,
    required super.updatedAt,
  }) : super(tags: tags);

  factory BlogPostModel.fromJson(Map<String, dynamic> json) =>
      _$BlogPostModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogPostModelToJson(this);

  factory BlogPostModel.fromEntity(BlogPostEntity entity) {
    return BlogPostModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      slug: entity.slug,
      excerpt: entity.excerpt,
      content: entity.content,
      featuredImage: entity.featuredImage,
      readingTime: entity.readingTime,
      featured: entity.featured,
      published: entity.published,
      publishedAt: entity.publishedAt,
      order: entity.order,
      visible: entity.visible,
      public: entity.public,
      viewCount: entity.viewCount,
      likeCount: entity.likeCount,
      tags: entity.tags?.map((tag) => BlogTagModel.fromEntity(tag)).toList(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  BlogPostEntity toEntity() {
    return BlogPostEntity(
      id: id,
      userId: userId,
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
      viewCount: viewCount,
      likeCount: likeCount,
      tags: tags?.map((tag) => tag.toEntity()).toList(),
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  BlogPostModel copyWith({
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
    covariant List<BlogTagModel>? tags,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BlogPostModel(
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
