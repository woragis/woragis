// Experience Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/experience_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class ExperienceQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<List<ExperienceEntity>> getExperienceList({
    int? page,
    int? limit,
    String? company,
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl<GetExperienceListUseCase>();
    final result = await useCase(GetExperienceListParams(
      page: page,
      limit: limit,
      company: company,
      visible: visible,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    ));
    return result.fold(
      (failure) => throw Exception(failure.message),
      (experiences) => experiences,
    );
  }

  // TODO: Add more query methods as use cases are implemented
  // static Future<ExperienceEntity> getExperienceById(String id) async { ... }
  // static Future<ExperienceEntity> createExperience(CreateExperienceParams params) async { ... }
  // static Future<ExperienceEntity> updateExperience(UpdateExperienceParams params) async { ... }
  // static Future<void> deleteExperience(String id) async { ... }
  // static Future<void> updateExperienceOrder(List<Map<String, dynamic>> orders) async { ... }
}
