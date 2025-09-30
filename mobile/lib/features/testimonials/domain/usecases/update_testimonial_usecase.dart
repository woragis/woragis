import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/testimonial_entity.dart';
import '../repositories/testimonials_repository.dart';

class UpdateTestimonialUseCase {
  final TestimonialsRepository repository;

  UpdateTestimonialUseCase(this.repository);

  Future<Either<Failure, TestimonialEntity>> call({
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
  }) async {
    return await repository.updateTestimonial(
      id: id,
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
