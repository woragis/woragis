import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/framework_entity.dart';

part 'framework_model.g.dart';

enum FrameworkTypeModel {
  @JsonValue('language')
  language,
  @JsonValue('framework')
  framework,
  @JsonValue('library')
  library,
  @JsonValue('tool')
  tool,
  @JsonValue('database')
  database,
  @JsonValue('other')
  other,
}

enum ProficiencyLevelModel {
  @JsonValue('beginner')
  beginner,
  @JsonValue('intermediate')
  intermediate,
  @JsonValue('advanced')
  advanced,
  @JsonValue('expert')
  expert,
}

@JsonSerializable()
class FrameworkModel extends FrameworkEntity {
  const FrameworkModel({
    required super.id,
    required super.userId,
    required super.name,
    required super.slug,
    super.description,
    super.icon,
    super.color,
    required super.type,
    super.proficiencyLevel,
    required super.visible,
    required super.public,
    required super.order,
    required super.createdAt,
    required super.updatedAt,
  });

  factory FrameworkModel.fromJson(Map<String, dynamic> json) =>
      _$FrameworkModelFromJson(json);

  Map<String, dynamic> toJson() => _$FrameworkModelToJson(this);

  factory FrameworkModel.fromEntity(FrameworkEntity entity) {
    return FrameworkModel(
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      icon: entity.icon,
      color: entity.color,
      type: entity.type,
      proficiencyLevel: entity.proficiencyLevel,
      visible: entity.visible,
      public: entity.public,
      order: entity.order,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  FrameworkEntity toEntity() {
    return FrameworkEntity(
      id: id,
      userId: userId,
      name: name,
      slug: slug,
      description: description,
      icon: icon,
      color: color,
      type: type,
      proficiencyLevel: proficiencyLevel,
      visible: visible,
      public: public,
      order: order,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  FrameworkModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? slug,
    String? description,
    String? icon,
    String? color,
    FrameworkType? type,
    ProficiencyLevel? proficiencyLevel,
    bool? visible,
    bool? public,
    int? order,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return FrameworkModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      icon: icon ?? this.icon,
      color: color ?? this.color,
      type: type ?? this.type,
      proficiencyLevel: proficiencyLevel ?? this.proficiencyLevel,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      order: order ?? this.order,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
