import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/about_core_entity.dart';
import '../repositories/about_repository.dart';

class GetAboutCoreUseCase {
  final AboutRepository repository;

  GetAboutCoreUseCase(this.repository);

  Future<Either<Failure, AboutCoreEntity>> call() async {
    return await repository.getAboutCore();
  }
}
