import 'package:dartz/dartz.dart';
import '../../domain/entities/education_entity.dart';
import '../../domain/repositories/education_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/education_local_datasource.dart';
import '../datasources/education_remote_datasource.dart';

class EducationRepositoryImpl implements EducationRepository {
  final EducationRemoteDataSource remoteDataSource;
  final EducationLocalDataSource localDataSource;

  EducationRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, List<EducationEntity>>> getEducationList({
    int? page,
    int? limit,
    bool? visible,
    String? type,
    String? degreeLevel,
    String? institution,
    String? search,
  }) async {
    try {
      final educationList = await remoteDataSource.getEducationList(
        page: page,
        limit: limit,
        visible: visible,
        type: type,
        degreeLevel: degreeLevel,
        institution: institution,
        search: search,
      );

      // Cache the education list locally
      await localDataSource.cacheEducationList(educationList);

      return Right(educationList);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedEducationList = await localDataSource.getCachedEducationList();
        return Right(cachedEducationList);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, EducationEntity>> getEducationById(String id) async {
    try {
      final education = await remoteDataSource.getEducationById(id);
      return Right(education);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedEducation = await localDataSource.getCachedEducation(id);
        if (cachedEducation != null) {
          return Right(cachedEducation);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final education = await remoteDataSource.createEducation(
        title: title,
        institution: institution,
        description: description,
        type: type,
        degreeLevel: degreeLevel,
        fieldOfStudy: fieldOfStudy,
        startDate: startDate,
        endDate: endDate,
        completionDate: completionDate,
        grade: grade,
        credits: credits,
        certificateId: certificateId,
        issuer: issuer,
        validityPeriod: validityPeriod,
        pdfDocument: pdfDocument,
        verificationUrl: verificationUrl,
        skills: skills,
        order: order,
        visible: visible,
      );

      // Cache the new education
      await localDataSource.cacheEducation(education);

      return Right(education);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final education = await remoteDataSource.updateEducation(
        id: id,
        title: title,
        institution: institution,
        description: description,
        type: type,
        degreeLevel: degreeLevel,
        fieldOfStudy: fieldOfStudy,
        startDate: startDate,
        endDate: endDate,
        completionDate: completionDate,
        grade: grade,
        credits: credits,
        certificateId: certificateId,
        issuer: issuer,
        validityPeriod: validityPeriod,
        pdfDocument: pdfDocument,
        verificationUrl: verificationUrl,
        skills: skills,
        order: order,
        visible: visible,
      );

      // Update cached education
      await localDataSource.updateCachedEducation(education);

      return Right(education);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteEducation(String id) async {
    try {
      await remoteDataSource.deleteEducation(id);
      await localDataSource.removeCachedEducation(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> updateEducationOrder(
    List<Map<String, dynamic>> educationOrders,
  ) async {
    try {
      await remoteDataSource.updateEducationOrder(educationOrders);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<EducationEntity>>> getCachedEducationList() async {
    try {
      final educationList = await localDataSource.getCachedEducationList();
      return Right(educationList);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheEducationList(List<EducationEntity> educationList) async {
    try {
      await localDataSource.cacheEducationList(educationList);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, EducationEntity?>> getCachedEducation(String id) async {
    try {
      final education = await localDataSource.getCachedEducation(id);
      return Right(education);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheEducation(EducationEntity education) async {
    try {
      await localDataSource.cacheEducation(education);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
