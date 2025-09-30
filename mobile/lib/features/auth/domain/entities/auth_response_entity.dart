import 'package:equatable/equatable.dart';
import 'user_entity.dart';
import 'auth_tokens_entity.dart';

class AuthResponseEntity extends Equatable {
  final UserEntity user;
  final AuthTokensEntity tokens;

  const AuthResponseEntity({
    required this.user,
    required this.tokens,
  });

  @override
  List<Object> get props => [user, tokens];

  AuthResponseEntity copyWith({
    UserEntity? user,
    AuthTokensEntity? tokens,
  }) {
    return AuthResponseEntity(
      user: user ?? this.user,
      tokens: tokens ?? this.tokens,
    );
  }
}
