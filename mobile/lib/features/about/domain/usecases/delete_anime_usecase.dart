import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/about_repository.dart';

class DeleteAnimeUseCase {
  final AboutRepository repository;

  DeleteAnimeUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteAnime(id);
  }
}
