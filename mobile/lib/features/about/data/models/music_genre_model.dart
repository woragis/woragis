import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/music_genre_entity.dart';

part 'music_genre_model.g.dart';

@JsonSerializable()
class MusicGenreModel extends MusicGenreEntity {
  const MusicGenreModel({
    required super.id,
    required super.userId,
    required super.name,
    super.description,
    required super.order,
    required super.visible,
    required super.createdAt,
    required super.updatedAt,
  });

  factory MusicGenreModel.fromJson(Map<String, dynamic> json) =>
      _$MusicGenreModelFromJson(json);

  Map<String, dynamic> toJson() => _$MusicGenreModelToJson(this);

  factory MusicGenreModel.fromEntity(MusicGenreEntity entity) {
    return MusicGenreModel(
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      order: entity.order,
      visible: entity.visible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  MusicGenreEntity toEntity() {
    return MusicGenreEntity(
      id: id,
      userId: userId,
      name: name,
      description: description,
      order: order,
      visible: visible,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  MusicGenreModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? description,
    int? order,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return MusicGenreModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      description: description ?? this.description,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
