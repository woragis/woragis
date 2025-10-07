import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/blog_stats_entity.dart';

part 'blog_stats_model.g.dart';

@JsonSerializable()
class BlogStatsModel extends BlogStatsEntity {
  const BlogStatsModel({
    required super.total,
    required super.published,
    required super.totalViews,
    super.totalLikes,
    super.featuredCount,
  });

  factory BlogStatsModel.fromJson(Map<String, dynamic> json) =>
      _$BlogStatsModelFromJson(json);

  Map<String, dynamic> toJson() => _$BlogStatsModelToJson(this);

  factory BlogStatsModel.fromEntity(BlogStatsEntity entity) {
    return BlogStatsModel(
      total: entity.total,
      published: entity.published,
      totalViews: entity.totalViews,
      totalLikes: entity.totalLikes,
      featuredCount: entity.featuredCount,
    );
  }

  BlogStatsEntity toEntity() {
    return BlogStatsEntity(
      total: total,
      published: published,
      totalViews: totalViews,
      totalLikes: totalLikes,
      featuredCount: featuredCount,
    );
  }

  @override
  BlogStatsModel copyWith({
    int? total,
    int? published,
    int? totalViews,
    int? totalLikes,
    int? featuredCount,
  }) {
    return BlogStatsModel(
      total: total ?? this.total,
      published: published ?? this.published,
      totalViews: totalViews ?? this.totalViews,
      totalLikes: totalLikes ?? this.totalLikes,
      featuredCount: featuredCount ?? this.featuredCount,
    );
  }
}

