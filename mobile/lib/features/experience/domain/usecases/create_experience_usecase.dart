import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/experience_entity.dart';
import '../repositories/experience_repository.dart';

class CreateExperienceUseCase {
  final ExperienceRepository repository;

  CreateExperienceUseCase(this.repository);

  Future<Either<Failure, ExperienceEntity>> call({
    required String title,
    required String company,
    required String period,
    required String location,
    required String description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    required int order,
    required bool visible,
  }) async {
    return await repository.createExperience(
      title: title,
      company: company,
      period: period,
      location: location,
      description: description,
      achievements: achievements,
      technologies: technologies,
      icon: icon,
      order: order,
      visible: visible,
    );
  }
}
