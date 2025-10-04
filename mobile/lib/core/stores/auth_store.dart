import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../features/auth/domain/entities/user_entity.dart';

// Auth Store Events
abstract class AuthStoreEvent extends Equatable {
  const AuthStoreEvent();

  @override
  List<Object?> get props => [];
}

class AuthStoreTokenUpdated extends AuthStoreEvent {
  final String? accessToken;
  final String? refreshToken;
  final DateTime? expiresAt;

  const AuthStoreTokenUpdated({
    this.accessToken,
    this.refreshToken,
    this.expiresAt,
  });

  @override
  List<Object?> get props => [accessToken, refreshToken, expiresAt];
}

class AuthStoreUserUpdated extends AuthStoreEvent {
  final UserEntity? user;

  const AuthStoreUserUpdated(this.user);

  @override
  List<Object?> get props => [user];
}

class AuthStoreLoggedOut extends AuthStoreEvent {
  const AuthStoreLoggedOut();
}

// Auth Store State
class AuthStoreState extends Equatable {
  final String? accessToken;
  final String? refreshToken;
  final DateTime? expiresAt;
  final UserEntity? user;
  final bool isAuthenticated;

  const AuthStoreState({
    this.accessToken,
    this.refreshToken,
    this.expiresAt,
    this.user,
    this.isAuthenticated = false,
  });

  bool get hasValidToken {
    if (accessToken == null) return false;
    if (expiresAt == null) return false;
    return DateTime.now().isBefore(expiresAt!);
  }

  AuthStoreState copyWith({
    String? accessToken,
    String? refreshToken,
    DateTime? expiresAt,
    UserEntity? user,
    bool? isAuthenticated,
  }) {
    return AuthStoreState(
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      expiresAt: expiresAt ?? this.expiresAt,
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }

  @override
  List<Object?> get props => [accessToken, refreshToken, expiresAt, user, isAuthenticated];
}

// Auth Store Bloc
class AuthStoreBloc extends Bloc<AuthStoreEvent, AuthStoreState> {
  AuthStoreBloc() : super(const AuthStoreState()) {
    on<AuthStoreTokenUpdated>(_onTokenUpdated);
    on<AuthStoreUserUpdated>(_onUserUpdated);
    on<AuthStoreLoggedOut>(_onLoggedOut);
  }

  void _onTokenUpdated(AuthStoreTokenUpdated event, Emitter<AuthStoreState> emit) {
    emit(state.copyWith(
      accessToken: event.accessToken,
      refreshToken: event.refreshToken,
      expiresAt: event.expiresAt,
      isAuthenticated: event.accessToken != null,
    ));
  }

  void _onUserUpdated(AuthStoreUserUpdated event, Emitter<AuthStoreState> emit) {
    emit(state.copyWith(
      user: event.user,
      isAuthenticated: event.user != null && state.accessToken != null,
    ));
  }

  void _onLoggedOut(AuthStoreLoggedOut event, Emitter<AuthStoreState> emit) {
    emit(const AuthStoreState());
  }

  // Helper methods
  void updateTokens({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  }) {
    add(AuthStoreTokenUpdated(
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    ));
  }

  void updateUser(UserEntity? user) {
    add(AuthStoreUserUpdated(user));
  }

  void logout() {
    add(const AuthStoreLoggedOut());
  }

  String? get currentAccessToken => state.accessToken;
  bool get isAuthenticated => state.isAuthenticated && state.hasValidToken;
}
