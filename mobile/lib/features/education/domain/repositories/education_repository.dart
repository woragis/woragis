import 'package:dartz/dartz.dart';
import '../entities/education_entity.dart';
import '../../../../core/error/failures.dart';

abstract class EducationRepository {
  // Education methods
  Future<Either<Failure, List<EducationEntity>>> getEducationList({
    int? page,
    int? limit,
    bool? visible,
    String? type,
    String? degreeLevel,
    String? institution,
    String? search,
  });

  Future<Either<Failure, EducationEntity>> getEducationById(String id);

  Future<Either<Failure, EducationEntity>> createEducation({
    required String title,
    required String institution,
    String? description,
    required String type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    required int order,
    required bool visible,
  });

  Future<Either<Failure, EducationEntity>> updateEducation({
    required String id,
    String? title,
    String? institution,
    String? description,
    String? type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    int? order,
    bool? visible,
  });

  Future<Either<Failure, void>> deleteEducation(String id);

  // Education ordering methods
  Future<Either<Failure, void>> updateEducationOrder(
    List<Map<String, dynamic>> educationOrders,
  );

  // Offline/Cache methods
  Future<Either<Failure, List<EducationEntity>>> getCachedEducationList();
  Future<Either<Failure, void>> cacheEducationList(List<EducationEntity> educationList);
  Future<Either<Failure, EducationEntity?>> getCachedEducation(String id);
  Future<Either<Failure, void>> cacheEducation(EducationEntity education);
}
