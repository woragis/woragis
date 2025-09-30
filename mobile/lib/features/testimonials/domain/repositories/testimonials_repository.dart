import 'package:dartz/dartz.dart';
import '../entities/testimonial_entity.dart';
import '../../../../core/error/failures.dart';

abstract class TestimonialsRepository {
  // Testimonial methods
  Future<Either<Failure, List<TestimonialEntity>>> getTestimonials({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    int? rating,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<Either<Failure, TestimonialEntity>> getTestimonialById(String id);

  Future<Either<Failure, TestimonialEntity>> createTestimonial({
    required String name,
    required String position,
    required String company,
    required String content,
    String? avatar,
    required int rating,
    required bool featured,
    required int order,
    required bool visible,
    required bool public,
  });

  Future<Either<Failure, TestimonialEntity>> updateTestimonial({
    required String id,
    String? name,
    String? position,
    String? company,
    String? content,
    String? avatar,
    int? rating,
    bool? featured,
    int? order,
    bool? visible,
    bool? public,
  });

  Future<Either<Failure, void>> deleteTestimonial(String id);

  // Testimonial ordering methods
  Future<Either<Failure, void>> updateTestimonialOrder(
    List<Map<String, dynamic>> testimonialOrders,
  );

  // Statistics methods
  Future<Either<Failure, void>> incrementViewCount(String testimonialId);
  Future<Either<Failure, void>> incrementLikeCount(String testimonialId);

  // Offline/Cache methods
  Future<Either<Failure, List<TestimonialEntity>>> getCachedTestimonials();
  Future<Either<Failure, void>> cacheTestimonials(List<TestimonialEntity> testimonials);
  Future<Either<Failure, TestimonialEntity?>> getCachedTestimonial(String id);
  Future<Either<Failure, void>> cacheTestimonial(TestimonialEntity testimonial);
}
