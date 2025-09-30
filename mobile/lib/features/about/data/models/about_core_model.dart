import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/about_core_entity.dart';

part 'about_core_model.g.dart';

@JsonSerializable()
class AboutCoreModel extends AboutCoreEntity {
  const AboutCoreModel({
    required super.id,
    required super.userId,
    required super.name,
    super.currentProfessionId,
    super.biography,
    super.featuredBiography,
    required super.visible,
    required super.createdAt,
    required super.updatedAt,
  });

  factory AboutCoreModel.fromJson(Map<String, dynamic> json) =>
      _$AboutCoreModelFromJson(json);

  Map<String, dynamic> toJson() => _$AboutCoreModelToJson(this);

  factory AboutCoreModel.fromEntity(AboutCoreEntity entity) {
    return AboutCoreModel(
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      currentProfessionId: entity.currentProfessionId,
      biography: entity.biography,
      featuredBiography: entity.featuredBiography,
      visible: entity.visible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  AboutCoreEntity toEntity() {
    return AboutCoreEntity(
      id: id,
      userId: userId,
      name: name,
      currentProfessionId: currentProfessionId,
      biography: biography,
      featuredBiography: featuredBiography,
      visible: visible,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  AboutCoreModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AboutCoreModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      currentProfessionId: currentProfessionId ?? this.currentProfessionId,
      biography: biography ?? this.biography,
      featuredBiography: featuredBiography ?? this.featuredBiography,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
