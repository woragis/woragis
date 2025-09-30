// Testimonials Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/testimonial_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class TestimonialsQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<List<TestimonialEntity>> getTestimonials({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    int? rating,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl<GetTestimonialsUseCase>();
    final result = await useCase(GetTestimonialsParams(
      page: page,
      limit: limit,
      featured: featured,
      visible: visible,
      public: public,
      rating: rating,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    ));
    return result.fold(
      (failure) => throw Exception(failure.message),
      (testimonials) => testimonials,
    );
  }

  // TODO: Add more query methods as use cases are implemented
  // static Future<TestimonialEntity> getTestimonialById(String id) async { ... }
  // static Future<TestimonialEntity> createTestimonial(CreateTestimonialParams params) async { ... }
  // static Future<TestimonialEntity> updateTestimonial(UpdateTestimonialParams params) async { ... }
  // static Future<void> deleteTestimonial(String id) async { ... }
  // static Future<void> updateTestimonialOrder(List<Map<String, dynamic>> orders) async { ... }
  // static Future<void> incrementViewCount(String testimonialId) async { ... }
  // static Future<void> incrementLikeCount(String testimonialId) async { ... }
}
