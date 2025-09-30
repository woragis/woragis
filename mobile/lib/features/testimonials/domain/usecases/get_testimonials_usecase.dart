import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/testimonial_entity.dart';
import '../repositories/testimonials_repository.dart';

class GetTestimonialsUseCase {
  final TestimonialsRepository repository;

  GetTestimonialsUseCase(this.repository);

  Future<Either<Failure, List<TestimonialEntity>>> call(GetTestimonialsParams params) async {
    return await repository.getTestimonials(
      page: params.page,
      limit: params.limit,
      rating: params.rating,
      featured: params.featured,
      visible: params.visible,
      public: params.public,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    );
  }
}

class GetTestimonialsParams {
  final int? page;
  final int? limit;
  final int? rating;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetTestimonialsParams({
    this.page,
    this.limit,
    this.rating,
    this.featured,
    this.visible,
    this.public,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
