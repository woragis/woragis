import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/anime_entity.dart';
import '../repositories/about_repository.dart';

class GetAnimeByIdUseCase {
  final AboutRepository repository;

  GetAnimeByIdUseCase(this.repository);

  Future<Either<Failure, AnimeEntity>> call(String id) async {
    return await repository.getAnimeById(id);
  }
}
