import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/about_repository.dart';

class DeleteMusicGenreUseCase {
  final AboutRepository repository;

  DeleteMusicGenreUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteMusicGenre(id);
  }
}
