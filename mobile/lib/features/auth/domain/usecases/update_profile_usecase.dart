import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class UpdateProfileUseCase {
  final AuthRepository repository;

  UpdateProfileUseCase(this.repository);

  Future<Either<Failure, UserEntity>> call(UpdateProfileParams params) async {
    return await repository.updateProfile(
      firstName: params.firstName,
      lastName: params.lastName,
      avatar: params.avatar,
    );
  }
}

class UpdateProfileParams {
  final String? firstName;
  final String? lastName;
  final String? avatar;

  UpdateProfileParams({
    this.firstName,
    this.lastName,
    this.avatar,
  });
}
