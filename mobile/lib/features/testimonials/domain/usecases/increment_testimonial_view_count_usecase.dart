import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/testimonials_repository.dart';

class IncrementTestimonialViewCountUseCase {
  final TestimonialsRepository repository;

  IncrementTestimonialViewCountUseCase(this.repository);

  Future<Either<Failure, void>> call(String testimonialId) async {
    return await repository.incrementViewCount(testimonialId);
  }
}
