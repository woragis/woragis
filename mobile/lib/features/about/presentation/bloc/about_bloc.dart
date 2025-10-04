import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/about_core_entity.dart';
import '../../domain/entities/biography_entity.dart';
import '../../domain/entities/anime_entity.dart';
import '../../domain/entities/music_genre_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

// Events
abstract class AboutEvent extends Equatable {
  const AboutEvent();

  @override
  List<Object?> get props => [];
}

// About Core Events
class LoadAboutCore extends AboutEvent {
  const LoadAboutCore();
}

class RefreshAboutCore extends AboutEvent {
  const RefreshAboutCore();
}

class UpdateAboutCore extends AboutEvent {
  final String? name;
  final String? currentProfessionId;
  final String? biography;
  final String? featuredBiography;
  final bool? visible;

  const UpdateAboutCore({
    this.name,
    this.currentProfessionId,
    this.biography,
    this.featuredBiography,
    this.visible,
  });

  @override
  List<Object?> get props => [
        name,
        currentProfessionId,
        biography,
        featuredBiography,
        visible,
      ];
}

// Biography Events
class LoadBiography extends AboutEvent {
  const LoadBiography();
}

class UpdateBiography extends AboutEvent {
  final String? featuredBiography;
  final String? fullBiography;
  final bool? visible;

  const UpdateBiography({
    this.featuredBiography,
    this.fullBiography,
    this.visible,
  });

  @override
  List<Object?> get props => [featuredBiography, fullBiography, visible];
}

// Anime Events
class LoadAnimeList extends AboutEvent {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? status;
  final String? search;

  const LoadAnimeList({
    this.page,
    this.limit,
    this.visible,
    this.status,
    this.search,
  });

  @override
  List<Object?> get props => [page, limit, visible, status, search];
}

class GetAnimeById extends AboutEvent {
  final String id;

  const GetAnimeById(this.id);

  @override
  List<Object> get props => [id];
}

class CreateAnime extends AboutEvent {
  final String title;
  final String? description;
  final String status;
  final String? myAnimeListId;
  final String? coverImage;
  final List<String>? genres;
  final int? episodes;
  final int? currentEpisode;
  final double? rating;
  final String? notes;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final int order;
  final bool visible;

  const CreateAnime({
    required this.title,
    this.description,
    required this.status,
    this.myAnimeListId,
    this.coverImage,
    this.genres,
    this.episodes,
    this.currentEpisode,
    this.rating,
    this.notes,
    this.startedAt,
    this.completedAt,
    required this.order,
    required this.visible,
  });

  @override
  List<Object?> get props => [
        title,
        description,
        status,
        myAnimeListId,
        coverImage,
        genres,
        episodes,
        currentEpisode,
        rating,
        notes,
        startedAt,
        completedAt,
        order,
        visible,
      ];
}

class UpdateAnime extends AboutEvent {
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
  final String? notes;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final int? order;
  final bool? visible;

  const UpdateAnime({
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
    this.notes,
    this.startedAt,
    this.completedAt,
    this.order,
    this.visible,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        status,
        myAnimeListId,
        coverImage,
        genres,
        episodes,
        currentEpisode,
        rating,
        notes,
        startedAt,
        completedAt,
        order,
        visible,
      ];
}

class DeleteAnime extends AboutEvent {
  final String id;

  const DeleteAnime(this.id);

  @override
  List<Object> get props => [id];
}

// Music Genre Events
class LoadMusicGenres extends AboutEvent {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? search;

  const LoadMusicGenres({
    this.page,
    this.limit,
    this.visible,
    this.search,
  });

  @override
  List<Object?> get props => [page, limit, visible, search];
}

class CreateMusicGenre extends AboutEvent {
  final String name;
  final String? description;
  final int order;
  final bool visible;

  const CreateMusicGenre({
    required this.name,
    this.description,
    required this.order,
    required this.visible,
  });

  @override
  List<Object?> get props => [name, description, order, visible];
}

class UpdateMusicGenre extends AboutEvent {
  final String id;
  final String? name;
  final String? description;
  final int? order;
  final bool? visible;

