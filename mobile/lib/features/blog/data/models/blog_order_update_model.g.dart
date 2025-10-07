// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_order_update_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogPostOrderUpdateModel _$BlogPostOrderUpdateModelFromJson(
  Map<String, dynamic> json,
) => BlogPostOrderUpdateModel(
  id: json['id'] as String,
  order: (json['order'] as num).toInt(),
);

Map<String, dynamic> _$BlogPostOrderUpdateModelToJson(
  BlogPostOrderUpdateModel instance,
) => <String, dynamic>{'id': instance.id, 'order': instance.order};

BlogTagOrderUpdateModel _$BlogTagOrderUpdateModelFromJson(
  Map<String, dynamic> json,
) => BlogTagOrderUpdateModel(
  id: json['id'] as String,
  order: (json['order'] as num).toInt(),
);

Map<String, dynamic> _$BlogTagOrderUpdateModelToJson(
  BlogTagOrderUpdateModel instance,
) => <String, dynamic>{'id': instance.id, 'order': instance.order};
