// Projects Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/project_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class ProjectsQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<List<ProjectEntity>> getProjects({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    List<String>? technologies,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl<GetProjectsUseCase>();
    final result = await useCase(GetProjectsParams(
      page: page,
      limit: limit,
      featured: featured,
      visible: visible,
      public: public,
      technologies: technologies,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    ));
    return result.fold(
      (failure) => throw Exception(failure.message),
      (projects) => projects,
    );
  }

  // TODO: Add more query methods as use cases are implemented
  // static Future<ProjectEntity> getProjectById(String id) async { ... }
  // static Future<ProjectEntity> createProject(CreateProjectParams params) async { ... }
  // static Future<ProjectEntity> updateProject(UpdateProjectParams params) async { ... }
  // static Future<void> deleteProject(String id) async { ... }
  // static Future<void> updateProjectOrder(List<Map<String, dynamic>> orders) async { ... }
  // static Future<void> incrementViewCount(String projectId) async { ... }
  // static Future<void> incrementLikeCount(String projectId) async { ... }
}
