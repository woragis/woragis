import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/music_genre_entity.dart';
import '../repositories/about_repository.dart';

class UpdateMusicGenreUseCase {
  final AboutRepository repository;

  UpdateMusicGenreUseCase(this.repository);

  Future<Either<Failure, MusicGenreEntity>> call({
    required String id,
    String? name,
    String? description,
    int? order,
    bool? visible,
  }) async {
    return await repository.updateMusicGenre(
      id: id,
      name: name,
      description: description,
      order: order,
      visible: visible,
    );
  }
}
