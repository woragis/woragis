import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/frameworks_repository.dart';

class DeleteFrameworkUseCase {
  final FrameworksRepository repository;

  DeleteFrameworkUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteFramework(id);
  }
}
