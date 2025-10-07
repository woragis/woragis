import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/blog_tag_with_count_entity.dart';
import '../../domain/entities/blog_tag_entity.dart';
import 'blog_tag_model.dart';

part 'blog_tag_with_count_model.g.dart';

@JsonSerializable()
class BlogTagWithCountModel extends BlogTagWithCountEntity {
  @override
  final BlogTagModel tag;

  const BlogTagWithCountModel({
    required this.tag,
    required super.postCount,
  }) : super(tag: tag);

  factory BlogTagWithCountModel.fromJson(Map<String, dynamic> json) =>
      _$BlogTagWithCountModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogTagWithCountModelToJson(this);

  factory BlogTagWithCountModel.fromEntity(BlogTagWithCountEntity entity) {
    return BlogTagWithCountModel(
      tag: BlogTagModel.fromEntity(entity.tag),
      postCount: entity.postCount,
    );
  }

  BlogTagWithCountEntity toEntity() {
    return BlogTagWithCountEntity(
      tag: tag.toEntity(),
      postCount: postCount,
    );
  }

  @override
  BlogTagWithCountEntity copyWith({
    covariant BlogTagEntity? tag,
    int? postCount,
  }) {
    return BlogTagWithCountModel(
      tag: tag != null ? BlogTagModel.fromEntity(tag) : this.tag,
      postCount: postCount ?? this.postCount,
    );
  }
}

