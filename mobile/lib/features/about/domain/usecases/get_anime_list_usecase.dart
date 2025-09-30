import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/anime_entity.dart';
import '../repositories/about_repository.dart';

class GetAnimeListUseCase {
  final AboutRepository repository;

  GetAnimeListUseCase(this.repository);

  Future<Either<Failure, List<AnimeEntity>>> call({
    int? page,
    int? limit,
    bool? visible,
    String? status,
    String? search,
  }) async {
    return await repository.getAnimeList(
      page: page,
      limit: limit,
      visible: visible,
      status: status,
      search: search,
    );
  }
}
