import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/education_entity.dart';
import '../models/education_model.dart';

abstract class EducationRemoteDataSource {
  Future<List<EducationEntity>> getEducationList({
    int? page,
    int? limit,
    bool? visible,
    String? type,
    String? degreeLevel,
    String? institution,
    String? search,
  });

  Future<EducationEntity> getEducationById(String id);
  Future<EducationEntity> createEducation({
    required String title,
    required String institution,
    String? description,
    required String type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    required int order,
    required bool visible,
  });
  Future<EducationEntity> updateEducation({
    required String id,
    String? title,
    String? institution,
    String? description,
    String? type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    int? order,
    bool? visible,
  });
  Future<void> deleteEducation(String id);
  Future<void> updateEducationOrder(List<Map<String, dynamic>> educationOrders);
}

class EducationRemoteDataSourceImpl implements EducationRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  EducationRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  @override
  Future<List<EducationEntity>> getEducationList({
    int? page,
    int? limit,
    bool? visible,
    String? type,
    String? degreeLevel,
    String? institution,
    String? search,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (type != null) queryParams['type'] = type;
      if (degreeLevel != null) queryParams['degreeLevel'] = degreeLevel;
      if (institution != null) queryParams['institution'] = institution;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      final uri = Uri.parse('$baseUrl/education').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final educationList = (data['data']['education'] as List)
              .map((educationJson) => EducationModel.fromJson(educationJson).toEntity())
              .toList();
          return educationList;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch education list');
        }
      } else {
        throw ServerException('Failed to fetch education list with status ${response.statusCode}');
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
  Future<EducationEntity> getEducationById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/education/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return EducationModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch education');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Education not found');
      } else {
        throw ServerException('Failed to fetch education with status ${response.statusCode}');
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
  Future<EducationEntity> createEducation({
    required String title,
    required String institution,
    String? description,
    required String type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    required int order,
    required bool visible,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/education'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          'institution': institution,
          if (description != null) 'description': description,
          'type': type,
          if (degreeLevel != null) 'degreeLevel': degreeLevel,
          if (fieldOfStudy != null) 'fieldOfStudy': fieldOfStudy,
          if (startDate != null) 'startDate': startDate.toIso8601String(),
          if (endDate != null) 'endDate': endDate.toIso8601String(),
          if (completionDate != null) 'completionDate': completionDate.toIso8601String(),
          if (grade != null) 'grade': grade,
          if (credits != null) 'credits': credits,
          if (certificateId != null) 'certificateId': certificateId,
          if (issuer != null) 'issuer': issuer,
          if (validityPeriod != null) 'validityPeriod': validityPeriod,
          if (pdfDocument != null) 'pdfDocument': pdfDocument,
          if (verificationUrl != null) 'verificationUrl': verificationUrl,
          if (skills != null) 'skills': skills,
          'order': order,
          'visible': visible,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return EducationModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create education');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create education with status ${response.statusCode}');
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
  Future<EducationEntity> updateEducation({
    required String id,
    String? title,
    String? institution,
    String? description,
    String? type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    int? order,
    bool? visible,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/education/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (institution != null) 'institution': institution,
          if (description != null) 'description': description,
          if (type != null) 'type': type,
          if (degreeLevel != null) 'degreeLevel': degreeLevel,
          if (fieldOfStudy != null) 'fieldOfStudy': fieldOfStudy,
          if (startDate != null) 'startDate': startDate.toIso8601String(),
          if (endDate != null) 'endDate': endDate.toIso8601String(),
          if (completionDate != null) 'completionDate': completionDate.toIso8601String(),
          if (grade != null) 'grade': grade,
          if (credits != null) 'credits': credits,
          if (certificateId != null) 'certificateId': certificateId,
          if (issuer != null) 'issuer': issuer,
          if (validityPeriod != null) 'validityPeriod': validityPeriod,
          if (pdfDocument != null) 'pdfDocument': pdfDocument,
          if (verificationUrl != null) 'verificationUrl': verificationUrl,
          if (skills != null) 'skills': skills,
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return EducationModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update education');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Education not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update education with status ${response.statusCode}');
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
  Future<void> deleteEducation(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/education/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Education not found');
        } else {
          throw ServerException('Failed to delete education with status ${response.statusCode}');
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
  Future<void> updateEducationOrder(List<Map<String, dynamic>> educationOrders) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/education/order'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'educationOrders': educationOrders}),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to update education order with status ${response.statusCode}');
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
