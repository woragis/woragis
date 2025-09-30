import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/auth_response_entity.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  Future<Either<Failure, AuthResponseEntity>> call(RegisterParams params) async {
    return await repository.register(
      email: params.email,
      username: params.username,
      password: params.password,
      firstName: params.firstName,
      lastName: params.lastName,
    );
  }
}

class RegisterParams {
  final String email;
  final String username;
  final String password;
  final String? firstName;
  final String? lastName;

  RegisterParams({
    required this.email,
    required this.username,
    required this.password,
    this.firstName,
    this.lastName,
  });
}
