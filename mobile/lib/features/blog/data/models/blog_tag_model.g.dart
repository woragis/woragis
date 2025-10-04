// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_tag_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogTagModel _$BlogTagModelFromJson(Map<String, dynamic> json) => BlogTagModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  description: json['description'] as String?,
  color: json['color'] as String?,
  visible: json['visible'] as bool,
  order: (json['order'] as num).toInt(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$BlogTagModelToJson(BlogTagModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'color': instance.color,
      'visible': instance.visible,
      'order': instance.order,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
