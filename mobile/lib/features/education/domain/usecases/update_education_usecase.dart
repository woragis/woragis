import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/education_entity.dart';
import '../repositories/education_repository.dart';

class UpdateEducationUseCase {
  final EducationRepository repository;

  UpdateEducationUseCase(this.repository);

  Future<Either<Failure, EducationEntity>> call({
    required String id,
    String? title,
    String? institution,
    String? description,
    String? type,
    String? degreeLevel,
    String? fieldOfStudy,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? completionDate,
    String? grade,
    int? credits,
    String? certificateId,
    String? issuer,
    String? validityPeriod,
    String? pdfDocument,
    String? verificationUrl,
    List<String>? skills,
    int? order,
    bool? visible,
  }) async {
    return await repository.updateEducation(
      id: id,
      title: title,
      institution: institution,
      description: description,
      type: type,
      degreeLevel: degreeLevel,
      fieldOfStudy: fieldOfStudy,
      startDate: startDate,
      endDate: endDate,
      completionDate: completionDate,
      grade: grade,
      credits: credits,
      certificateId: certificateId,
      issuer: issuer,
      validityPeriod: validityPeriod,
      pdfDocument: pdfDocument,
      verificationUrl: verificationUrl,
      skills: skills,
      order: order,
      visible: visible,
    );
  }
}
