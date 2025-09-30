import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/education_repository.dart';

class UpdateEducationOrderUseCase {
  final EducationRepository repository;

  UpdateEducationOrderUseCase(this.repository);

  Future<Either<Failure, void>> call(
    List<Map<String, dynamic>> educationOrders,
  ) async {
    return await repository.updateEducationOrder(educationOrders);
  }
}
