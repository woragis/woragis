import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_tag_entity.dart';
import '../repositories/blog_repository.dart';

class CreateBlogTagUseCase {
  final BlogRepository repository;

  CreateBlogTagUseCase(this.repository);

  Future<Either<Failure, BlogTagEntity>> call(CreateBlogTagParams params) async {
    return await repository.createBlogTag(
      name: params.name,
      slug: params.slug,
      description: params.description,
      color: params.color,
    );
  }
}

class CreateBlogTagParams {
  final String name;
  final String slug;
  final String? description;
  final String? color;

  CreateBlogTagParams({
    required this.name,
    required this.slug,
    this.description,
    this.color,
  });
}
