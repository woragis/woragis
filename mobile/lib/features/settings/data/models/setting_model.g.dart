// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'setting_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SettingModel _$SettingModelFromJson(Map<String, dynamic> json) => SettingModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  key: json['key'] as String,
  value: json['value'] as String,
  description: json['description'] as String?,
  category: json['category'] as String?,
  isPublic: json['isPublic'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$SettingModelToJson(SettingModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'key': instance.key,
      'value': instance.value,
      'description': instance.description,
      'category': instance.category,
      'isPublic': instance.isPublic,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
