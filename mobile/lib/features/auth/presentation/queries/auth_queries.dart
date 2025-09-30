// Auth Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/user_entity.dart';
import '../../domain/entities/auth_response_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class AuthQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<UserEntity> getCurrentUser() async {
    final useCase = sl<GetCurrentUserUseCase>();
    final result = await useCase();
    return result.fold(
      (failure) => throw Exception(failure.message),
      (user) => user,
    );
  }

  static Future<AuthResponseEntity> login(LoginParams params) async {
    final useCase = sl<LoginUseCase>();
    final result = await useCase(params);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (authResponse) => authResponse,
    );
  }

  static Future<AuthResponseEntity> register(RegisterParams params) async {
    final useCase = sl<RegisterUseCase>();
    final result = await useCase(params);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (authResponse) => authResponse,
    );
  }

  static Future<void> logout() async {
    final useCase = sl<LogoutUseCase>();
    final result = await useCase();
    return result.fold(
      (failure) => throw Exception(failure.message),
      (_) => null,
    );
  }

  static Future<AuthResponseEntity> refreshToken(String refreshToken) async {
    final useCase = sl<RefreshTokenUseCase>();
    final result = await useCase(refreshToken);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (authResponse) => authResponse,
    );
  }

  static Future<void> changePassword(ChangePasswordParams params) async {
    final useCase = sl<ChangePasswordUseCase>();
    final result = await useCase(params);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (_) => null,
    );
  }

  static Future<UserEntity> updateProfile(UpdateProfileParams params) async {
    final useCase = sl<UpdateProfileUseCase>();
    final result = await useCase(params);
    return result.fold(
      (failure) => throw Exception(failure.message),
      (user) => user,
    );
  }
}
