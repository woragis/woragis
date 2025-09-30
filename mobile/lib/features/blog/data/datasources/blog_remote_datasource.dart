import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/blog_post_entity.dart';
import '../../domain/entities/blog_tag_entity.dart';
import '../models/blog_post_model.dart';
import '../models/blog_tag_model.dart';

abstract class BlogRemoteDataSource {
  // Blog posts
  Future<List<BlogPostEntity>> getBlogPosts({
    int? page,
    int? limit,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<BlogPostEntity> getBlogPostById(String id);
  Future<BlogPostEntity> getBlogPostBySlug(String slug);
  Future<BlogPostEntity> createBlogPost({
    required String title,
    required String slug,
    required String excerpt,
    required String content,
    String? featuredImage,
    int? readingTime,
    required bool featured,
    required bool published,
    DateTime? publishedAt,
    required int order,
    required bool visible,
    required bool public,
  });
  Future<BlogPostEntity> updateBlogPost({
    required String id,
    String? title,
    String? slug,
    String? excerpt,
    String? content,
    String? featuredImage,
    int? readingTime,
    bool? featured,
    bool? published,
    DateTime? publishedAt,
    int? order,
    bool? visible,
    bool? public,
  });
  Future<void> deleteBlogPost(String id);

  // Blog tags
  Future<List<BlogTagEntity>> getBlogTags({
    int? page,
    int? limit,
    bool? visible,
    String? search,
  });
  Future<BlogTagEntity> getBlogTagById(String id);
  Future<BlogTagEntity> getBlogTagBySlug(String slug);
  Future<BlogTagEntity> createBlogTag({
    required String name,
    required String slug,
    String? description,
    String? color,
  });
  Future<BlogTagEntity> updateBlogTag({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? color,
  });
  Future<void> deleteBlogTag(String id);

  // Blog post tags relationship
  Future<void> assignTagToPost({required String postId, required String tagId});
  Future<void> removeTagFromPost({required String postId, required String tagId});
  Future<List<BlogTagEntity>> getPostTags(String postId);

  // Statistics
  Future<void> incrementViewCount(String postId);
  Future<void> incrementLikeCount(String postId);
}

class BlogRemoteDataSourceImpl implements BlogRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  BlogRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  @override
  Future<List<BlogPostEntity>> getBlogPosts({
    int? page,
    int? limit,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (published != null) queryParams['published'] = published.toString();
      if (featured != null) queryParams['featured'] = featured.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (public != null) queryParams['public'] = public.toString();
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      final uri = Uri.parse('$baseUrl/admin/blog').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final posts = (data['data']['posts'] as List)
              .map((postJson) => BlogPostModel.fromJson(postJson).toEntity())
              .toList();
          return posts;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch blog posts');
        }
      } else {
        throw ServerException('Failed to fetch blog posts with status ${response.statusCode}');
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
  Future<BlogPostEntity> getBlogPostById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/blog/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogPostModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch blog post');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Blog post not found');
      } else {
        throw ServerException('Failed to fetch blog post with status ${response.statusCode}');
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
  Future<BlogPostEntity> getBlogPostBySlug(String slug) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/blog/slug/$slug'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogPostModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch blog post');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Blog post not found');
      } else {
        throw ServerException('Failed to fetch blog post with status ${response.statusCode}');
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
  Future<BlogPostEntity> createBlogPost({
    required String title,
    required String slug,
    required String excerpt,
    required String content,
    String? featuredImage,
    int? readingTime,
    required bool featured,
    required bool published,
    DateTime? publishedAt,
    required int order,
    required bool visible,
    required bool public,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/blog'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          'slug': slug,
          'excerpt': excerpt,
          'content': content,
          if (featuredImage != null) 'featuredImage': featuredImage,
          if (readingTime != null) 'readingTime': readingTime,
          'featured': featured,
          'published': published,
          if (publishedAt != null) 'publishedAt': publishedAt.toIso8601String(),
          'order': order,
          'visible': visible,
          'public': public,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogPostModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create blog post');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create blog post with status ${response.statusCode}');
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
  Future<BlogPostEntity> updateBlogPost({
    required String id,
    String? title,
    String? slug,
    String? excerpt,
    String? content,
    String? featuredImage,
    int? readingTime,
    bool? featured,
    bool? published,
    DateTime? publishedAt,
    int? order,
    bool? visible,
    bool? public,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/blog/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (slug != null) 'slug': slug,
          if (excerpt != null) 'excerpt': excerpt,
          if (content != null) 'content': content,
          if (featuredImage != null) 'featuredImage': featuredImage,
          if (readingTime != null) 'readingTime': readingTime,
          if (featured != null) 'featured': featured,
          if (published != null) 'published': published,
          if (publishedAt != null) 'publishedAt': publishedAt.toIso8601String(),
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
          if (public != null) 'public': public,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogPostModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update blog post');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Blog post not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update blog post with status ${response.statusCode}');
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
  Future<void> deleteBlogPost(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/admin/blog/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Blog post not found');
        } else {
          throw ServerException('Failed to delete blog post with status ${response.statusCode}');
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

  // Blog Tags Implementation
  @override
  Future<List<BlogTagEntity>> getBlogTags({
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

      final uri = Uri.parse('$baseUrl/admin/blog-tags').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final tags = (data['data']['tags'] as List)
              .map((tagJson) => BlogTagModel.fromJson(tagJson).toEntity())
              .toList();
          return tags;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch blog tags');
        }
      } else {
        throw ServerException('Failed to fetch blog tags with status ${response.statusCode}');
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
  Future<BlogTagEntity> getBlogTagById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/blog-tags/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogTagModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch blog tag');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Blog tag not found');
      } else {
        throw ServerException('Failed to fetch blog tag with status ${response.statusCode}');
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
  Future<BlogTagEntity> getBlogTagBySlug(String slug) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/blog-tags/slug/$slug'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogTagModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch blog tag');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Blog tag not found');
      } else {
        throw ServerException('Failed to fetch blog tag with status ${response.statusCode}');
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
  Future<BlogTagEntity> createBlogTag({
    required String name,
    required String slug,
    String? description,
    String? color,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/blog-tags'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'slug': slug,
          if (description != null) 'description': description,
          if (color != null) 'color': color,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogTagModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create blog tag');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create blog tag with status ${response.statusCode}');
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
  Future<BlogTagEntity> updateBlogTag({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? color,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/blog-tags/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (name != null) 'name': name,
          if (slug != null) 'slug': slug,
          if (description != null) 'description': description,
          if (color != null) 'color': color,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return BlogTagModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update blog tag');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Blog tag not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update blog tag with status ${response.statusCode}');
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
  Future<void> deleteBlogTag(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/admin/blog-tags/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Blog tag not found');
        } else {
          throw ServerException('Failed to delete blog tag with status ${response.statusCode}');
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

  // Blog Post Tags Relationship Methods
  @override
  Future<void> assignTagToPost({required String postId, required String tagId}) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/blog/$postId/tags'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'tagId': tagId}),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw ServerException('Failed to assign tag to post with status ${response.statusCode}');
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
  Future<void> removeTagFromPost({required String postId, required String tagId}) async {
    try {
      final response = await client.delete(
        Uri.parse('$baseUrl/admin/blog/$postId/tags/$tagId'),
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw ServerException('Failed to remove tag from post with status ${response.statusCode}');
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
  Future<List<BlogTagEntity>> getPostTags(String postId) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/blog/$postId/tags'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final tags = (data['data'] as List)
              .map((tagJson) => BlogTagModel.fromJson(tagJson).toEntity())
              .toList();
          return tags;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch post tags');
        }
      } else {
        throw ServerException('Failed to fetch post tags with status ${response.statusCode}');
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
  Future<void> incrementViewCount(String postId) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/blog/$postId/view'),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to increment view count with status ${response.statusCode}');
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
  Future<void> incrementLikeCount(String postId) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/blog/$postId/like'),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to increment like count with status ${response.statusCode}');
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
