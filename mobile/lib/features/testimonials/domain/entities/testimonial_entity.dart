import 'package:equatable/equatable.dart';

class TestimonialEntity extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String position;
  final String company;
  final String content;
  final String? avatar;
  final int rating;
  final bool featured;
  final int order;
  final bool visible;
  final bool public;
  final DateTime createdAt;
  final DateTime updatedAt;

  const TestimonialEntity({
    required this.id,
    required this.userId,
    required this.name,
    required this.position,
    required this.company,
    required this.content,
    this.avatar,
    required this.rating,
    required this.featured,
    required this.order,
    required this.visible,
    required this.public,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        position,
        company,
        content,
        avatar,
        rating,
        featured,
        order,
        visible,
        public,
        createdAt,
        updatedAt,
      ];

  TestimonialEntity copyWith({
    String? id,
    String? userId,
    String? name,
    String? position,
    String? company,
    String? content,
    String? avatar,
    int? rating,
    bool? featured,
    int? order,
    bool? visible,
    bool? public,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return TestimonialEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      position: position ?? this.position,
      company: company ?? this.company,
      content: content ?? this.content,
      avatar: avatar ?? this.avatar,
      rating: rating ?? this.rating,
      featured: featured ?? this.featured,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
