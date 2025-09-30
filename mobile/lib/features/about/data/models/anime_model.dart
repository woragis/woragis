import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/anime_entity.dart';

part 'anime_model.g.dart';

enum AnimeStatusModel {
  @JsonValue('watching')
  watching,
  @JsonValue('completed')
  completed,
  @JsonValue('on_hold')
  onHold,
  @JsonValue('dropped')
  dropped,
  @JsonValue('plan_to_watch')
  planToWatch,
}

@JsonSerializable()
class AnimeModel extends AnimeEntity {
  const AnimeModel({
    required super.id,
    required super.userId,
    required super.title,
    super.description,
    required super.status,
    super.myAnimeListId,
    super.coverImage,
    super.genres,
    super.episodes,
    super.currentEpisode,
    super.rating,
    super.notes,
    super.startedAt,
    super.completedAt,
    required super.order,
    required super.visible,
    required super.createdAt,
    required super.updatedAt,
  });

  factory AnimeModel.fromJson(Map<String, dynamic> json) =>
      _$AnimeModelFromJson(json);

  Map<String, dynamic> toJson() => _$AnimeModelToJson(this);

  factory AnimeModel.fromEntity(AnimeEntity entity) {
    return AnimeModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      myAnimeListId: entity.myAnimeListId,
      coverImage: entity.coverImage,
      genres: entity.genres,
      episodes: entity.episodes,
      currentEpisode: entity.currentEpisode,
      rating: entity.rating,
      notes: entity.notes,
      startedAt: entity.startedAt,
      completedAt: entity.completedAt,
      order: entity.order,
      visible: entity.visible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  AnimeEntity toEntity() {
    return AnimeEntity(
      id: id,
      userId: userId,
      title: title,
      description: description,
      status: status,
      myAnimeListId: myAnimeListId,
      coverImage: coverImage,
      genres: genres,
      episodes: episodes,
      currentEpisode: currentEpisode,
      rating: rating,
      notes: notes,
      startedAt: startedAt,
      completedAt: completedAt,
      order: order,
      visible: visible,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  AnimeModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    AnimeStatus? status,
    String? myAnimeListId,
    String? coverImage,
    List<String>? genres,
    int? episodes,
    int? currentEpisode,
    double? rating,
    String? notes,
    DateTime? startedAt,
    DateTime? completedAt,
    int? order,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AnimeModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      myAnimeListId: myAnimeListId ?? this.myAnimeListId,
      coverImage: coverImage ?? this.coverImage,
      genres: genres ?? this.genres,
      episodes: episodes ?? this.episodes,
      currentEpisode: currentEpisode ?? this.currentEpisode,
      rating: rating ?? this.rating,
      notes: notes ?? this.notes,
      startedAt: startedAt ?? this.startedAt,
      completedAt: completedAt ?? this.completedAt,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
