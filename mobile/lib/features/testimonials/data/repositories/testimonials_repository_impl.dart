import 'package:dartz/dartz.dart';
import '../../domain/entities/testimonial_entity.dart';
import '../../domain/repositories/testimonials_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/testimonials_local_datasource.dart';
import '../datasources/testimonials_remote_datasource.dart';

class TestimonialsRepositoryImpl implements TestimonialsRepository {
  final TestimonialsRemoteDataSource remoteDataSource;
  final TestimonialsLocalDataSource localDataSource;

  TestimonialsRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, List<TestimonialEntity>>> getTestimonials({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final testimonials = await remoteDataSource.getTestimonials(
        page: page,
        limit: limit,
        visible: visible,
        public: public,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );

      // Cache the testimonials locally
      await localDataSource.cacheTestimonials(testimonials);

      return Right(testimonials);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedTestimonials = await localDataSource.getCachedTestimonials();
        return Right(cachedTestimonials);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, TestimonialEntity>> getTestimonialById(String id) async {
    try {
      final testimonial = await remoteDataSource.getTestimonialById(id);
      return Right(testimonial);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedTestimonial = await localDataSource.getCachedTestimonial(id);
        if (cachedTestimonial != null) {
          return Right(cachedTestimonial);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, TestimonialEntity>> createTestimonial({
    required String clientName,
    required String clientPosition,
    required String clientCompany,
    required String content,
    String? clientAvatar,
    int? rating,
    String? projectName,
    String? projectUrl,
    required bool visible,
    required bool public,
    required int order,
  }) async {
    try {
      final testimonial = await remoteDataSource.createTestimonial(
        clientName: clientName,
        clientPosition: clientPosition,
        clientCompany: clientCompany,
        content: content,
        clientAvatar: clientAvatar,
        rating: rating,
        projectName: projectName,
        projectUrl: projectUrl,
        visible: visible,
        public: public,
        order: order,
      );

      // Cache the new testimonial
      await localDataSource.cacheTestimonial(testimonial);

      return Right(testimonial);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, TestimonialEntity>> updateTestimonial({
    required String id,
    String? clientName,
    String? clientPosition,
    String? clientCompany,
    String? content,
    String? clientAvatar,
    int? rating,
    String? projectName,
    String? projectUrl,
    bool? visible,
    bool? public,
    int? order,
  }) async {
    try {
      final testimonial = await remoteDataSource.updateTestimonial(
        id: id,
        clientName: clientName,
        clientPosition: clientPosition,
        clientCompany: clientCompany,
        content: content,
        clientAvatar: clientAvatar,
        rating: rating,
        projectName: projectName,
        projectUrl: projectUrl,
        visible: visible,
        public: public,
        order: order,
      );

      // Update cached testimonial
      await localDataSource.updateCachedTestimonial(testimonial);

      return Right(testimonial);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteTestimonial(String id) async {
    try {
      await remoteDataSource.deleteTestimonial(id);
      await localDataSource.removeCachedTestimonial(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> updateTestimonialOrder(
    List<Map<String, dynamic>> testimonialOrders,
  ) async {
    try {
      await remoteDataSource.updateTestimonialOrder(testimonialOrders);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<TestimonialEntity>>> getFeaturedTestimonials() async {
    try {
      final testimonials = await remoteDataSource.getFeaturedTestimonials();
      return Right(testimonials);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedTestimonials = await localDataSource.getCachedFeaturedTestimonials();
        return Right(cachedTestimonials);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<TestimonialEntity>>> getCachedTestimonials() async {
    try {
      final testimonials = await localDataSource.getCachedTestimonials();
      return Right(testimonials);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheTestimonials(List<TestimonialEntity> testimonials) async {
    try {
      await localDataSource.cacheTestimonials(testimonials);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, TestimonialEntity?>> getCachedTestimonial(String id) async {
    try {
      final testimonial = await localDataSource.getCachedTestimonial(id);
      return Right(testimonial);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheTestimonial(TestimonialEntity testimonial) async {
    try {
      await localDataSource.cacheTestimonial(testimonial);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
