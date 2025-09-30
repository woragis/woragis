import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/education_entity.dart';
import '../repositories/education_repository.dart';

class GetEducationByIdUseCase {
  final EducationRepository repository;

  GetEducationByIdUseCase(this.repository);

  Future<Either<Failure, EducationEntity>> call(String id) async {
    return await repository.getEducationById(id);
  }
}
