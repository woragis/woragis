import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/blog_order_update_entity.dart';

part 'blog_order_update_model.g.dart';

@JsonSerializable()
class BlogPostOrderUpdateModel extends BlogPostOrderUpdateEntity {
  const BlogPostOrderUpdateModel({
    required super.id,
    required super.order,
  });

  factory BlogPostOrderUpdateModel.fromJson(Map<String, dynamic> json) =>
      _$BlogPostOrderUpdateModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogPostOrderUpdateModelToJson(this);

  factory BlogPostOrderUpdateModel.fromEntity(BlogPostOrderUpdateEntity entity) {
    return BlogPostOrderUpdateModel(
      id: entity.id,
      order: entity.order,
    );
  }

  BlogPostOrderUpdateEntity toEntity() {
    return BlogPostOrderUpdateEntity(
      id: id,
      order: order,
    );
  }

  @override
  BlogPostOrderUpdateModel copyWith({
    String? id,
    int? order,
  }) {
    return BlogPostOrderUpdateModel(
      id: id ?? this.id,
      order: order ?? this.order,
    );
  }
}

@JsonSerializable()
class BlogTagOrderUpdateModel extends BlogTagOrderUpdateEntity {
  const BlogTagOrderUpdateModel({
    required super.id,
    required super.order,
  });

  factory BlogTagOrderUpdateModel.fromJson(Map<String, dynamic> json) =>
      _$BlogTagOrderUpdateModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogTagOrderUpdateModelToJson(this);

  factory BlogTagOrderUpdateModel.fromEntity(BlogTagOrderUpdateEntity entity) {
    return BlogTagOrderUpdateModel(
      id: entity.id,
      order: entity.order,
    );
  }

  BlogTagOrderUpdateEntity toEntity() {
    return BlogTagOrderUpdateEntity(
      id: id,
      order: order,
    );
  }

  @override
  BlogTagOrderUpdateModel copyWith({
    String? id,
    int? order,
  }) {
    return BlogTagOrderUpdateModel(
      id: id ?? this.id,
      order: order ?? this.order,
    );
  }
}

