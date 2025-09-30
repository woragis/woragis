import 'package:equatable/equatable.dart';
import '../../../frameworks/domain/entities/framework_entity.dart';

class ProjectEntity extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String slug;
  final String description;
  final String? longDescription;
  final String? content;
  final String? videoUrl;
  final String image;
  final String? githubUrl;
  final String? liveUrl;
  final bool featured;
  final int order;
  final bool visible;
  final bool public;
  final List<FrameworkEntity>? frameworks;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ProjectEntity({
    required this.id,
    required this.userId,
    required this.title,
    required this.slug,
    required this.description,
    this.longDescription,
    this.content,
    this.videoUrl,
    required this.image,
    this.githubUrl,
    this.liveUrl,
    required this.featured,
    required this.order,
    required this.visible,
    required this.public,
    this.frameworks,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        title,
        slug,
        description,
        longDescription,
        content,
        videoUrl,
        image,
        githubUrl,
        liveUrl,
        featured,
        order,
        visible,
        public,
        frameworks,
        createdAt,
        updatedAt,
      ];

  ProjectEntity copyWith({
    String? id,
    String? userId,
    String? title,
    String? slug,
    String? description,
    String? longDescription,
    String? content,
    String? videoUrl,
    String? image,
    String? githubUrl,
    String? liveUrl,
    bool? featured,
    int? order,
    bool? visible,
    bool? public,
    List<FrameworkEntity>? frameworks,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ProjectEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      longDescription: longDescription ?? this.longDescription,
      content: content ?? this.content,
      videoUrl: videoUrl ?? this.videoUrl,
      image: image ?? this.image,
      githubUrl: githubUrl ?? this.githubUrl,
      liveUrl: liveUrl ?? this.liveUrl,
      featured: featured ?? this.featured,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      frameworks: frameworks ?? this.frameworks,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
