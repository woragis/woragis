import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/project_entity.dart';
import '../../../frameworks/data/models/framework_model.dart';

part 'project_model.g.dart';

@JsonSerializable(explicitToJson: true)
class ProjectModel extends ProjectEntity {
  @override
  final List<FrameworkModel>? frameworks;

  const ProjectModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.slug,
    required super.description,
    super.longDescription,
    super.content,
    super.videoUrl,
    required super.image,
    super.githubUrl,
    super.liveUrl,
    required super.featured,
    required super.order,
    required super.visible,
    required super.public,
    this.frameworks,
    required super.createdAt,
    required super.updatedAt,
  }) : super(frameworks: frameworks);

  factory ProjectModel.fromJson(Map<String, dynamic> json) =>
      _$ProjectModelFromJson(json);

  Map<String, dynamic> toJson() => _$ProjectModelToJson(this);

  factory ProjectModel.fromEntity(ProjectEntity entity) {
    return ProjectModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      longDescription: entity.longDescription,
      content: entity.content,
      videoUrl: entity.videoUrl,
      image: entity.image,
      githubUrl: entity.githubUrl,
      liveUrl: entity.liveUrl,
      featured: entity.featured,
      order: entity.order,
      visible: entity.visible,
      public: entity.public,
      frameworks: entity.frameworks?.map<FrameworkModel>((fw) => FrameworkModel.fromEntity(fw)).toList(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  ProjectEntity toEntity() {
    return ProjectEntity(
      id: id,
      userId: userId,
      title: title,
      slug: slug,
      description: description,
      longDescription: longDescription,
      content: content,
      videoUrl: videoUrl,
      image: image,
      githubUrl: githubUrl,
      liveUrl: liveUrl,
      featured: featured,
      order: order,
      visible: visible,
      public: public,
      frameworks: frameworks?.map((fw) => fw.toEntity()).toList(),
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  ProjectModel copyWith({
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
    covariant List<FrameworkModel>? frameworks,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ProjectModel(
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
