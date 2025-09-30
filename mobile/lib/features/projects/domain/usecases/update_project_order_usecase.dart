import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/projects_repository.dart';

class UpdateProjectOrderUseCase {
  final ProjectsRepository repository;

  UpdateProjectOrderUseCase(this.repository);

  Future<Either<Failure, void>> call(
    List<Map<String, dynamic>> projectOrders,
  ) async {
    return await repository.updateProjectOrder(projectOrders);
  }
}
