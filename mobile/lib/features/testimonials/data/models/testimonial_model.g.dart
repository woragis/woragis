// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonial_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TestimonialModel _$TestimonialModelFromJson(Map<String, dynamic> json) =>
    TestimonialModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      position: json['position'] as String,
      company: json['company'] as String,
      content: json['content'] as String,
      avatar: json['avatar'] as String?,
      rating: (json['rating'] as num).toInt(),
      featured: json['featured'] as bool,
      order: (json['order'] as num).toInt(),
      visible: json['visible'] as bool,
      public: json['public'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$TestimonialModelToJson(TestimonialModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'position': instance.position,
      'company': instance.company,
      'content': instance.content,
      'avatar': instance.avatar,
      'rating': instance.rating,
      'featured': instance.featured,
      'order': instance.order,
      'visible': instance.visible,
      'public': instance.public,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
