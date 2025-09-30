// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_post_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogPostModel _$BlogPostModelFromJson(Map<String, dynamic> json) =>
    BlogPostModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      title: json['title'] as String,
      slug: json['slug'] as String,
      excerpt: json['excerpt'] as String,
      content: json['content'] as String,
      featuredImage: json['featuredImage'] as String?,
      readingTime: (json['readingTime'] as num?)?.toInt(),
      featured: json['featured'] as bool,
      published: json['published'] as bool,
      publishedAt: json['publishedAt'] == null
          ? null
          : DateTime.parse(json['publishedAt'] as String),
      order: (json['order'] as num).toInt(),
      visible: json['visible'] as bool,
      public: json['public'] as bool,
      viewCount: (json['viewCount'] as num?)?.toInt(),
      likeCount: (json['likeCount'] as num?)?.toInt(),
      tags: (json['tags'] as List<dynamic>?)
          ?.map((e) => BlogTagModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$BlogPostModelToJson(BlogPostModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'slug': instance.slug,
      'excerpt': instance.excerpt,
      'content': instance.content,
      'featuredImage': instance.featuredImage,
      'readingTime': instance.readingTime,
      'featured': instance.featured,
      'published': instance.published,
      'publishedAt': instance.publishedAt?.toIso8601String(),
      'order': instance.order,
      'visible': instance.visible,
      'public': instance.public,
      'viewCount': instance.viewCount,
      'likeCount': instance.likeCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'tags': instance.tags?.map((e) => e.toJson()).toList(),
    };
