import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/anime_entity.dart';
import '../repositories/about_repository.dart';

class UpdateAnimeUseCase {
  final AboutRepository repository;

  UpdateAnimeUseCase(this.repository);

  Future<Either<Failure, AnimeEntity>> call({
    required String id,
    String? title,
    String? description,
    String? status,
    String? myAnimeListId,
    String? coverImage,
    List<String>? genres,
    int? episodes,
    int? currentEpisode,
    double? rating,
    String? notes,
    DateTime? startedAt,
    DateTime? completedAt,
    int? order,
    bool? visible,
  }) async {
    return await repository.updateAnime(
      id: id,
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
