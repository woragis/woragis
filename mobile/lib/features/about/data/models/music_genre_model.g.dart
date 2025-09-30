// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'music_genre_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MusicGenreModel _$MusicGenreModelFromJson(Map<String, dynamic> json) =>
    MusicGenreModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      order: (json['order'] as num).toInt(),
      visible: json['visible'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$MusicGenreModelToJson(MusicGenreModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'description': instance.description,
      'order': instance.order,
      'visible': instance.visible,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
