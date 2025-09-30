import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/project_entity.dart';
import '../repositories/projects_repository.dart';

class CreateProjectUseCase {
  final ProjectsRepository repository;

  CreateProjectUseCase(this.repository);

  Future<Either<Failure, ProjectEntity>> call(CreateProjectParams params) async {
    return await repository.createProject(
      title: params.title,
      slug: params.slug,
      description: params.description,
      longDescription: params.longDescription,
      content: params.content,
      videoUrl: params.videoUrl,
      image: params.image,
      githubUrl: params.githubUrl,
      liveUrl: params.liveUrl,
      featured: params.featured,
      order: params.order,
      visible: params.visible,
      public: params.public,
      frameworkIds: params.frameworkIds,
    );
  }
}

class CreateProjectParams {
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
  final List<String>? frameworkIds;

  CreateProjectParams({
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
    this.frameworkIds,
  });
}
