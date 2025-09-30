import 'package:equatable/equatable.dart';

class BlogTagEntity extends Equatable {
  final String id;
  final String name;
  final String slug;
  final String? description;
  final String? color;
  final int? postCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BlogTagEntity({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.color,
    this.postCount,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        slug,
        description,
        color,
        postCount,
        createdAt,
        updatedAt,
      ];

  BlogTagEntity copyWith({
    String? id,
    String? name,
    String? slug,
    String? description,
    String? color,
    int? postCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BlogTagEntity(
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
