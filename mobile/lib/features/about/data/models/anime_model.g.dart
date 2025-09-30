// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'anime_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AnimeModel _$AnimeModelFromJson(Map<String, dynamic> json) => AnimeModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  title: json['title'] as String,
  description: json['description'] as String?,
  status: $enumDecode(_$AnimeStatusEnumMap, json['status']),
  myAnimeListId: json['myAnimeListId'] as String?,
  coverImage: json['coverImage'] as String?,
  genres: (json['genres'] as List<dynamic>?)?.map((e) => e as String).toList(),
  episodes: (json['episodes'] as num?)?.toInt(),
  currentEpisode: (json['currentEpisode'] as num?)?.toInt(),
  rating: (json['rating'] as num?)?.toDouble(),
  notes: json['notes'] as String?,
  startedAt: json['startedAt'] == null
      ? null
      : DateTime.parse(json['startedAt'] as String),
  completedAt: json['completedAt'] == null
      ? null
      : DateTime.parse(json['completedAt'] as String),
  order: (json['order'] as num).toInt(),
  visible: json['visible'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$AnimeModelToJson(AnimeModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'description': instance.description,
      'status': _$AnimeStatusEnumMap[instance.status]!,
      'myAnimeListId': instance.myAnimeListId,
      'coverImage': instance.coverImage,
      'genres': instance.genres,
      'episodes': instance.episodes,
      'currentEpisode': instance.currentEpisode,
      'rating': instance.rating,
      'notes': instance.notes,
      'startedAt': instance.startedAt?.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'order': instance.order,
      'visible': instance.visible,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$AnimeStatusEnumMap = {
  AnimeStatus.watching: 'watching',
  AnimeStatus.completed: 'completed',
  AnimeStatus.onHold: 'onHold',
  AnimeStatus.dropped: 'dropped',
  AnimeStatus.planToWatch: 'planToWatch',
};
