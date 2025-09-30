import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/auth_response_entity.dart';
import 'user_model.dart';
import 'auth_tokens_model.dart';

part 'auth_response_model.g.dart';

@JsonSerializable(explicitToJson: true)
class AuthResponseModel extends AuthResponseEntity {
  @override
  final UserModel user;

  @override
  final AuthTokensModel tokens;

  const AuthResponseModel({
    required this.user,
    required this.tokens,
  }) : super(user: user, tokens: tokens);

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseModelFromJson(json);

  Map<String, dynamic> toJson() => _$AuthResponseModelToJson(this);

  factory AuthResponseModel.fromEntity(AuthResponseEntity entity) {
    return AuthResponseModel(
      user: UserModel.fromEntity(entity.user),
      tokens: AuthTokensModel.fromEntity(entity.tokens),
    );
  }

  AuthResponseEntity toEntity() {
    return AuthResponseEntity(
      user: user.toEntity(),
      tokens: tokens.toEntity(),
    );
  }

  @override
  AuthResponseModel copyWith({
    covariant UserModel? user,
    covariant AuthTokensModel? tokens,
  }) {
    return AuthResponseModel(
      user: user ?? this.user,
      tokens: tokens ?? this.tokens,
    );
  }
}
