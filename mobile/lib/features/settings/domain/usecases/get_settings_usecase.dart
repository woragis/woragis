import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/setting_entity.dart';
import '../repositories/settings_repository.dart';

class GetSettingsUseCase {
  final SettingsRepository repository;

  GetSettingsUseCase(this.repository);

  Future<Either<Failure, List<SettingEntity>>> call(GetSettingsParams params) async {
    return await repository.getSettings(
      category: params.category,
      isPublic: params.isPublic,
    );
  }
}

class GetSettingsParams {
  final int? page;
  final int? limit;
  final String? category;
  final bool? isPublic;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetSettingsParams({
    this.page,
    this.limit,
    this.category,
    this.isPublic,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
