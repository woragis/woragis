import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/biography_entity.dart';

part 'biography_model.g.dart';

@JsonSerializable()
class BiographyModel extends BiographyEntity {
  const BiographyModel({
    required super.id,
    required super.userId,
    super.featuredBiography,
    super.fullBiography,
    required super.visible,
    required super.createdAt,
    required super.updatedAt,
  });

  factory BiographyModel.fromJson(Map<String, dynamic> json) =>
      _$BiographyModelFromJson(json);

  Map<String, dynamic> toJson() => _$BiographyModelToJson(this);

  factory BiographyModel.fromEntity(BiographyEntity entity) {
    return BiographyModel(
      id: entity.id,
      userId: entity.userId,
      featuredBiography: entity.featuredBiography,
      fullBiography: entity.fullBiography,
      visible: entity.visible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  BiographyEntity toEntity() {
    return BiographyEntity(
      id: id,
      userId: userId,
      featuredBiography: featuredBiography,
      fullBiography: fullBiography,
      visible: visible,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  BiographyModel copyWith({
    String? id,
    String? userId,
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BiographyModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      featuredBiography: featuredBiography ?? this.featuredBiography,
      fullBiography: fullBiography ?? this.fullBiography,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
