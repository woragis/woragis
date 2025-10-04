import 'dart:developer';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/injection/injection_container.dart';
import '../../../../core/stores/auth_store.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/usecases/usecases.dart';

// Events
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  const LoginRequested({
    required this.email,
    required this.password,
  });

  @override
  List<Object> get props => [email, password];
}

class RegisterRequested extends AuthEvent {
  final String email;
  final String username;
  final String password;
  final String? firstName;
  final String? lastName;

  const RegisterRequested({
    required this.email,
    required this.username,
    required this.password,
    this.firstName,
    this.lastName,
  });

  @override
  List<Object?> get props => [email, username, password, firstName, lastName];
}

class GetCurrentUserRequested extends AuthEvent {}

class RestoreAuthStateRequested extends AuthEvent {}

class LogoutRequested extends AuthEvent {}

class RefreshTokenRequested extends AuthEvent {
  final String refreshToken;

  const RefreshTokenRequested(this.refreshToken);

  @override
  List<Object> get props => [refreshToken];
}

class ChangePasswordRequested extends AuthEvent {
  final String currentPassword;
  final String newPassword;

  const ChangePasswordRequested({
    required this.currentPassword,
    required this.newPassword,
  });

  @override
  List<Object> get props => [currentPassword, newPassword];
}

class UpdateProfileRequested extends AuthEvent {
  final String? firstName;
  final String? lastName;
  final String? avatar;

  const UpdateProfileRequested({
    this.firstName,
    this.lastName,
    this.avatar,
  });

  @override
  List<Object?> get props => [firstName, lastName, avatar];
}

// States
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final UserEntity user;

  const AuthAuthenticated(this.user);

  @override
  List<Object> get props => [user];
}

class AuthUnauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;

  const AuthError(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final GetCurrentUserUseCase getCurrentUserUseCase;
  final LogoutUseCase logoutUseCase;
  final RefreshTokenUseCase refreshTokenUseCase;
  final ChangePasswordUseCase changePasswordUseCase;
  final UpdateProfileUseCase updateProfileUseCase;
  final RestoreAuthStateUseCase restoreAuthStateUseCase;
  final AuthStoreBloc authStore;

  AuthBloc({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.getCurrentUserUseCase,
    required this.logoutUseCase,
    required this.refreshTokenUseCase,
    required this.changePasswordUseCase,
    required this.updateProfileUseCase,
    required this.restoreAuthStateUseCase,
    required this.authStore,
  }) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<GetCurrentUserRequested>(_onGetCurrentUserRequested);
    on<RestoreAuthStateRequested>(_onRestoreAuthStateRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<RefreshTokenRequested>(_onRefreshTokenRequested);
    on<ChangePasswordRequested>(_onChangePasswordRequested);
    on<UpdateProfileRequested>(_onUpdateProfileRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await loginUseCase(LoginParams(
      email: event.email,
      password: event.password,
    ));

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (authResponse) => emit(AuthAuthenticated(authResponse.user)),
    );
  }

  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await registerUseCase(RegisterParams(
      email: event.email,
      username: event.username,
      password: event.password,
      firstName: event.firstName,
      lastName: event.lastName,
    ));

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (authResponse) => emit(AuthAuthenticated(authResponse.user)),
    );
  }

  Future<void> _onGetCurrentUserRequested(
    GetCurrentUserRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await getCurrentUserUseCase();

    result.fold(
      (failure) => emit(AuthUnauthenticated()),
      (user) => emit(AuthAuthenticated(user)),
    );
  }

  Future<void> _onRestoreAuthStateRequested(
    RestoreAuthStateRequested event,
    Emitter<AuthState> emit,
  ) async {
    log('🔄 Restoring auth state from local storage...');
    emit(AuthLoading());

    final result = await restoreAuthStateUseCase();

    result.fold(
      (failure) {
        log('🚨 Failed to restore auth state: ${failure.message}');
        emit(AuthUnauthenticated());
      },
      (authStateResult) {
        log('📋 Auth state result: isAuthenticated=${authStateResult.isAuthenticated}, user=${authStateResult.user?.email}');
        if (authStateResult.isAuthenticated && authStateResult.user != null) {
          log('✅ Restoring authenticated user: ${authStateResult.user!.email}');
          // Update auth store with restored tokens FIRST, then user
          if (authStateResult.accessToken != null) {
            authStore.updateTokens(
              accessToken: authStateResult.accessToken!,
              refreshToken: authStateResult.refreshToken ?? '',
              expiresAt: authStateResult.expiresAt ?? DateTime.now().add(const Duration(hours: 1)),
            );
          }
          // Then update user (this will preserve the tokens)
          authStore.updateUser(authStateResult.user!);
          emit(AuthAuthenticated(authStateResult.user!));
        } else {
          log('❌ No valid auth state found, redirecting to login');
          emit(AuthUnauthenticated());
        }
      },
    );
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    log('🚪 Starting logout process');

    final result = await logoutUseCase();

    result.fold(
      (failure) {
        log('🚨 Logout failed: ${failure.message}');
        emit(AuthError(failure.message));
      },
      (_) {
        log('✅ Logout successful, clearing authentication state');
        emit(AuthUnauthenticated());
      },
    );
  }

  Future<void> _onRefreshTokenRequested(
    RefreshTokenRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await refreshTokenUseCase(event.refreshToken);

    result.fold(
      (failure) => emit(AuthUnauthenticated()),
      (authResponse) => emit(AuthAuthenticated(authResponse.user)),
    );
  }

  Future<void> _onChangePasswordRequested(
    ChangePasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await changePasswordUseCase(ChangePasswordParams(
      currentPassword: event.currentPassword,
      newPassword: event.newPassword,
    ));

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (_) {
        // Password changed successfully, get updated user info
        add(GetCurrentUserRequested());
      },
    );
  }

  Future<void> _onUpdateProfileRequested(
    UpdateProfileRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await updateProfileUseCase(UpdateProfileParams(
      firstName: event.firstName,
      lastName: event.lastName,
      avatar: event.avatar,
    ));

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }
}

// Factory function for creating AuthBloc with dependency injection
AuthBloc createAuthBloc() {
  return AuthBloc(
    loginUseCase: sl<LoginUseCase>(),
    registerUseCase: sl<RegisterUseCase>(),
    getCurrentUserUseCase: sl<GetCurrentUserUseCase>(),
    logoutUseCase: sl<LogoutUseCase>(),
    refreshTokenUseCase: sl<RefreshTokenUseCase>(),
    changePasswordUseCase: sl<ChangePasswordUseCase>(),
    updateProfileUseCase: sl<UpdateProfileUseCase>(),
    restoreAuthStateUseCase: sl<RestoreAuthStateUseCase>(),
    authStore: sl<AuthStoreBloc>(),
  );
}