  const UpdateMusicGenre({
    required this.id,
    this.name,
    this.description,
    this.order,
    this.visible,
  });

  @override
  List<Object?> get props => [id, name, description, order, visible];
}

class DeleteMusicGenre extends AboutEvent {
  final String id;

  const DeleteMusicGenre(this.id);

  @override
  List<Object> get props => [id];
}

// States
abstract class AboutState extends Equatable {
  const AboutState();

  @override
  List<Object?> get props => [];
}

class AboutInitial extends AboutState {}

class AboutLoading extends AboutState {}

class AboutLoaded extends AboutState {
  final AboutCoreEntity aboutCore;
  final BiographyEntity? biography;
  final List<AnimeEntity> animeList;
  final List<MusicGenreEntity> musicGenres;

  const AboutLoaded({
    required this.aboutCore,
    this.biography,
    required this.animeList,
    required this.musicGenres,
  });

  @override
  List<Object?> get props => [
        aboutCore,
        biography,
        animeList,
        musicGenres,
      ];

  AboutLoaded copyWith({
    AboutCoreEntity? aboutCore,
    BiographyEntity? biography,
    List<AnimeEntity>? animeList,
    List<MusicGenreEntity>? musicGenres,
  }) {
    return AboutLoaded(
      aboutCore: aboutCore ?? this.aboutCore,
      biography: biography ?? this.biography,
      animeList: animeList ?? this.animeList,
      musicGenres: musicGenres ?? this.musicGenres,
    );
  }
}

class AboutCoreUpdated extends AboutState {
  final AboutCoreEntity aboutCore;

  const AboutCoreUpdated(this.aboutCore);

  @override
  List<Object> get props => [aboutCore];
}

class BiographyLoaded extends AboutState {
  final BiographyEntity biography;

  const BiographyLoaded(this.biography);

  @override
  List<Object> get props => [biography];
}

class BiographyUpdated extends AboutState {
  final BiographyEntity biography;

  const BiographyUpdated(this.biography);

  @override
  List<Object> get props => [biography];
}

class AnimeListLoaded extends AboutState {
  final List<AnimeEntity> animeList;

  const AnimeListLoaded(this.animeList);

  @override
  List<Object> get props => [animeList];
}

class AnimeDetailLoaded extends AboutState {
  final AnimeEntity anime;

  const AnimeDetailLoaded(this.anime);

  @override
  List<Object> get props => [anime];
}

class AnimeCreated extends AboutState {
  final AnimeEntity anime;

  const AnimeCreated(this.anime);

  @override
  List<Object> get props => [anime];
}

class AnimeUpdated extends AboutState {
  final AnimeEntity anime;

  const AnimeUpdated(this.anime);

  @override
  List<Object> get props => [anime];
}

class AnimeDeleted extends AboutState {
  final String id;

  const AnimeDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class MusicGenresLoaded extends AboutState {
  final List<MusicGenreEntity> musicGenres;

  const MusicGenresLoaded(this.musicGenres);

  @override
  List<Object> get props => [musicGenres];
}

class MusicGenreCreated extends AboutState {
  final MusicGenreEntity musicGenre;

  const MusicGenreCreated(this.musicGenre);

  @override
  List<Object> get props => [musicGenre];
}

class MusicGenreUpdated extends AboutState {
  final MusicGenreEntity musicGenre;

  const MusicGenreUpdated(this.musicGenre);

  @override
  List<Object> get props => [musicGenre];
}

class MusicGenreDeleted extends AboutState {
  final String id;

