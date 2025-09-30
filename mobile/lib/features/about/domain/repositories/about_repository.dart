import 'package:dartz/dartz.dart';
import '../entities/about_core_entity.dart';
import '../entities/biography_entity.dart';
import '../entities/anime_entity.dart';
import '../entities/music_genre_entity.dart';
import '../../../../core/error/failures.dart';

abstract class AboutRepository {
  // About core methods
  Future<Either<Failure, AboutCoreEntity>> getAboutCore();
  Future<Either<Failure, AboutCoreEntity>> updateAboutCore({
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
  });

  // Biography methods
  Future<Either<Failure, BiographyEntity>> getBiography();
  Future<Either<Failure, BiographyEntity>> updateBiography({
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
  });

  // Anime methods
  Future<Either<Failure, List<AnimeEntity>>> getAnimeList({
    int? page,
    int? limit,
    bool? visible,
    String? status,
    String? search,
  });

  Future<Either<Failure, AnimeEntity>> getAnimeById(String id);

  Future<Either<Failure, AnimeEntity>> createAnime({
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
  });

  Future<Either<Failure, AnimeEntity>> updateAnime({
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
  });

  Future<Either<Failure, void>> deleteAnime(String id);

  // Music genre methods
  Future<Either<Failure, List<MusicGenreEntity>>> getMusicGenres({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  });

  Future<Either<Failure, MusicGenreEntity>> getMusicGenreById(String id);

  Future<Either<Failure, MusicGenreEntity>> createMusicGenre({
    required String name,
    String? description,
    required int order,
    required bool visible,
  });

  Future<Either<Failure, MusicGenreEntity>> updateMusicGenre({
    required String id,
    String? name,
    String? description,
    int? order,
    bool? visible,
  });

  Future<Either<Failure, void>> deleteMusicGenre(String id);

  // Offline/Cache methods
  Future<Either<Failure, AboutCoreEntity?>> getCachedAboutCore();
  Future<Either<Failure, void>> cacheAboutCore(AboutCoreEntity aboutCore);
  Future<Either<Failure, BiographyEntity?>> getCachedBiography();
  Future<Either<Failure, void>> cacheBiography(BiographyEntity biography);
  Future<Either<Failure, List<AnimeEntity>>> getCachedAnimeList();
  Future<Either<Failure, void>> cacheAnimeList(List<AnimeEntity> animeList);
  Future<Either<Failure, List<MusicGenreEntity>>> getCachedMusicGenres();
  Future<Either<Failure, void>> cacheMusicGenres(List<MusicGenreEntity> musicGenres);
}
