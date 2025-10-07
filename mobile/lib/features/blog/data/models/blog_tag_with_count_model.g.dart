// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_tag_with_count_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogTagWithCountModel _$BlogTagWithCountModelFromJson(
  Map<String, dynamic> json,
) => BlogTagWithCountModel(
  tag: BlogTagModel.fromJson(json['tag'] as Map<String, dynamic>),
  postCount: (json['postCount'] as num).toInt(),
);

Map<String, dynamic> _$BlogTagWithCountModelToJson(
  BlogTagWithCountModel instance,
) => <String, dynamic>{'postCount': instance.postCount, 'tag': instance.tag};
