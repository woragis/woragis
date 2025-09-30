// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'idea_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdeaModel _$IdeaModelFromJson(Map<String, dynamic> json) => IdeaModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  title: json['title'] as String,
  slug: json['slug'] as String,
  document: json['document'] as String,
  description: json['description'] as String?,
  featured: json['featured'] as bool,
  visible: json['visible'] as bool,
  public: json['public'] as bool,
  order: (json['order'] as num).toInt(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$IdeaModelToJson(IdeaModel instance) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'title': instance.title,
  'slug': instance.slug,
  'document': instance.document,
  'description': instance.description,
  'featured': instance.featured,
  'visible': instance.visible,
  'public': instance.public,
  'order': instance.order,
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};
