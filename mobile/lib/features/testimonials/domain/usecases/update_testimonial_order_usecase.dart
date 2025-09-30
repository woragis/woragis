import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/testimonials_repository.dart';

class UpdateTestimonialOrderUseCase {
  final TestimonialsRepository repository;

  UpdateTestimonialOrderUseCase(this.repository);

  Future<Either<Failure, void>> call(
    List<Map<String, dynamic>> testimonialOrders,
  ) async {
    return await repository.updateTestimonialOrder(testimonialOrders);
  }
}
