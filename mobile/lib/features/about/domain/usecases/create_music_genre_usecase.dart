import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/music_genre_entity.dart';
import '../repositories/about_repository.dart';

class CreateMusicGenreUseCase {
  final AboutRepository repository;

  CreateMusicGenreUseCase(this.repository);

  Future<Either<Failure, MusicGenreEntity>> call({
    required String name,
    String? description,
    required int order,
    required bool visible,
  }) async {
    return await repository.createMusicGenre(
      name: name,
      description: description,
      order: order,
      visible: visible,
    );
  }
}
