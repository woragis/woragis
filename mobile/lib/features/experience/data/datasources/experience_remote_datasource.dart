import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/experience_entity.dart';
import '../models/experience_model.dart';

abstract class ExperienceRemoteDataSource {
  Future<List<ExperienceEntity>> getExperienceList({
    int? page,
    int? limit,
    bool? visible,
    String? company,
    String? search,
  });

  Future<ExperienceEntity> getExperienceById(String id);
  Future<ExperienceEntity> createExperience({
    required String title,
    required String company,
    required String period,
    required String location,
    required String description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    required int order,
    required bool visible,
  });
  Future<ExperienceEntity> updateExperience({
    required String id,
    String? title,
    String? company,
    String? period,
    String? location,
    String? description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    int? order,
    bool? visible,
  });
  Future<void> deleteExperience(String id);
  Future<void> updateExperienceOrder(List<Map<String, dynamic>> experienceOrders);
}

class ExperienceRemoteDataSourceImpl implements ExperienceRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  ExperienceRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  @override
  Future<List<ExperienceEntity>> getExperienceList({
    int? page,
    int? limit,
    bool? visible,
    String? company,
    String? search,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (company != null) queryParams['company'] = company;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      final uri = Uri.parse('$baseUrl/experience').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final experienceList = (data['data']['experience'] as List)
              .map((experienceJson) => ExperienceModel.fromJson(experienceJson).toEntity())
              .toList();
          return experienceList;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch experience list');
        }
      } else {
        throw ServerException('Failed to fetch experience list with status ${response.statusCode}');
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
  Future<ExperienceEntity> getExperienceById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/experience/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ExperienceModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch experience');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Experience not found');
      } else {
        throw ServerException('Failed to fetch experience with status ${response.statusCode}');
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
  Future<ExperienceEntity> createExperience({
    required String title,
    required String company,
    required String period,
    required String location,
    required String description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    required int order,
    required bool visible,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/experience'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          'company': company,
          'period': period,
          'location': location,
          'description': description,
          if (achievements != null) 'achievements': achievements,
          if (technologies != null) 'technologies': technologies,
          if (icon != null) 'icon': icon,
          'order': order,
          'visible': visible,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ExperienceModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create experience');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create experience with status ${response.statusCode}');
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
  Future<ExperienceEntity> updateExperience({
    required String id,
    String? title,
    String? company,
    String? period,
    String? location,
    String? description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    int? order,
    bool? visible,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/experience/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (company != null) 'company': company,
          if (period != null) 'period': period,
          if (location != null) 'location': location,
          if (description != null) 'description': description,
          if (achievements != null) 'achievements': achievements,
          if (technologies != null) 'technologies': technologies,
          if (icon != null) 'icon': icon,
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ExperienceModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update experience');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Experience not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update experience with status ${response.statusCode}');
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
  Future<void> deleteExperience(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/experience/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Experience not found');
        } else {
          throw ServerException('Failed to delete experience with status ${response.statusCode}');
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

  @override
  Future<void> updateExperienceOrder(List<Map<String, dynamic>> experienceOrders) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/experience/order'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'experienceOrders': experienceOrders}),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to update experience order with status ${response.statusCode}');
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
}
