import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/testimonial_entity.dart';
import '../repositories/testimonials_repository.dart';

class CreateTestimonialUseCase {
  final TestimonialsRepository repository;

  CreateTestimonialUseCase(this.repository);

  Future<Either<Failure, TestimonialEntity>> call({
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
  }) async {
    return await repository.createTestimonial(
      name: name,
      position: position,
      company: company,
      content: content,
      avatar: avatar,
      rating: rating,
      featured: featured,
      order: order,
      visible: visible,
      public: public,
    );
  }
}
