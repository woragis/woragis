import 'package:dartz/dartz.dart';
import '../entities/experience_entity.dart';
import '../../../../core/error/failures.dart';

abstract class ExperienceRepository {
  // Experience methods
  Future<Either<Failure, List<ExperienceEntity>>> getExperienceList({
    int? page,
    int? limit,
    bool? visible,
    String? company,
    String? search,
  });

  Future<Either<Failure, ExperienceEntity>> getExperienceById(String id);

  Future<Either<Failure, ExperienceEntity>> createExperience({
    required String title,
    required String company,
    required String period,
    required String location,
    required String description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    required int order,
    required bool visible,
  });

  Future<Either<Failure, ExperienceEntity>> updateExperience({
    required String id,
    String? title,
    String? company,
    String? period,
    String? location,
    String? description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    int? order,
    bool? visible,
  });

  Future<Either<Failure, void>> deleteExperience(String id);

  // Experience ordering methods
  Future<Either<Failure, void>> updateExperienceOrder(
    List<Map<String, dynamic>> experienceOrders,
  );

  // Offline/Cache methods
  Future<Either<Failure, List<ExperienceEntity>>> getCachedExperienceList();
  Future<Either<Failure, void>> cacheExperienceList(List<ExperienceEntity> experienceList);
  Future<Either<Failure, ExperienceEntity?>> getCachedExperience(String id);
  Future<Either<Failure, void>> cacheExperience(ExperienceEntity experience);
}
