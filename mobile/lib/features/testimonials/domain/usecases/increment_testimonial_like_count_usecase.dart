import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/testimonials_repository.dart';

class IncrementTestimonialLikeCountUseCase {
  final TestimonialsRepository repository;

  IncrementTestimonialLikeCountUseCase(this.repository);

  Future<Either<Failure, void>> call(String testimonialId) async {
    return await repository.incrementLikeCount(testimonialId);
  }
}
