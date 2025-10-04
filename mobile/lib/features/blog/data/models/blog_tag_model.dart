import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/blog_tag_entity.dart';

part 'blog_tag_model.g.dart';

@JsonSerializable()
class BlogTagModel extends BlogTagEntity {
  const BlogTagModel({
    required super.id,
    required super.userId,
    required super.name,
    required super.slug,
    super.description,
    super.color,
    required super.visible,
    required super.order,
    required super.createdAt,
    required super.updatedAt,
  });

  factory BlogTagModel.fromJson(Map<String, dynamic> json) =>
      _$BlogTagModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogTagModelToJson(this);

  factory BlogTagModel.fromEntity(BlogTagEntity entity) {
    return BlogTagModel(
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      color: entity.color,
      visible: entity.visible,
      order: entity.order,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  BlogTagEntity toEntity() {
    return BlogTagEntity(
      id: id,
      userId: userId,
      name: name,
      slug: slug,
      description: description,
      color: color,
      visible: visible,
      order: order,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  BlogTagModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? slug,
    String? description,
    String? color,
    bool? visible,
    int? order,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BlogTagModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      color: color ?? this.color,
      visible: visible ?? this.visible,
      order: order ?? this.order,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
