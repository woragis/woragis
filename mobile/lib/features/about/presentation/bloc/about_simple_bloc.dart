import 'dart:developer';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/about_core_entity.dart';
import '../../domain/entities/biography_entity.dart';
import '../../domain/entities/anime_entity.dart';
import '../../domain/entities/music_genre_entity.dart';
import '../../domain/repositories/about_repository.dart';
import '../../../../core/injection/injection_container.dart';

// Events
abstract class AboutSimpleEvent {}

class LoadAboutCore extends AboutSimpleEvent {}
class UpdateAboutCore extends AboutSimpleEvent {
  final String? name;
  final String? currentProfessionId;
  final String? biography;
  final String? featuredBiography;
  final bool? visible;

  UpdateAboutCore({
    this.name,
    this.currentProfessionId,
    this.biography,
    this.featuredBiography,
    this.visible,
  });
}

class LoadBiography extends AboutSimpleEvent {}
class UpdateBiography extends AboutSimpleEvent {
  final String? featuredBiography;
  final String? fullBiography;
  final bool? visible;

  UpdateBiography({
    this.featuredBiography,
    this.fullBiography,
    this.visible,
  });
}

class LoadAnimeList extends AboutSimpleEvent {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? status;
  final String? search;

  LoadAnimeList({
    this.page,
    this.limit,
    this.visible,
    this.status,
    this.search,
  });
}

class LoadAnimeById extends AboutSimpleEvent {
  final String id;

  LoadAnimeById(this.id);
}

class CreateAnime extends AboutSimpleEvent {
  final String title;
  final String? description;
  final String status;
  final String? myAnimeListId;
  final String? coverImage;
  final List<String>? genres;
  final int? episodes;
  final int? currentEpisode;
  final double? rating;
  final int? order;
  final bool? visible;

  CreateAnime({
    required this.title,
    this.description,
    required this.status,
    this.myAnimeListId,
    this.coverImage,
    this.genres,
    this.episodes,
    this.currentEpisode,
    this.rating,
    this.order,
    this.visible,
  });
}

class UpdateAnime extends AboutSimpleEvent {
  final String id;
  final String? title;
  final String? description;
  final String? status;
  final String? myAnimeListId;
  final String? coverImage;
  final List<String>? genres;
  final int? episodes;
  final int? currentEpisode;
  final double? rating;
  final int? order;
  final bool? visible;

  UpdateAnime({
    required this.id,
    this.title,
    this.description,
    this.status,
    this.myAnimeListId,
    this.coverImage,
    this.genres,
    this.episodes,
    this.currentEpisode,
    this.rating,
    this.order,
    this.visible,
  });
}

class DeleteAnime extends AboutSimpleEvent {
  final String id;

  DeleteAnime(this.id);
}

class LoadMusicGenres extends AboutSimpleEvent {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? search;

  LoadMusicGenres({
    this.page,
    this.limit,
    this.visible,
    this.search,
  });
}

class LoadMusicGenreById extends AboutSimpleEvent {
  final String id;

  LoadMusicGenreById(this.id);
}

class CreateMusicGenre extends AboutSimpleEvent {
  final String name;
  final String? description;
  final String? color;
  final int? order;
  final bool? visible;

  CreateMusicGenre({
    required this.name,
    this.description,
    this.color,
    this.order,
    this.visible,
  });
}

class UpdateMusicGenre extends AboutSimpleEvent {
  final String id;
  final String? name;
  final String? description;
  final String? color;
  final int? order;
  final bool? visible;

  UpdateMusicGenre({
    required this.id,
    this.name,
    this.description,
    this.color,
    this.order,
    this.visible,
  });
}

class DeleteMusicGenre extends AboutSimpleEvent {
  final String id;

  DeleteMusicGenre(this.id);
}

// States
abstract class AboutSimpleState {}

class AboutSimpleInitial extends AboutSimpleState {}

class AboutSimpleLoading extends AboutSimpleState {}

class AboutSimpleLoaded extends AboutSimpleState {
  final AboutCoreEntity? aboutCore;
  final BiographyEntity? biography;
  final List<AnimeEntity>? animeList;
  final AnimeEntity? anime;
  final List<MusicGenreEntity>? musicGenres;
  final MusicGenreEntity? musicGenre;

  AboutSimpleLoaded({
    this.aboutCore,
    this.biography,
    this.animeList,
    this.anime,
    this.musicGenres,
    this.musicGenre,
  });
}

class AboutSimpleError extends AboutSimpleState {
  final String message;

  AboutSimpleError(this.message);
}

// BLoC
class AboutSimpleBloc extends Bloc<AboutSimpleEvent, AboutSimpleState> {
  final AboutRepository _aboutRepository = sl<AboutRepository>();

