import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/anime_entity.dart';
import '../repositories/about_repository.dart';

class CreateAnimeUseCase {
  final AboutRepository repository;

  CreateAnimeUseCase(this.repository);

  Future<Either<Failure, AnimeEntity>> call({
    required String title,
    String? description,
    required String status,
    String? myAnimeListId,
    String? coverImage,
    List<String>? genres,
    int? episodes,
    int? currentEpisode,
    double? rating,
    String? notes,
    DateTime? startedAt,
    DateTime? completedAt,
    required int order,
    required bool visible,
  }) async {
    return await repository.createAnime(
      title: title,
      description: description,
      status: status,
      myAnimeListId: myAnimeListId,
      coverImage: coverImage,
      genres: genres,
      episodes: episodes,
      currentEpisode: currentEpisode,
      rating: rating,
      notes: notes,
      startedAt: startedAt,
      completedAt: completedAt,
      order: order,
      visible: visible,
    );
  }
}
