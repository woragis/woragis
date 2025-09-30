import 'package:dartz/dartz.dart';
import '../../domain/entities/about_core_entity.dart';
import '../../domain/entities/biography_entity.dart';
import '../../domain/entities/anime_entity.dart';
import '../../domain/entities/music_genre_entity.dart';
import '../../domain/repositories/about_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/about_local_datasource.dart';
import '../datasources/about_remote_datasource.dart';

class AboutRepositoryImpl implements AboutRepository {
  final AboutRemoteDataSource remoteDataSource;
  final AboutLocalDataSource localDataSource;

  AboutRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  // About Core Implementation
  @override
  Future<Either<Failure, AboutCoreEntity>> getAboutCore() async {
    try {
      final aboutCore = await remoteDataSource.getAboutCore();
      await localDataSource.cacheAboutCore(aboutCore);
      return Right(aboutCore);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedAboutCore = await localDataSource.getCachedAboutCore();
        if (cachedAboutCore != null) {
          return Right(cachedAboutCore);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AboutCoreEntity>> updateAboutCore({
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
  }) async {
    try {
      final aboutCore = await remoteDataSource.updateAboutCore(
        name: name,
        currentProfessionId: currentProfessionId,
        biography: biography,
        featuredBiography: featuredBiography,
        visible: visible,
      );
      await localDataSource.updateCachedAboutCore(aboutCore);
      return Right(aboutCore);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  // Biography Implementation
  @override
  Future<Either<Failure, BiographyEntity>> getBiography() async {
    try {
      final biography = await remoteDataSource.getBiography();
      await localDataSource.cacheBiography(biography);
      return Right(biography);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedBiography = await localDataSource.getCachedBiography();
        if (cachedBiography != null) {
          return Right(cachedBiography);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BiographyEntity>> updateBiography({
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
  }) async {
    try {
      final biography = await remoteDataSource.updateBiography(
        featuredBiography: featuredBiography,
        fullBiography: fullBiography,
        visible: visible,
      );
      await localDataSource.updateCachedBiography(biography);
      return Right(biography);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  // Anime Implementation
  @override
  Future<Either<Failure, List<AnimeEntity>>> getAnimeList({
    int? page,
    int? limit,
    bool? visible,
    String? status,
    String? search,
  }) async {
    try {
      final animeList = await remoteDataSource.getAnimeList(
        page: page,
        limit: limit,
        visible: visible,
        status: status,
        search: search,
      );
      await localDataSource.cacheAnimeList(animeList);
      return Right(animeList);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedAnimeList = await localDataSource.getCachedAnimeList();
        return Right(cachedAnimeList);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AnimeEntity>> getAnimeById(String id) async {
    try {
      final anime = await remoteDataSource.getAnimeById(id);
      return Right(anime);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedAnime = await localDataSource.getCachedAnime(id);
        if (cachedAnime != null) {
          return Right(cachedAnime);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final anime = await remoteDataSource.createAnime(
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
      await localDataSource.cacheAnime(anime);
      return Right(anime);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
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
  }) async {
    try {
      final anime = await remoteDataSource.updateAnime(
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
      await localDataSource.updateCachedAnime(anime);
      return Right(anime);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteAnime(String id) async {
    try {
      await remoteDataSource.deleteAnime(id);
      await localDataSource.removeCachedAnime(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  // Music Genre Implementation
  @override
  Future<Either<Failure, List<MusicGenreEntity>>> getMusicGenres({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  }) async {
    try {
      final musicGenres = await remoteDataSource.getMusicGenres(
        page: page,
        limit: limit,
        visible: visible,
        search: search,
      );
      await localDataSource.cacheMusicGenres(musicGenres);
      return Right(musicGenres);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedMusicGenres = await localDataSource.getCachedMusicGenres();
        return Right(cachedMusicGenres);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, MusicGenreEntity>> getMusicGenreById(String id) async {
    try {
      final musicGenre = await remoteDataSource.getMusicGenreById(id);
      return Right(musicGenre);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedMusicGenre = await localDataSource.getCachedMusicGenre(id);
        if (cachedMusicGenre != null) {
          return Right(cachedMusicGenre);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, MusicGenreEntity>> createMusicGenre({
    required String name,
    String? description,
    required int order,
    required bool visible,
  }) async {
    try {
      final musicGenre = await remoteDataSource.createMusicGenre(
        name: name,
        description: description,
        order: order,
        visible: visible,
      );
      await localDataSource.cacheMusicGenre(musicGenre);
      return Right(musicGenre);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, MusicGenreEntity>> updateMusicGenre({
    required String id,
    String? name,
    String? description,
    int? order,
    bool? visible,
  }) async {
    try {
      final musicGenre = await remoteDataSource.updateMusicGenre(
        id: id,
        name: name,
        description: description,
        order: order,
        visible: visible,
      );
      await localDataSource.updateCachedMusicGenre(musicGenre);
      return Right(musicGenre);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteMusicGenre(String id) async {
    try {
      await remoteDataSource.deleteMusicGenre(id);
      await localDataSource.removeCachedMusicGenre(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  // Cache Methods Implementation
  @override
  Future<Either<Failure, AboutCoreEntity?>> getCachedAboutCore() async {
    try {
      final aboutCore = await localDataSource.getCachedAboutCore();
      return Right(aboutCore);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheAboutCore(AboutCoreEntity aboutCore) async {
    try {
      await localDataSource.cacheAboutCore(aboutCore);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, BiographyEntity?>> getCachedBiography() async {
    try {
      final biography = await localDataSource.getCachedBiography();
      return Right(biography);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheBiography(BiographyEntity biography) async {
    try {
      await localDataSource.cacheBiography(biography);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<AnimeEntity>>> getCachedAnimeList() async {
    try {
      final animeList = await localDataSource.getCachedAnimeList();
      return Right(animeList);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheAnimeList(List<AnimeEntity> animeList) async {
    try {
      await localDataSource.cacheAnimeList(animeList);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<MusicGenreEntity>>> getCachedMusicGenres() async {
    try {
      final musicGenres = await localDataSource.getCachedMusicGenres();
      return Right(musicGenres);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheMusicGenres(List<MusicGenreEntity> musicGenres) async {
    try {
      await localDataSource.cacheMusicGenres(musicGenres);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
