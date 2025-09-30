// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'about_core_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AboutCoreModel _$AboutCoreModelFromJson(Map<String, dynamic> json) =>
    AboutCoreModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      currentProfessionId: json['currentProfessionId'] as String?,
      biography: json['biography'] as String?,
      featuredBiography: json['featuredBiography'] as String?,
      visible: json['visible'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$AboutCoreModelToJson(AboutCoreModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'currentProfessionId': instance.currentProfessionId,
      'biography': instance.biography,
      'featuredBiography': instance.featuredBiography,
      'visible': instance.visible,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
