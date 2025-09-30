import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/testimonials_repository.dart';

class DeleteTestimonialUseCase {
  final TestimonialsRepository repository;

  DeleteTestimonialUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteTestimonial(id);
  }
}
