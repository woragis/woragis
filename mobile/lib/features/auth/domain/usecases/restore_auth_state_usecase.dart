import 'dart:developer';
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class RestoreAuthStateUseCase {
  final AuthRepository repository;

  RestoreAuthStateUseCase(this.repository);

  Future<Either<Failure, AuthStateResult>> call() async {
    log('🔍 RestoreAuthStateUseCase: Checking local auth state...');
    
    // Check if user is logged in locally
    final isLoggedInResult = await repository.isLoggedIn();
    if (isLoggedInResult.isLeft()) {
      log('🚨 Failed to check if logged in');
      return Left(isLoggedInResult.fold((l) => l, (r) => throw Exception('Unexpected')));
    }

    final isLoggedIn = isLoggedInResult.getOrElse(() => false);
    log('📊 Is logged in locally: $isLoggedIn');
    if (!isLoggedIn) {
      log('❌ No local auth state found');
      return const Right(AuthStateResult(isAuthenticated: false));
    }

    // Check if token is still valid
    final isTokenValidResult = await repository.isTokenValid();
    if (isTokenValidResult.isLeft()) {
      log('🚨 Failed to check token validity');
      return Left(isTokenValidResult.fold((l) => l, (r) => throw Exception('Unexpected')));
    }

    final isTokenValid = isTokenValidResult.getOrElse(() => false);
    log('🔑 Token is valid: $isTokenValid');
    if (!isTokenValid) {
      log('⏰ Token expired, clearing local data');
      // Token expired, clear local data
      await repository.clearStoredTokens();
      await repository.clearStoredUserData();
      return const Right(AuthStateResult(isAuthenticated: false));
    }

    // Get stored user data
    final userResult = await repository.getStoredUserData();
    if (userResult.isLeft()) {
      return Left(userResult.fold((l) => l, (r) => throw Exception('Unexpected')));
    }

    final user = userResult.getOrElse(() => null);
    log('👤 User data found: ${user?.email}');
    if (user == null) {
      log('❌ No user data found');
      return const Right(AuthStateResult(isAuthenticated: false));
    }

    // Get stored tokens
    final accessTokenResult = await repository.getStoredAccessToken();
    if (accessTokenResult.isLeft()) {
      return Left(accessTokenResult.fold((l) => l, (r) => throw Exception('Unexpected')));
    }

    final accessToken = accessTokenResult.getOrElse(() => null);
    log('🔑 Access token found: ${accessToken != null ? 'Yes' : 'No'}');
    if (accessToken == null) {
      log('❌ No access token found');
      return const Right(AuthStateResult(isAuthenticated: false));
    }

    // Get refresh token
    final refreshTokenResult = await repository.getStoredRefreshToken();
    if (refreshTokenResult.isLeft()) {
      return Left(refreshTokenResult.fold((l) => l, (r) => throw Exception('Unexpected')));
    }

    final refreshToken = refreshTokenResult.getOrElse(() => null);

    // Get token expiration
    final tokenExpirationResult = await repository.getTokenExpiration();
    if (tokenExpirationResult.isLeft()) {
      return Left(tokenExpirationResult.fold((l) => l, (r) => throw Exception('Unexpected')));
    }

    final expiresAt = tokenExpirationResult.getOrElse(() => null);

    log('✅ Successfully restored auth state for user: ${user.email}');
    return Right(AuthStateResult(
      isAuthenticated: true,
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    ));
  }
}

class AuthStateResult {
  final bool isAuthenticated;
  final UserEntity? user;
  final String? accessToken;
  final String? refreshToken;
  final DateTime? expiresAt;

  const AuthStateResult({
    required this.isAuthenticated,
    this.user,
    this.accessToken,
    this.refreshToken,
    this.expiresAt,
  });
}
