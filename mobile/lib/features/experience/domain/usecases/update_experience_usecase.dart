import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/experience_entity.dart';
import '../repositories/experience_repository.dart';

class UpdateExperienceUseCase {
  final ExperienceRepository repository;

  UpdateExperienceUseCase(this.repository);

  Future<Either<Failure, ExperienceEntity>> call({
    required String id,
    String? title,
    String? company,
    String? period,
    String? location,
    String? description,
    List<String>? achievements,
    List<String>? technologies,
    String? icon,
    int? order,
    bool? visible,
  }) async {
    return await repository.updateExperience(
      id: id,
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
