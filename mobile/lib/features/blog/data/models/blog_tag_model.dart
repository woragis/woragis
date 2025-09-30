import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/blog_tag_entity.dart';

part 'blog_tag_model.g.dart';

@JsonSerializable()
class BlogTagModel extends BlogTagEntity {
  const BlogTagModel({
    required super.id,
    required super.name,
    required super.slug,
    super.description,
    super.color,
    super.postCount,
    required super.createdAt,
    required super.updatedAt,
  });

  factory BlogTagModel.fromJson(Map<String, dynamic> json) =>
      _$BlogTagModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogTagModelToJson(this);

  factory BlogTagModel.fromEntity(BlogTagEntity entity) {
    return BlogTagModel(
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      color: entity.color,
      postCount: entity.postCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  BlogTagEntity toEntity() {
    return BlogTagEntity(
      id: id,
      name: name,
      slug: slug,
      description: description,
      color: color,
      postCount: postCount,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  BlogTagModel copyWith({
    String? id,
    String? name,
    String? slug,
    String? description,
    String? color,
    int? postCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BlogTagModel(
      id: id ?? this.id,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      color: color ?? this.color,
      postCount: postCount ?? this.postCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
