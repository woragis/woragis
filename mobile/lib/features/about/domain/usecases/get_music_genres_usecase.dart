import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/music_genre_entity.dart';
import '../repositories/about_repository.dart';

class GetMusicGenresUseCase {
  final AboutRepository repository;

  GetMusicGenresUseCase(this.repository);

  Future<Either<Failure, List<MusicGenreEntity>>> call({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  }) async {
    return await repository.getMusicGenres(
      page: page,
      limit: limit,
      visible: visible,
      search: search,
    );
  }
}
