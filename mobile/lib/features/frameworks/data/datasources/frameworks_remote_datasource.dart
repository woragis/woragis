import '../../domain/entities/framework_entity.dart';

abstract class FrameworksRemoteDataSource {
  Future<List<FrameworkEntity>> getFrameworks({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? type,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<FrameworkEntity> getFrameworkById(String id);
  Future<FrameworkEntity> getFrameworkBySlug(String slug);
  
  Future<FrameworkEntity> createFramework({
    required String name,
    required String slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    required int order,
    required bool visible,
    required bool public,
  });

  Future<FrameworkEntity> updateFramework({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    int? order,
    bool? visible,
    bool? public,
  });

  Future<void> deleteFramework(String id);
  Future<void> updateFrameworkOrder(List<Map<String, dynamic>> frameworkOrders);
  Future<int> getFrameworkProjectCount(String frameworkId);
  Future<List<FrameworkEntity>> getFrameworksWithProjectCount();
}

class FrameworksRemoteDataSourceImpl implements FrameworksRemoteDataSource {
  // TODO: Implement with HTTP client
  
  @override
  Future<List<FrameworkEntity>> getFrameworks({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? type,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) {
    throw UnimplementedError();
  }

  @override
  Future<FrameworkEntity> getFrameworkById(String id) {
    throw UnimplementedError();
  }

  @override
  Future<FrameworkEntity> getFrameworkBySlug(String slug) {
    throw UnimplementedError();
  }

  @override
  Future<FrameworkEntity> createFramework({
    required String name,
    required String slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    required int order,
    required bool visible,
    required bool public,
  }) {
    throw UnimplementedError();
  }

  @override
  Future<FrameworkEntity> updateFramework({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    int? order,
    bool? visible,
    bool? public,
  }) {
    throw UnimplementedError();
  }

  @override
  Future<void> deleteFramework(String id) {
    throw UnimplementedError();
  }

  @override
  Future<void> updateFrameworkOrder(List<Map<String, dynamic>> frameworkOrders) {
    throw UnimplementedError();
  }

  @override
  Future<int> getFrameworkProjectCount(String frameworkId) {
    throw UnimplementedError();
  }

  @override
  Future<List<FrameworkEntity>> getFrameworksWithProjectCount() {
    throw UnimplementedError();
  }
}
