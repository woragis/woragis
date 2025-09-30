import '../../domain/entities/education_entity.dart';
import '../../domain/usecases/get_education_list_usecase.dart';
import '../../../../core/injection/injection_container.dart' as sl;

class EducationQueries {
  static Future<List<EducationEntity>> getEducationList({
    int? page,
    int? limit,
    String? type,
    String? institution,
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl.sl<GetEducationListUseCase>();
    final params = GetEducationListParams(
      page: page,
      limit: limit,
      type: type,
      institution: institution,
      visible: visible,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    );
    
    final result = await useCase(params);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (educationList) => educationList,
    );
  }

  static Future<List<EducationEntity>> getAllEducation() async {
    return getEducationList(limit: 1000);
  }

  static Future<List<EducationEntity>> getVisibleEducation() async {
    return getEducationList(visible: true);
  }

  static Future<List<EducationEntity>> getEducationByType(String type) async {
    return getEducationList(type: type);
  }

  static Future<List<EducationEntity>> getEducationByInstitution(String institution) async {
    return getEducationList(institution: institution);
  }

  static Future<List<EducationEntity>> searchEducation(String query) async {
    return getEducationList(search: query);
  }

  static Future<List<EducationEntity>> getDegrees() async {
    return getEducationList(type: 'degree');
  }

  static Future<List<EducationEntity>> getCertificates() async {
    return getEducationList(type: 'certificate');
  }

  static Future<List<EducationEntity>> getCourses() async {
    return getEducationList(type: 'course');
  }
}
