import 'package:dartz/dartz.dart';
import '../../domain/entities/setting_entity.dart';
import '../../domain/repositories/settings_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/settings_local_datasource.dart';
import '../datasources/settings_remote_datasource.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  final SettingsRemoteDataSource remoteDataSource;
  final SettingsLocalDataSource localDataSource;

  SettingsRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, List<SettingEntity>>> getSettings({
    int? page,
    int? limit,
    String? category,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final settings = await remoteDataSource.getSettings(
        page: page,
        limit: limit,
        category: category,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );

      // Cache the settings locally
      await localDataSource.cacheSettings(settings);

      return Right(settings);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedSettings = await localDataSource.getCachedSettings();
        return Right(cachedSettings);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, SettingEntity>> getSettingById(String id) async {
    try {
      final setting = await remoteDataSource.getSettingById(id);
      return Right(setting);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedSetting = await localDataSource.getCachedSetting(id);
        if (cachedSetting != null) {
          return Right(cachedSetting);
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
  Future<Either<Failure, SettingEntity>> getSettingByKey(String key) async {
    try {
      final setting = await remoteDataSource.getSettingByKey(key);
      return Right(setting);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedSetting = await localDataSource.getCachedSettingByKey(key);
        if (cachedSetting != null) {
          return Right(cachedSetting);
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
  Future<Either<Failure, SettingEntity>> createSetting({
    required String key,
    required String value,
    String? category,
    String? description,
    String? type,
    bool? isPublic,
    bool? isEditable,
  }) async {
    try {
      final setting = await remoteDataSource.createSetting(
        key: key,
        value: value,
        category: category,
        description: description,
        type: type,
        isPublic: isPublic,
        isEditable: isEditable,
      );

      // Cache the new setting
      await localDataSource.cacheSetting(setting);

      return Right(setting);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, SettingEntity>> updateSetting({
    required String id,
    String? key,
    String? value,
    String? category,
    String? description,
    String? type,
    bool? isPublic,
    bool? isEditable,
  }) async {
    try {
      final setting = await remoteDataSource.updateSetting(
        id: id,
        key: key,
        value: value,
        category: category,
        description: description,
        type: type,
        isPublic: isPublic,
        isEditable: isEditable,
      );

      // Update cached setting
      await localDataSource.updateCachedSetting(setting);

      return Right(setting);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, SettingEntity>> updateSettingByKey({
    required String key,
    required String value,
  }) async {
    try {
      final setting = await remoteDataSource.updateSettingByKey(
        key: key,
        value: value,
      );

      // Update cached setting
      await localDataSource.updateCachedSetting(setting);

      return Right(setting);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteSetting(String id) async {
    try {
      await remoteDataSource.deleteSetting(id);
      await localDataSource.removeCachedSetting(id);
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
  Future<Either<Failure, void>> deleteSettingByKey(String key) async {
    try {
      await remoteDataSource.deleteSettingByKey(key);
      await localDataSource.removeCachedSettingByKey(key);
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
  Future<Either<Failure, List<SettingEntity>>> getSettingsByCategory(String category) async {
    try {
      final settings = await remoteDataSource.getSettingsByCategory(category);
      return Right(settings);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedSettings = await localDataSource.getCachedSettingsByCategory(category);
        return Right(cachedSettings);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<SettingEntity>>> getPublicSettings() async {
    try {
      final settings = await remoteDataSource.getPublicSettings();
      return Right(settings);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedSettings = await localDataSource.getCachedPublicSettings();
        return Right(cachedSettings);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<SettingEntity>>> getCachedSettings() async {
    try {
      final settings = await localDataSource.getCachedSettings();
      return Right(settings);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheSettings(List<SettingEntity> settings) async {
    try {
      await localDataSource.cacheSettings(settings);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, SettingEntity?>> getCachedSetting(String id) async {
    try {
      final setting = await localDataSource.getCachedSetting(id);
      return Right(setting);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheSetting(SettingEntity setting) async {
    try {
      await localDataSource.cacheSetting(setting);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