  const MusicGenreDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class AboutError extends AboutState {
  final String message;

  const AboutError(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class AboutBloc extends Bloc<AboutEvent, AboutState> {
  final GetAboutCoreUseCase getAboutCoreUseCase;
  final UpdateAboutCoreUseCase updateAboutCoreUseCase;
  final GetBiographyUseCase getBiographyUseCase;
  final UpdateBiographyUseCase updateBiographyUseCase;
  final GetAnimeListUseCase getAnimeListUseCase;
  final GetAnimeByIdUseCase getAnimeByIdUseCase;
  final CreateAnimeUseCase createAnimeUseCase;
  final UpdateAnimeUseCase updateAnimeUseCase;
  final DeleteAnimeUseCase deleteAnimeUseCase;
  final GetMusicGenresUseCase getMusicGenresUseCase;
  final CreateMusicGenreUseCase createMusicGenreUseCase;
  final UpdateMusicGenreUseCase updateMusicGenreUseCase;
  final DeleteMusicGenreUseCase deleteMusicGenreUseCase;

  AboutBloc({
    required this.getAboutCoreUseCase,
    required this.updateAboutCoreUseCase,
    required this.getBiographyUseCase,
    required this.updateBiographyUseCase,
    required this.getAnimeListUseCase,
    required this.getAnimeByIdUseCase,
    required this.createAnimeUseCase,
    required this.updateAnimeUseCase,
    required this.deleteAnimeUseCase,
    required this.getMusicGenresUseCase,
    required this.createMusicGenreUseCase,
    required this.updateMusicGenreUseCase,
    required this.deleteMusicGenreUseCase,
  }) : super(AboutInitial()) {
    on<LoadAboutCore>(_onLoadAboutCore);
    on<RefreshAboutCore>(_onRefreshAboutCore);
    on<UpdateAboutCore>(_onUpdateAboutCore);
    on<LoadBiography>(_onLoadBiography);
    on<UpdateBiography>(_onUpdateBiography);
    on<LoadAnimeList>(_onLoadAnimeList);
    on<GetAnimeById>(_onGetAnimeById);
    on<CreateAnime>(_onCreateAnime);
    on<UpdateAnime>(_onUpdateAnime);
    on<DeleteAnime>(_onDeleteAnime);
    on<LoadMusicGenres>(_onLoadMusicGenres);
    on<CreateMusicGenre>(_onCreateMusicGenre);
    on<UpdateMusicGenre>(_onUpdateMusicGenre);
    on<DeleteMusicGenre>(_onDeleteMusicGenre);
  }

  // About Core Handlers
  Future<void> _onLoadAboutCore(
    LoadAboutCore event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    try {
      final result = await getAboutCoreUseCase();

      result.fold(
        (failure) => emit(AboutError(failure.message)),
        (aboutCore) async {
          // Also load biography, anime, and music genres
          final biographyResult = await getBiographyUseCase();
          final animeResult = await getAnimeListUseCase();
          final musicGenresResult = await getMusicGenresUseCase();

          BiographyEntity? biography;
          List<AnimeEntity> animeList = [];
          List<MusicGenreEntity> musicGenres = [];

          biographyResult.fold(
            (_) => biography = null,
            (b) => biography = b,
          );

          animeResult.fold(
            (_) => animeList = [],
            (list) => animeList = list,
          );

          musicGenresResult.fold(
            (_) => musicGenres = [],
            (list) => musicGenres = list,
          );

          emit(AboutLoaded(
            aboutCore: aboutCore,
            biography: biography,
            animeList: animeList,
            musicGenres: musicGenres,
          ));
        },
      );
    } catch (e) {
      emit(AboutError('Failed to load about information: $e'));
    }
  }

  Future<void> _onRefreshAboutCore(
    RefreshAboutCore event,
    Emitter<AboutState> emit,
  ) async {
    add(const LoadAboutCore());
  }

  Future<void> _onUpdateAboutCore(
    UpdateAboutCore event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await updateAboutCoreUseCase(
      name: event.name,
      currentProfessionId: event.currentProfessionId,
      biography: event.biography,
      featuredBiography: event.featuredBiography,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (aboutCore) => emit(AboutCoreUpdated(aboutCore)),
    );
  }

  // Biography Handlers
  Future<void> _onLoadBiography(
    LoadBiography event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await getBiographyUseCase();

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (biography) => emit(BiographyLoaded(biography)),
    );
  }

  Future<void> _onUpdateBiography(
    UpdateBiography event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await updateBiographyUseCase(
      featuredBiography: event.featuredBiography,
      fullBiography: event.fullBiography,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (biography) => emit(BiographyUpdated(biography)),
    );
  }

  // Anime Handlers
  Future<void> _onLoadAnimeList(
    LoadAnimeList event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await getAnimeListUseCase(
      page: event.page,
      limit: event.limit,
      visible: event.visible,
      status: event.status,
      search: event.search,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (animeList) => emit(AnimeListLoaded(animeList)),
    );
  }

  Future<void> _onGetAnimeById(
    GetAnimeById event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await getAnimeByIdUseCase(event.id);

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (anime) => emit(AnimeDetailLoaded(anime)),
    );
  }

  Future<void> _onCreateAnime(
    CreateAnime event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await createAnimeUseCase(
      title: event.title,
      description: event.description,
      status: event.status,
      myAnimeListId: event.myAnimeListId,
      coverImage: event.coverImage,
      genres: event.genres,
      episodes: event.episodes,
      currentEpisode: event.currentEpisode,
      rating: event.rating,
      notes: event.notes,
      startedAt: event.startedAt,
      completedAt: event.completedAt,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (anime) => emit(AnimeCreated(anime)),
    );
  }

  Future<void> _onUpdateAnime(
    UpdateAnime event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await updateAnimeUseCase(
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
      notes: event.notes,
      startedAt: event.startedAt,
      completedAt: event.completedAt,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (anime) => emit(AnimeUpdated(anime)),
    );
  }

  Future<void> _onDeleteAnime(
    DeleteAnime event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await deleteAnimeUseCase(event.id);

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (_) => emit(AnimeDeleted(event.id)),
    );
  }

