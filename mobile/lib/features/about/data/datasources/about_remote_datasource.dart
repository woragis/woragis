import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/about_core_entity.dart';
import '../../domain/entities/biography_entity.dart';
import '../../domain/entities/anime_entity.dart';
import '../../domain/entities/music_genre_entity.dart';
import '../models/about_core_model.dart';
import '../models/biography_model.dart';
import '../models/anime_model.dart';
import '../models/music_genre_model.dart';

abstract class AboutRemoteDataSource {
  // About core methods
  Future<AboutCoreEntity> getAboutCore();
  Future<AboutCoreEntity> updateAboutCore({
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
  });

  // Biography methods
  Future<BiographyEntity> getBiography();
  Future<BiographyEntity> updateBiography({
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
  });

  // Anime methods
  Future<List<AnimeEntity>> getAnimeList({
    int? page,
    int? limit,
    bool? visible,
    String? status,
    String? search,
  });

  Future<AnimeEntity> getAnimeById(String id);
  Future<AnimeEntity> createAnime({
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

  Future<AnimeEntity> updateAnime({
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

  Future<void> deleteAnime(String id);

  // Music genre methods
  Future<List<MusicGenreEntity>> getMusicGenres({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  });

  Future<MusicGenreEntity> getMusicGenreById(String id);
  Future<MusicGenreEntity> createMusicGenre({
    required String name,
    String? description,
    required int order,
    required bool visible,
  });

  Future<MusicGenreEntity> updateMusicGenre({
    required String id,
    String? name,
    String? description,
    int? order,
    bool? visible,
  });

  Future<void> deleteMusicGenre(String id);
}

class AboutRemoteDataSourceImpl implements AboutRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  AboutRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  // About Core Implementation
  @override
  Future<AboutCoreEntity> getAboutCore() async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/about/core'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AboutCoreModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch about core');
        }
      } else {
        throw ServerException('Failed to fetch about core with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AboutCoreEntity> updateAboutCore({
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/about/core'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (name != null) 'name': name,
          if (currentProfessionId != null) 'currentProfessionId': currentProfessionId,
          if (biography != null) 'biography': biography,
          if (featuredBiography != null) 'featuredBiography': featuredBiography,
          if (visible != null) 'visible': visible,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AboutCoreModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update about core');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update about core with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  // Biography Implementation
  @override
  Future<BiographyEntity> getBiography() async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/about/biography'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BiographyModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch biography');
        }
      } else {
        throw ServerException('Failed to fetch biography with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<BiographyEntity> updateBiography({
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/about/biography'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (featuredBiography != null) 'featuredBiography': featuredBiography,
          if (fullBiography != null) 'fullBiography': fullBiography,
          if (visible != null) 'visible': visible,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BiographyModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update biography');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update biography with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  // Anime Implementation
  @override
  Future<List<AnimeEntity>> getAnimeList({
    int? page,
    int? limit,
    bool? visible,
    String? status,
    String? search,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (status != null) queryParams['status'] = status;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      final uri = Uri.parse('$baseUrl/admin/about/anime').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final animeList = (data['data']['anime'] as List)
              .map((animeJson) => AnimeModel.fromJson(animeJson).toEntity())
              .toList();
          return animeList;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch anime list');
        }
      } else {
        throw ServerException('Failed to fetch anime list with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AnimeEntity> getAnimeById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/about/anime/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AnimeModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch anime');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Anime not found');
      } else {
        throw ServerException('Failed to fetch anime with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AnimeEntity> createAnime({
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
      final response = await client.post(
        Uri.parse('$baseUrl/admin/about/anime'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          if (description != null) 'description': description,
          'status': status,
          if (myAnimeListId != null) 'myAnimeListId': myAnimeListId,
          if (coverImage != null) 'coverImage': coverImage,
          if (genres != null) 'genres': genres,
          if (episodes != null) 'episodes': episodes,
          if (currentEpisode != null) 'currentEpisode': currentEpisode,
          if (rating != null) 'rating': rating,
          if (notes != null) 'notes': notes,
          if (startedAt != null) 'startedAt': startedAt.toIso8601String(),
          if (completedAt != null) 'completedAt': completedAt.toIso8601String(),
          'order': order,
          'visible': visible,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AnimeModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create anime');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create anime with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AnimeEntity> updateAnime({
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
      final response = await client.put(
        Uri.parse('$baseUrl/admin/about/anime/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (description != null) 'description': description,
          if (status != null) 'status': status,
          if (myAnimeListId != null) 'myAnimeListId': myAnimeListId,
          if (coverImage != null) 'coverImage': coverImage,
          if (genres != null) 'genres': genres,
          if (episodes != null) 'episodes': episodes,
          if (currentEpisode != null) 'currentEpisode': currentEpisode,
          if (rating != null) 'rating': rating,
          if (notes != null) 'notes': notes,
          if (startedAt != null) 'startedAt': startedAt.toIso8601String(),
          if (completedAt != null) 'completedAt': completedAt.toIso8601String(),
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AnimeModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update anime');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Anime not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update anime with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteAnime(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/admin/about/anime/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Anime not found');
        } else {
          throw ServerException('Failed to delete anime with status ${response.statusCode}');
        }
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  // Music Genre Implementation
  @override
  Future<List<MusicGenreEntity>> getMusicGenres({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      final uri = Uri.parse('$baseUrl/admin/about/music/genres').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final musicGenres = (data['data']['musicGenres'] as List)
              .map((genreJson) => MusicGenreModel.fromJson(genreJson).toEntity())
              .toList();
          return musicGenres;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch music genres');
        }
      } else {
        throw ServerException('Failed to fetch music genres with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<MusicGenreEntity> getMusicGenreById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/about/music/genres/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return MusicGenreModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch music genre');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Music genre not found');
      } else {
        throw ServerException('Failed to fetch music genre with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<MusicGenreEntity> createMusicGenre({
    required String name,
    String? description,
    required int order,
    required bool visible,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/about/music/genres'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          if (description != null) 'description': description,
          'order': order,
          'visible': visible,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return MusicGenreModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create music genre');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create music genre with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<MusicGenreEntity> updateMusicGenre({
    required String id,
    String? name,
    String? description,
    int? order,
    bool? visible,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/about/music/genres/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (name != null) 'name': name,
          if (description != null) 'description': description,
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return MusicGenreModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update music genre');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Music genre not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update music genre with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteMusicGenre(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/admin/about/music/genres/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Music genre not found');
        } else {
          throw ServerException('Failed to delete music genre with status ${response.statusCode}');
        }
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }
}
