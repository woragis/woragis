import 'package:equatable/equatable.dart';
import 'blog_tag_entity.dart';

class BlogTagWithCountEntity extends Equatable {
  final BlogTagEntity tag;
  final int postCount;

  const BlogTagWithCountEntity({
    required this.tag,
    required this.postCount,
  });

  @override
  List<Object?> get props => [tag, postCount];

  BlogTagWithCountEntity copyWith({
    BlogTagEntity? tag,
    int? postCount,
  }) {
    return BlogTagWithCountEntity(
      tag: tag ?? this.tag,
      postCount: postCount ?? this.postCount,
    );
  }
}

