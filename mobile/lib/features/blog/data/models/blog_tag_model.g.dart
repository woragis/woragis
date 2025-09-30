// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_tag_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogTagModel _$BlogTagModelFromJson(Map<String, dynamic> json) => BlogTagModel(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  description: json['description'] as String?,
  color: json['color'] as String?,
  postCount: (json['postCount'] as num?)?.toInt(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$BlogTagModelToJson(BlogTagModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'color': instance.color,
      'postCount': instance.postCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
