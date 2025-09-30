import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/project_entity.dart';
import '../repositories/projects_repository.dart';

class UpdateProjectUseCase {
  final ProjectsRepository repository;

  UpdateProjectUseCase(this.repository);

  Future<Either<Failure, ProjectEntity>> call({
    required String id,
    String? title,
    String? slug,
    String? description,
    String? longDescription,
    String? content,
    String? videoUrl,
    String? image,
    String? githubUrl,
    String? liveUrl,
    List<String>? frameworkIds,
    bool? featured,
    int? order,
    bool? visible,
    bool? public,
  }) async {
    return await repository.updateProject(
      id: id,
      title: title,
      slug: slug,
      description: description,
      longDescription: longDescription,
      content: content,
      videoUrl: videoUrl,
      image: image,
      githubUrl: githubUrl,
      liveUrl: liveUrl,
      frameworkIds: frameworkIds,
      featured: featured,
      order: order,
      visible: visible,
      public: public,
    );
  }
}
