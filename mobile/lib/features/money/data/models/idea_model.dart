import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/idea_entity.dart';

part 'idea_model.g.dart';

@JsonSerializable()
class IdeaModel extends IdeaEntity {
  const IdeaModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.slug,
    required super.document,
    super.description,
    required super.featured,
    required super.visible,
    required super.public,
    required super.order,
    required super.createdAt,
    required super.updatedAt,
  });

  factory IdeaModel.fromJson(Map<String, dynamic> json) =>
      _$IdeaModelFromJson(json);

  Map<String, dynamic> toJson() => _$IdeaModelToJson(this);

  factory IdeaModel.fromEntity(IdeaEntity entity) {
    return IdeaModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      slug: entity.slug,
      document: entity.document,
      description: entity.description,
      featured: entity.featured,
      visible: entity.visible,
      public: entity.public,
      order: entity.order,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  IdeaEntity toEntity() {
    return IdeaEntity(
      id: id,
      userId: userId,
      title: title,
      slug: slug,
      document: document,
      description: description,
      featured: featured,
      visible: visible,
      public: public,
      order: order,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  IdeaModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? slug,
    String? document,
    String? description,
    bool? featured,
    bool? visible,
    bool? public,
    int? order,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return IdeaModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      slug: slug ?? this.slug,
      document: document ?? this.document,
      description: description ?? this.description,
      featured: featured ?? this.featured,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      order: order ?? this.order,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
