import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/experience_repository.dart';

class UpdateExperienceOrderUseCase {
  final ExperienceRepository repository;

  UpdateExperienceOrderUseCase(this.repository);

  Future<Either<Failure, void>> call(
    List<Map<String, dynamic>> experienceOrders,
  ) async {
    return await repository.updateExperienceOrder(experienceOrders);
  }
}
