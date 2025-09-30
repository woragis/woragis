import 'package:equatable/equatable.dart';

enum AnimeStatus { watching, completed, onHold, dropped, planToWatch }

class AnimeEntity extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String? description;
  final AnimeStatus status;
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
  final DateTime createdAt;
  final DateTime updatedAt;

  const AnimeEntity({
    required this.id,
    required this.userId,
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
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
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
        createdAt,
        updatedAt,
      ];

  AnimeEntity copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    AnimeStatus? status,
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
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AnimeEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      myAnimeListId: myAnimeListId ?? this.myAnimeListId,
      coverImage: coverImage ?? this.coverImage,
      genres: genres ?? this.genres,
      episodes: episodes ?? this.episodes,
      currentEpisode: currentEpisode ?? this.currentEpisode,
      rating: rating ?? this.rating,
      notes: notes ?? this.notes,
      startedAt: startedAt ?? this.startedAt,
      completedAt: completedAt ?? this.completedAt,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
