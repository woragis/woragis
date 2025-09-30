// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProjectModel _$ProjectModelFromJson(Map<String, dynamic> json) => ProjectModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  title: json['title'] as String,
  slug: json['slug'] as String,
  description: json['description'] as String,
  longDescription: json['longDescription'] as String?,
  content: json['content'] as String?,
  videoUrl: json['videoUrl'] as String?,
  image: json['image'] as String,
  githubUrl: json['githubUrl'] as String?,
  liveUrl: json['liveUrl'] as String?,
  featured: json['featured'] as bool,
  order: (json['order'] as num).toInt(),
  visible: json['visible'] as bool,
  public: json['public'] as bool,
  frameworks: (json['frameworks'] as List<dynamic>?)
      ?.map((e) => FrameworkModel.fromJson(e as Map<String, dynamic>))
      .toList(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$ProjectModelToJson(ProjectModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'slug': instance.slug,
      'description': instance.description,
      'longDescription': instance.longDescription,
      'content': instance.content,
      'videoUrl': instance.videoUrl,
      'image': instance.image,
      'githubUrl': instance.githubUrl,
      'liveUrl': instance.liveUrl,
      'featured': instance.featured,
      'order': instance.order,
      'visible': instance.visible,
      'public': instance.public,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'frameworks': instance.frameworks?.map((e) => e.toJson()).toList(),
    };
