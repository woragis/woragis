import 'package:equatable/equatable.dart';

class BlogStatsEntity extends Equatable {
  final int total;
  final int published;
  final int totalViews;
  final int? totalLikes;
  final int? featuredCount;

  const BlogStatsEntity({
    required this.total,
    required this.published,
    required this.totalViews,
    this.totalLikes,
    this.featuredCount,
  });

  @override
  List<Object?> get props => [
        total,
        published,
        totalViews,
        totalLikes,
        featuredCount,
      ];

  BlogStatsEntity copyWith({
    int? total,
    int? published,
    int? totalViews,
    int? totalLikes,
    int? featuredCount,
  }) {
    return BlogStatsEntity(
      total: total ?? this.total,
      published: published ?? this.published,
      totalViews: totalViews ?? this.totalViews,
      totalLikes: totalLikes ?? this.totalLikes,
      featuredCount: featuredCount ?? this.featuredCount,
    );
  }
}