  // Music Genre Handlers
  Future<void> _onLoadMusicGenres(
    LoadMusicGenres event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await getMusicGenresUseCase(
      page: event.page,
      limit: event.limit,
      visible: event.visible,
      search: event.search,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (musicGenres) => emit(MusicGenresLoaded(musicGenres)),
    );
  }

  Future<void> _onCreateMusicGenre(
    CreateMusicGenre event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await createMusicGenreUseCase(
      name: event.name,
      description: event.description,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (musicGenre) => emit(MusicGenreCreated(musicGenre)),
    );
  }

  Future<void> _onUpdateMusicGenre(
    UpdateMusicGenre event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await updateMusicGenreUseCase(
      id: event.id,
      name: event.name,
      description: event.description,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (musicGenre) => emit(MusicGenreUpdated(musicGenre)),
    );
  }

  Future<void> _onDeleteMusicGenre(
    DeleteMusicGenre event,
    Emitter<AboutState> emit,
  ) async {
    emit(AboutLoading());

    final result = await deleteMusicGenreUseCase(event.id);

    result.fold(
      (failure) => emit(AboutError(failure.message)),
      (_) => emit(MusicGenreDeleted(event.id)),
    );
  }
}

// Factory function
AboutBloc createAboutBloc() {
  return AboutBloc(
    getAboutCoreUseCase: sl<GetAboutCoreUseCase>(),
    updateAboutCoreUseCase: sl<UpdateAboutCoreUseCase>(),
    getBiographyUseCase: sl<GetBiographyUseCase>(),
    updateBiographyUseCase: sl<UpdateBiographyUseCase>(),
    getAnimeListUseCase: sl<GetAnimeListUseCase>(),
    getAnimeByIdUseCase: sl<GetAnimeByIdUseCase>(),
    createAnimeUseCase: sl<CreateAnimeUseCase>(),
    updateAnimeUseCase: sl<UpdateAnimeUseCase>(),
    deleteAnimeUseCase: sl<DeleteAnimeUseCase>(),
    getMusicGenresUseCase: sl<GetMusicGenresUseCase>(),
    createMusicGenreUseCase: sl<CreateMusicGenreUseCase>(),
    updateMusicGenreUseCase: sl<UpdateMusicGenreUseCase>(),
    deleteMusicGenreUseCase: sl<DeleteMusicGenreUseCase>(),
  );
}