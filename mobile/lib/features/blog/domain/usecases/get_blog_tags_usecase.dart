import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/blog_tag_entity.dart';
import '../repositories/blog_repository.dart';

class GetBlogTagsUseCase {
  final BlogRepository repository;

  GetBlogTagsUseCase(this.repository);

  Future<Either<Failure, List<BlogTagEntity>>> call(GetBlogTagsParams params) async {
    return await repository.getBlogTags(
      page: params.page,
      limit: params.limit,
      visible: params.visible,
      search: params.search,
    );
  }
}

class GetBlogTagsParams {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? search;

  GetBlogTagsParams({
    this.page,
    this.limit,
    this.visible,
    this.search,
  });
}
