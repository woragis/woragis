import 'package:dartz/dartz.dart';
import '../entities/auth_response_entity.dart';
import '../entities/user_entity.dart';
import '../../../../core/error/failures.dart';

abstract class AuthRepository {
  // Authentication methods
  Future<Either<Failure, AuthResponseEntity>> login({
    required String email,
    required String password,
  });

  Future<Either<Failure, AuthResponseEntity>> register({
    required String email,
    required String username,
    required String password,
    String? firstName,
    String? lastName,
  });

  Future<Either<Failure, AuthResponseEntity>> refreshToken({
    required String refreshToken,
  });

  Future<Either<Failure, void>> logout();

  Future<Either<Failure, void>> changePassword({
    required String currentPassword,
    required String newPassword,
  });

  // User profile methods
  Future<Either<Failure, UserEntity>> getCurrentUser();

  Future<Either<Failure, UserEntity>> updateProfile({
    String? firstName,
    String? lastName,
    String? avatar,
  });

  // Token management
  Future<Either<Failure, String?>> getStoredAccessToken();
  Future<Either<Failure, String?>> getStoredRefreshToken();
  Future<Either<Failure, void>> storeTokens({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  });
  Future<Either<Failure, void>> clearStoredTokens();

  // User data management
  Future<Either<Failure, void>> storeUserData(UserEntity user);
  Future<Either<Failure, UserEntity?>> getStoredUserData();
  Future<Either<Failure, void>> clearStoredUserData();

  // Session validation
  Future<Either<Failure, bool>> isLoggedIn();
  Future<Either<Failure, bool>> isTokenValid();
}
