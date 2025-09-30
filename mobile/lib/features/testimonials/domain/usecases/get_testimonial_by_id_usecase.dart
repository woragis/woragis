import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/testimonial_entity.dart';
import '../repositories/testimonials_repository.dart';

class GetTestimonialByIdUseCase {
  final TestimonialsRepository repository;

  GetTestimonialByIdUseCase(this.repository);

  Future<Either<Failure, TestimonialEntity>> call(String id) async {
    return await repository.getTestimonialById(id);
  }
}
