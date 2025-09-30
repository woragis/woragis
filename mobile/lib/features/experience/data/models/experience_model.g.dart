// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'experience_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceModel _$ExperienceModelFromJson(Map<String, dynamic> json) =>
    ExperienceModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      title: json['title'] as String,
      company: json['company'] as String,
      period: json['period'] as String,
      location: json['location'] as String,
      description: json['description'] as String,
      achievements: (json['achievements'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      technologies: (json['technologies'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      icon: json['icon'] as String,
      order: (json['order'] as num).toInt(),
      visible: json['visible'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ExperienceModelToJson(ExperienceModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'company': instance.company,
      'period': instance.period,
      'location': instance.location,
      'description': instance.description,
      'achievements': instance.achievements,
      'technologies': instance.technologies,
      'icon': instance.icon,
      'order': instance.order,
      'visible': instance.visible,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
