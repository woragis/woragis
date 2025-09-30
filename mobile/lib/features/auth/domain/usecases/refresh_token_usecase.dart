import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/auth_response_entity.dart';
import '../repositories/auth_repository.dart';

class RefreshTokenUseCase {
  final AuthRepository repository;

  RefreshTokenUseCase(this.repository);

  Future<Either<Failure, AuthResponseEntity>> call(String refreshToken) async {
    return await repository.refreshToken(
      refreshToken: refreshToken,
    );
  }
}
