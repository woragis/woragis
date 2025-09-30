import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/experience_entity.dart';

part 'experience_model.g.dart';

@JsonSerializable()
class ExperienceModel extends ExperienceEntity {
  const ExperienceModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.company,
    required super.period,
    required super.location,
    required super.description,
    required super.achievements,
    required super.technologies,
    required super.icon,
    required super.order,
    required super.visible,
    required super.createdAt,
    required super.updatedAt,
  });

  factory ExperienceModel.fromJson(Map<String, dynamic> json) =>
      _$ExperienceModelFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceModelToJson(this);

  factory ExperienceModel.fromEntity(ExperienceEntity entity) {
    return ExperienceModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      company: entity.company,
      period: entity.period,
      location: entity.location,
      description: entity.description,
      achievements: entity.achievements,
      technologies: entity.technologies,
      icon: entity.icon,
      order: entity.order,
      visible: entity.visible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  ExperienceEntity toEntity() {
    return ExperienceEntity(
      id: id,
      userId: userId,
      title: title,
      company: company,
      period: period,
      location: location,
      description: description,
      achievements: achievements,
      technologies: technologies,
      icon: icon,
      order: order,
      visible: visible,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  ExperienceModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? company,
    String? period,
    String? location,
    String? description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    int? order,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ExperienceModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      company: company ?? this.company,
      period: period ?? this.period,
      location: location ?? this.location,
      description: description ?? this.description,
      achievements: achievements ?? this.achievements,
      technologies: technologies ?? this.technologies,
      icon: icon ?? this.icon,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
