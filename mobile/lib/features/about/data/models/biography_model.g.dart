// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'biography_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BiographyModel _$BiographyModelFromJson(Map<String, dynamic> json) =>
    BiographyModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      featuredBiography: json['featuredBiography'] as String?,
      fullBiography: json['fullBiography'] as String?,
      visible: json['visible'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$BiographyModelToJson(BiographyModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'featuredBiography': instance.featuredBiography,
      'fullBiography': instance.fullBiography,
      'visible': instance.visible,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
