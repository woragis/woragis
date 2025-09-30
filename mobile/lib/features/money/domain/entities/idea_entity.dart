import 'package:equatable/equatable.dart';

class IdeaEntity extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String slug;
  final String document;
  final String? description;
  final bool featured;
  final bool visible;
  final bool public;
  final int order;
  final DateTime createdAt;
  final DateTime updatedAt;

  const IdeaEntity({
    required this.id,
    required this.userId,
    required this.title,
    required this.slug,
    required this.document,
    this.description,
    required this.featured,
    required this.visible,
    required this.public,
    required this.order,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        title,
        slug,
        document,
        description,
        featured,
        visible,
        public,
        order,
        createdAt,
        updatedAt,
      ];

  IdeaEntity copyWith({
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
    return IdeaEntity(
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
