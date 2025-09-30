import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/project_entity.dart';
import '../repositories/projects_repository.dart';

class GetProjectsUseCase {
  final ProjectsRepository repository;

  GetProjectsUseCase(this.repository);

  Future<Either<Failure, List<ProjectEntity>>> call(GetProjectsParams params) async {
    return await repository.getProjects(
      page: params.page,
      limit: params.limit,
      featured: params.featured,
      visible: params.visible,
      public: params.public,
      technologies: params.technologies,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    );
  }
}

class GetProjectsParams {
  final int? page;
  final int? limit;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final List<String>? technologies;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetProjectsParams({
    this.page,
    this.limit,
    this.featured,
    this.visible,
    this.public,
    this.technologies,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
