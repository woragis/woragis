import 'package:dartz/dartz.dart';
import '../../domain/entities/auth_response_entity.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/stores/auth_store.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  final AuthStoreBloc authStore;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.authStore,
  });

  @override
  Future<Either<Failure, AuthResponseEntity>> login({
    required String email,
    required String password,
  }) async {
    try {
      print('🔐 Starting login process for: $email');
      final authResponse = await remoteDataSource.login(
        email: email,
        password: password,
      );
      print('✅ Login successful, storing data locally');

          // Store user data first, then tokens (tokens need user data to be stored first)
          await localDataSource.storeUserData(authResponse.user);
          await localDataSource.storeTokens(
            accessToken: authResponse.tokens.accessToken,
            refreshToken: authResponse.tokens.refreshToken,
            expiresAt: authResponse.tokens.expiresAt,
          );
          
          // Update auth store with tokens and user
          authStore.updateTokens(
            accessToken: authResponse.tokens.accessToken,
            refreshToken: authResponse.tokens.refreshToken,
            expiresAt: authResponse.tokens.expiresAt,
          );
          authStore.updateUser(authResponse.user);
          
          print('✅ Login data stored successfully');

      return Right(authResponse);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthResponseEntity>> register({
    required String email,
    required String username,
    required String password,
    String? firstName,
    String? lastName,
  }) async {
    try {
      final authResponse = await remoteDataSource.register(
        email: email,
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
      );

      // Store tokens and user data locally
      await localDataSource.storeTokens(
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
        expiresAt: authResponse.tokens.expiresAt,
      );
      await localDataSource.storeUserData(authResponse.user);

      return Right(authResponse);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthResponseEntity>> refreshToken({
    required String refreshToken,
  }) async {
    try {
      final authResponse = await remoteDataSource.refreshToken(
        refreshToken: refreshToken,
      );

      // Update stored tokens
      await localDataSource.storeTokens(
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
        expiresAt: authResponse.tokens.expiresAt,
      );

      // Update auth store with tokens
      authStore.updateTokens(
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
        expiresAt: authResponse.tokens.expiresAt,
      );

      return Right(authResponse);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      print('🚪 Logging out user...');
      await remoteDataSource.logout();
      print('✅ Remote logout successful');
      
      await localDataSource.clearStoredTokens();
      print('✅ Local tokens cleared');
      
      await localDataSource.clearStoredUserData();
      print('✅ Local user data cleared');
      
      // Clear auth store
      authStore.logout();
      
      return const Right(null);
    } on ServerException catch (e) {
      print('🚨 Server error during logout: ${e.message}');
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      print('🚨 Network error during logout: ${e.message}');
      return Left(NetworkFailure(e.message));
    } catch (e) {
      print('🚨 Unexpected error during logout: $e');
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      await remoteDataSource.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );
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
  Future<Either<Failure, UserEntity>> getCurrentUser() async {
    try {
      final user = await remoteDataSource.getCurrentUser();
      return Right(user);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> updateProfile({
    String? firstName,
    String? lastName,
    String? avatar,
  }) async {
    try {
      final user = await remoteDataSource.updateProfile(
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
      );

      // Update local user data
      await localDataSource.storeUserData(user);

      return Right(user);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, String?>> getStoredAccessToken() async {
    try {
      final token = await localDataSource.getStoredAccessToken();
      return Right(token);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, String?>> getStoredRefreshToken() async {
    try {
      final token = await localDataSource.getStoredRefreshToken();
      return Right(token);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> storeTokens({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  }) async {
    try {
      await localDataSource.storeTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      );
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> clearStoredTokens() async {
    try {
      await localDataSource.clearStoredTokens();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> storeUserData(UserEntity user) async {
    try {
      await localDataSource.storeUserData(user);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserEntity?>> getStoredUserData() async {
    try {
      final user = await localDataSource.getStoredUserData();
      return Right(user);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> clearStoredUserData() async {
    try {
      await localDataSource.clearStoredUserData();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> isLoggedIn() async {
    try {
      final token = await localDataSource.getStoredAccessToken();
      final user = await localDataSource.getStoredUserData();
      return Right(token != null && user != null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> isTokenValid() async {
    try {
      final token = await localDataSource.getStoredAccessToken();
      if (token == null) return const Right(false);

      final expiresAt = await localDataSource.getTokenExpiration();
      if (expiresAt == null) return const Right(false);

      return Right(DateTime.now().isBefore(expiresAt));
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
