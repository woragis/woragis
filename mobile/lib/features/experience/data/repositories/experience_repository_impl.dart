import 'package:dartz/dartz.dart';
import '../../domain/entities/experience_entity.dart';
import '../../domain/repositories/experience_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/experience_local_datasource.dart';
import '../datasources/experience_remote_datasource.dart';

class ExperienceRepositoryImpl implements ExperienceRepository {
  final ExperienceRemoteDataSource remoteDataSource;
  final ExperienceLocalDataSource localDataSource;

  ExperienceRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, List<ExperienceEntity>>> getExperienceList({
    int? page,
    int? limit,
    bool? visible,
    String? company,
    String? search,
  }) async {
    try {
      final experienceList = await remoteDataSource.getExperienceList(
        page: page,
        limit: limit,
        visible: visible,
        company: company,
        search: search,
      );

      // Cache the experience list locally
      await localDataSource.cacheExperienceList(experienceList);

      return Right(experienceList);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedExperienceList = await localDataSource.getCachedExperienceList();
        return Right(cachedExperienceList);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ExperienceEntity>> getExperienceById(String id) async {
    try {
      final experience = await remoteDataSource.getExperienceById(id);
      return Right(experience);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedExperience = await localDataSource.getCachedExperience(id);
        if (cachedExperience != null) {
          return Right(cachedExperience);
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
  }) async {
    try {
      final experience = await remoteDataSource.createExperience(
        title: title,
        company: company,
        description: description,
        startDate: period, // Using period as startDate for now
        endDate: period, // Using period as endDate for now
        visible: visible,
        order: order,
      );

      // Cache the new experience
      await localDataSource.cacheExperience(experience);

      return Right(experience);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final experience = await remoteDataSource.updateExperience(
        id: id,
        title: title,
        company: company,
        description: description,
        startDate: period, // Using period as startDate for now
        endDate: period, // Using period as endDate for now
        order: order,
        visible: visible,
      );

      // Update cached experience
      await localDataSource.updateCachedExperience(experience);

      return Right(experience);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteExperience(String id) async {
    try {
      await remoteDataSource.deleteExperience(id);
      await localDataSource.removeCachedExperience(id);
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
  Future<Either<Failure, void>> updateExperienceOrder(
    List<Map<String, dynamic>> experienceOrders,
  ) async {
    try {
      // Update each experience order individually
      for (final orderData in experienceOrders) {
        await remoteDataSource.updateExperienceOrder(
          id: orderData['id'] as String,
          order: orderData['order'] as int,
        );
      }
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
  Future<Either<Failure, List<ExperienceEntity>>> getCachedExperienceList() async {
    try {
      final experienceList = await localDataSource.getCachedExperienceList();
      return Right(experienceList);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheExperienceList(List<ExperienceEntity> experienceList) async {
    try {
      await localDataSource.cacheExperienceList(experienceList);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ExperienceEntity?>> getCachedExperience(String id) async {
    try {
      final experience = await localDataSource.getCachedExperience(id);
      return Right(experience);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheExperience(ExperienceEntity experience) async {
    try {
      await localDataSource.cacheExperience(experience);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
