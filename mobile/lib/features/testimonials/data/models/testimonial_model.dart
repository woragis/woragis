import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/testimonial_entity.dart';

part 'testimonial_model.g.dart';

@JsonSerializable()
class TestimonialModel extends TestimonialEntity {
  const TestimonialModel({
    required super.id,
    required super.userId,
    required super.name,
    required super.position,
    required super.company,
    required super.content,
    super.avatar,
    required super.rating,
    required super.featured,
    required super.order,
    required super.visible,
    required super.public,
    required super.createdAt,
    required super.updatedAt,
  });

  factory TestimonialModel.fromJson(Map<String, dynamic> json) =>
      _$TestimonialModelFromJson(json);

  Map<String, dynamic> toJson() => _$TestimonialModelToJson(this);

  factory TestimonialModel.fromEntity(TestimonialEntity entity) {
    return TestimonialModel(
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      position: entity.position,
      company: entity.company,
      content: entity.content,
      avatar: entity.avatar,
      rating: entity.rating,
      featured: entity.featured,
      order: entity.order,
      visible: entity.visible,
      public: entity.public,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  TestimonialEntity toEntity() {
    return TestimonialEntity(
      id: id,
      userId: userId,
      name: name,
      position: position,
      company: company,
      content: content,
      avatar: avatar,
      rating: rating,
      featured: featured,
      order: order,
      visible: visible,
      public: public,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  TestimonialModel copyWith({
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
    return TestimonialModel(
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