  AboutSimpleBloc() : super(AboutSimpleInitial()) {
    on<LoadAboutCore>(_onLoadAboutCore);
    on<UpdateAboutCore>(_onUpdateAboutCore);
    on<LoadBiography>(_onLoadBiography);
    on<UpdateBiography>(_onUpdateBiography);
    on<LoadAnimeList>(_onLoadAnimeList);
    on<LoadAnimeById>(_onLoadAnimeById);
    on<CreateAnime>(_onCreateAnime);
    on<UpdateAnime>(_onUpdateAnime);
    on<DeleteAnime>(_onDeleteAnime);
    on<LoadMusicGenres>(_onLoadMusicGenres);
    on<LoadMusicGenreById>(_onLoadMusicGenreById);
    on<CreateMusicGenre>(_onCreateMusicGenre);
    on<UpdateMusicGenre>(_onUpdateMusicGenre);
    on<DeleteMusicGenre>(_onDeleteMusicGenre);
  }

  Future<void> _onLoadAboutCore(LoadAboutCore event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Loading about core');
      
      final result = await _aboutRepository.getAboutCore();
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to load about core: ${failure.message}')),
        (aboutCore) => emit(AboutSimpleLoaded(aboutCore: aboutCore)),
      );
      log('✅ AboutSimpleBloc: About core loaded successfully');
    } catch (e) {
      log('❌ AboutSimpleBloc: Error loading about core: $e');
      emit(AboutSimpleError('Failed to load about core: $e'));
    }
  }

  Future<void> _onUpdateAboutCore(UpdateAboutCore event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Updating about core');
      
      final result = await _aboutRepository.updateAboutCore(
        name: event.name,
        currentProfessionId: event.currentProfessionId,
        biography: event.biography,
        featuredBiography: event.featuredBiography,
        visible: event.visible,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to update about core: ${failure.message}')),
        (aboutCore) => emit(AboutSimpleLoaded(aboutCore: aboutCore)),
      );
      log('✅ AboutSimpleBloc: About core updated successfully');
    } catch (e) {
      log('❌ AboutSimpleBloc: Error updating about core: $e');
      emit(AboutSimpleError('Failed to update about core: $e'));
    }
  }

  Future<void> _onLoadBiography(LoadBiography event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Loading biography');
      
      final result = await _aboutRepository.getBiography();
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to load biography: ${failure.message}')),
        (biography) => emit(AboutSimpleLoaded(biography: biography)),
      );
      log('✅ AboutSimpleBloc: Biography loaded successfully');
    } catch (e) {
      log('❌ AboutSimpleBloc: Error loading biography: $e');
      emit(AboutSimpleError('Failed to load biography: $e'));
    }
  }

  Future<void> _onUpdateBiography(UpdateBiography event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Updating biography');
      
      final result = await _aboutRepository.updateBiography(
        featuredBiography: event.featuredBiography,
        fullBiography: event.fullBiography,
        visible: event.visible,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to update biography: ${failure.message}')),
        (biography) => emit(AboutSimpleLoaded(biography: biography)),
      );
      log('✅ AboutSimpleBloc: Biography updated successfully');
    } catch (e) {
      log('❌ AboutSimpleBloc: Error updating biography: $e');
      emit(AboutSimpleError('Failed to update biography: $e'));
    }
  }

  Future<void> _onLoadAnimeList(LoadAnimeList event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Loading anime list');
      
      final result = await _aboutRepository.getAnimeList(
        page: event.page,
        limit: event.limit,
        visible: event.visible,
        status: event.status,
        search: event.search,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to load anime list: ${failure.message}')),
        (animeList) {
          emit(AboutSimpleLoaded(animeList: animeList));
          log('✅ AboutSimpleBloc: Anime list loaded successfully: ${animeList.length} items');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error loading anime list: $e');
      emit(AboutSimpleError('Failed to load anime list: $e'));
    }
  }

  Future<void> _onLoadAnimeById(LoadAnimeById event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Loading anime by ID: ${event.id}');
      
      final result = await _aboutRepository.getAnimeById(event.id);
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to load anime: ${failure.message}')),
        (anime) {
          emit(AboutSimpleLoaded(anime: anime));
          log('✅ AboutSimpleBloc: Anime loaded successfully: ${anime.title}');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error loading anime by ID: $e');
      emit(AboutSimpleError('Failed to load anime: $e'));
    }
  }

  Future<void> _onCreateAnime(CreateAnime event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Creating anime');
      
      final result = await _aboutRepository.createAnime(
        title: event.title,
        description: event.description,
        status: event.status,
        myAnimeListId: event.myAnimeListId,
        coverImage: event.coverImage,
        genres: event.genres,
        episodes: event.episodes,
        currentEpisode: event.currentEpisode,
        rating: event.rating,
        order: event.order ?? 0,
        visible: event.visible ?? true,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to create anime: ${failure.message}')),
        (anime) {
          emit(AboutSimpleLoaded(anime: anime));
          log('✅ AboutSimpleBloc: Anime created successfully: ${anime.title}');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error creating anime: $e');
      emit(AboutSimpleError('Failed to create anime: $e'));
    }
  }

  Future<void> _onUpdateAnime(UpdateAnime event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Updating anime: ${event.id}');
      
      final result = await _aboutRepository.updateAnime(
        id: event.id,
        title: event.title,
        description: event.description,
        status: event.status,
        myAnimeListId: event.myAnimeListId,
        coverImage: event.coverImage,
        genres: event.genres,
        episodes: event.episodes,
        currentEpisode: event.currentEpisode,
        rating: event.rating,
        order: event.order,
        visible: event.visible,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to update anime: ${failure.message}')),
        (anime) {
          emit(AboutSimpleLoaded(anime: anime));
          log('✅ AboutSimpleBloc: Anime updated successfully: ${anime.title}');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error updating anime: $e');
      emit(AboutSimpleError('Failed to update anime: $e'));
    }
  }

  Future<void> _onDeleteAnime(DeleteAnime event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Deleting anime: ${event.id}');
      
      await _aboutRepository.deleteAnime(event.id);
      
      emit(AboutSimpleInitial());
      log('✅ AboutSimpleBloc: Anime deleted successfully');
    } catch (e) {
      log('❌ AboutSimpleBloc: Error deleting anime: $e');
      emit(AboutSimpleError('Failed to delete anime: $e'));
    }
  }

  Future<void> _onLoadMusicGenres(LoadMusicGenres event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Loading music genres');
      
      final result = await _aboutRepository.getMusicGenres(
        page: event.page,
        limit: event.limit,
        visible: event.visible,
        search: event.search,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to load music genres: ${failure.message}')),
        (musicGenres) {
          emit(AboutSimpleLoaded(musicGenres: musicGenres));
          log('✅ AboutSimpleBloc: Music genres loaded successfully: ${musicGenres.length} items');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error loading music genres: $e');
      emit(AboutSimpleError('Failed to load music genres: $e'));
    }
  }

  Future<void> _onLoadMusicGenreById(LoadMusicGenreById event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Loading music genre by ID: ${event.id}');
      
      final result = await _aboutRepository.getMusicGenreById(event.id);
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to load music genre: ${failure.message}')),
        (musicGenre) {
          emit(AboutSimpleLoaded(musicGenre: musicGenre));
          log('✅ AboutSimpleBloc: Music genre loaded successfully: ${musicGenre.name}');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error loading music genre by ID: $e');
      emit(AboutSimpleError('Failed to load music genre: $e'));
    }
  }

  Future<void> _onCreateMusicGenre(CreateMusicGenre event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Creating music genre');
      
      final result = await _aboutRepository.createMusicGenre(
        name: event.name,
        description: event.description,
        order: event.order ?? 0,
        visible: event.visible ?? true,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to create music genre: ${failure.message}')),
        (musicGenre) {
          emit(AboutSimpleLoaded(musicGenre: musicGenre));
          log('✅ AboutSimpleBloc: Music genre created successfully: ${musicGenre.name}');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error creating music genre: $e');
      emit(AboutSimpleError('Failed to create music genre: $e'));
    }
  }

  Future<void> _onUpdateMusicGenre(UpdateMusicGenre event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Updating music genre: ${event.id}');
      
      final result = await _aboutRepository.updateMusicGenre(
        id: event.id,
        name: event.name,
        description: event.description,
        order: event.order,
        visible: event.visible,
      );
      
      result.fold(
        (failure) => emit(AboutSimpleError('Failed to update music genre: ${failure.message}')),
        (musicGenre) {
          emit(AboutSimpleLoaded(musicGenre: musicGenre));
          log('✅ AboutSimpleBloc: Music genre updated successfully: ${musicGenre.name}');
        },
      );
    } catch (e) {
      log('❌ AboutSimpleBloc: Error updating music genre: $e');
      emit(AboutSimpleError('Failed to update music genre: $e'));
    }
  }

  Future<void> _onDeleteMusicGenre(DeleteMusicGenre event, Emitter<AboutSimpleState> emit) async {
    try {
      emit(AboutSimpleLoading());
      log('🔍 AboutSimpleBloc: Deleting music genre: ${event.id}');
      
      await _aboutRepository.deleteMusicGenre(event.id);
      
      emit(AboutSimpleInitial());
      log('✅ AboutSimpleBloc: Music genre deleted successfully');
    } catch (e) {
      log('❌ AboutSimpleBloc: Error deleting music genre: $e');
      emit(AboutSimpleError('Failed to delete music genre: $e'));
    }
  }
}
