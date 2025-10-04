import 'package:equatable/equatable.dart';

class BlogTagEntity extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String slug;
  final String? description;
  final String? color;
  final bool visible;
  final int order;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BlogTagEntity({
    required this.id,
    required this.userId,
    required this.name,
    required this.slug,
    this.description,
    this.color,
    required this.visible,
    required this.order,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        slug,
        description,
        color,
        visible,
        order,
        createdAt,
        updatedAt,
      ];

  BlogTagEntity copyWith({
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
    return BlogTagEntity(
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
