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

  // Custom methods for API (camelCase) and Local Storage (snake_case) conversion
  factory IdeaModel.fromApiJson(Map<String, dynamic> json) {
    return IdeaModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      title: json['title'] as String,
      slug: json['slug'] as String,
      document: json['document'] as String,
      description: json['description'] as String?,
      featured: json['featured'] as bool,
      visible: json['visible'] as bool,
      public: json['public'] as bool,
      order: (json['order'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toApiJson() {
    return {
      'id': id,
      'userId': userId,
      'title': title,
      'slug': slug,
      'document': document,
      'description': description,
      'featured': featured,
      'visible': visible,
      'public': public,
      'order': order,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory IdeaModel.fromLocalJson(Map<String, dynamic> json) {
    return IdeaModel(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      title: json['title'] as String,
      slug: json['slug'] as String,
      document: json['document'] as String,
      description: json['description'] as String?,
      featured: (json['featured'] as int) == 1,
      visible: (json['visible'] as int) == 1,
      public: (json['public'] as int) == 1,
      order: json['order'] as int,
      createdAt: DateTime.fromMillisecondsSinceEpoch(json['created_at'] as int),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(json['updated_at'] as int),
    );
  }

  Map<String, dynamic> toLocalJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'slug': slug,
      'document': document,
      'description': description,
      'featured': featured ? 1 : 0,
      'visible': visible ? 1 : 0,
      'public': public ? 1 : 0,
      'order': order,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

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
