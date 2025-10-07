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

  /// Creates a BlogPostModel from database JSON with snake_case field names
  factory BlogPostModel.fromDatabaseJson(Map<String, dynamic> json) {
    return BlogPostModel(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      title: json['title'] as String,
      slug: json['slug'] as String,
      excerpt: json['excerpt'] as String,
      content: json['content'] as String,
      featuredImage: json['featured_image'] as String?,
      readingTime: json['reading_time'] as int?,
      featured: (json['featured'] as int) == 1,
      published: (json['published'] as int) == 1,
      publishedAt: json['published_at'] != null 
          ? DateTime.fromMillisecondsSinceEpoch(json['published_at'] as int)
          : null,
      order: json['order'] as int,
      visible: (json['visible'] as int) == 1,
      public: (json['public'] as int) == 1,
      viewCount: json['view_count'] as int?,
      likeCount: json['like_count'] as int?,
      tags: null, // Tags are stored in separate blog_post_tags table
      createdAt: DateTime.fromMillisecondsSinceEpoch(json['created_at'] as int),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(json['updated_at'] as int),
    );
  }

  Map<String, dynamic> toJson() => _$BlogPostModelToJson(this);

  /// Converts to database format with snake_case field names
  Map<String, dynamic> toDatabaseJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'slug': slug,
      'excerpt': excerpt,
      'content': content,
      'featured_image': featuredImage,
      'reading_time': readingTime,
      'featured': featured ? 1 : 0,
      'published': published ? 1 : 0,
      'published_at': publishedAt?.millisecondsSinceEpoch,
      'order': order,
      'visible': visible ? 1 : 0,
      'public': public ? 1 : 0,
      'view_count': viewCount,
      'like_count': likeCount,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

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
