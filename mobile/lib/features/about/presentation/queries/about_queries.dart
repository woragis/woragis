import '../../domain/entities/about_core_entity.dart';
import '../../domain/entities/biography_entity.dart';
import '../../domain/entities/anime_entity.dart';
import '../../domain/entities/music_genre_entity.dart';
import '../../domain/usecases/get_about_core_usecase.dart';
import '../../../../core/injection/injection_container.dart' as sl;

class AboutQueries {
  static Future<AboutCoreEntity> getAboutCore() async {
    final useCase = sl.sl<GetAboutCoreUseCase>();
    final result = await useCase();
    return result.fold(
      (failure) => throw Exception(failure.message),
      (aboutCore) => aboutCore,
    );
  }

  // TODO: Implement additional query methods when use cases are available
  // These are placeholder methods for future implementation

  static Future<BiographyEntity?> getBiography() async {
    // TODO: Implement when biography use case is available
    return null;
  }

  static Future<List<AnimeEntity>> getAnimeList() async {
    // TODO: Implement when anime use case is available
    return [];
  }

  static Future<List<MusicGenreEntity>> getMusicGenres() async {
    // TODO: Implement when music genres use case is available
    return [];
  }

  static Future<List<AnimeEntity>> getAnimeByStatus(String status) async {
    // TODO: Implement when anime use case is available
    return [];
  }

  static Future<List<AnimeEntity>> getVisibleAnime() async {
    // TODO: Implement when anime use case is available
    return [];
  }

  static Future<List<MusicGenreEntity>> getVisibleMusicGenres() async {
    // TODO: Implement when music genres use case is available
    return [];
  }
}
