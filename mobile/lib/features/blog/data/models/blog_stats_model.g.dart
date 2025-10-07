// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_stats_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogStatsModel _$BlogStatsModelFromJson(Map<String, dynamic> json) =>
    BlogStatsModel(
      total: (json['total'] as num).toInt(),
      published: (json['published'] as num).toInt(),
      totalViews: (json['totalViews'] as num).toInt(),
      totalLikes: (json['totalLikes'] as num?)?.toInt(),
      featuredCount: (json['featuredCount'] as num?)?.toInt(),
    );

Map<String, dynamic> _$BlogStatsModelToJson(BlogStatsModel instance) =>
    <String, dynamic>{
      'total': instance.total,
      'published': instance.published,
      'totalViews': instance.totalViews,
      'totalLikes': instance.totalLikes,
      'featuredCount': instance.featuredCount,
    };
