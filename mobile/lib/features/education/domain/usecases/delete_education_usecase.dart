import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/education_repository.dart';

class DeleteEducationUseCase {
  final EducationRepository repository;

  DeleteEducationUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteEducation(id);
  }
}
