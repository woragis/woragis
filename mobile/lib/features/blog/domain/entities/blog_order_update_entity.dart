import 'package:equatable/equatable.dart';

class BlogPostOrderUpdateEntity extends Equatable {
  final String id;
  final int order;

  const BlogPostOrderUpdateEntity({
    required this.id,
    required this.order,
  });

  @override
  List<Object?> get props => [id, order];

  BlogPostOrderUpdateEntity copyWith({
    String? id,
    int? order,
  }) {
    return BlogPostOrderUpdateEntity(
      id: id ?? this.id,
      order: order ?? this.order,
    );
  }
}

class BlogTagOrderUpdateEntity extends Equatable {
  final String id;
  final int order;

  const BlogTagOrderUpdateEntity({
    required this.id,
    required this.order,
  });

  @override
  List<Object?> get props => [id, order];

  BlogTagOrderUpdateEntity copyWith({
    String? id,
    int? order,
  }) {
    return BlogTagOrderUpdateEntity(
      id: id ?? this.id,
      order: order ?? this.order,
    );
  }
}

