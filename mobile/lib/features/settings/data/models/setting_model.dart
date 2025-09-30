import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/setting_entity.dart';

part 'setting_model.g.dart';

@JsonSerializable()
class SettingModel extends SettingEntity {
  const SettingModel({
    required super.id,
    required super.userId,
    required super.key,
    required super.value,
    super.description,
    super.category,
    required super.isPublic,
    required super.createdAt,
    required super.updatedAt,
  });

  factory SettingModel.fromJson(Map<String, dynamic> json) =>
      _$SettingModelFromJson(json);

  Map<String, dynamic> toJson() => _$SettingModelToJson(this);

  factory SettingModel.fromEntity(SettingEntity entity) {
    return SettingModel(
      id: entity.id,
      userId: entity.userId,
      key: entity.key,
      value: entity.value,
      description: entity.description,
      category: entity.category,
      isPublic: entity.isPublic,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  SettingEntity toEntity() {
    return SettingEntity(
      id: id,
      userId: userId,
      key: key,
      value: value,
      description: description,
      category: category,
      isPublic: isPublic,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  SettingModel copyWith({
    String? id,
    String? userId,
    String? key,
    String? value,
    String? description,
    String? category,
    bool? isPublic,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return SettingModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      key: key ?? this.key,
      value: value ?? this.value,
      description: description ?? this.description,
      category: category ?? this.category,
      isPublic: isPublic ?? this.isPublic,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
