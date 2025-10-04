import '../../domain/entities/framework_entity.dart';
import '../../domain/usecases/get_frameworks_usecase.dart';
import '../../../../core/injection/injection_container.dart' as sl;

class FrameworksQueries {
  static Future<List<FrameworkEntity>> getFrameworks({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? type,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl.sl<GetFrameworksUseCase>();
    final params = GetFrameworksParams(
      page: page,
      limit: limit,
      visible: visible,
      public: public,
      type: type,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    );
    
    final result = await useCase(params);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (frameworks) => frameworks,
    );
  }

  static Future<List<FrameworkEntity>> getAllFrameworks() async {
    return getFrameworks(limit: 1000);
  }

  static Future<List<FrameworkEntity>> getVisibleFrameworks() async {
    return getFrameworks(visible: true);
  }

  static Future<List<FrameworkEntity>> getPublicFrameworks() async {
    return getFrameworks(public: true);
  }

  static Future<List<FrameworkEntity>> getFrameworksByType(String type) async {
    return getFrameworks(type: type);
  }

  static Future<List<FrameworkEntity>> searchFrameworks(String query) async {
    return getFrameworks(search: query);
  }
}
