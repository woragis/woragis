import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/education_entity.dart';

part 'education_model.g.dart';

enum EducationTypeModel {
  @JsonValue('degree')
  degree,
  @JsonValue('certificate')
  certificate,
  @JsonValue('course')
  course,
  @JsonValue('workshop')
  workshop,
  @JsonValue('bootcamp')
  bootcamp,
  @JsonValue('other')
  other,
}

enum DegreeLevelModel {
  @JsonValue('associate')
  associate,
  @JsonValue('bachelor')
  bachelor,
  @JsonValue('master')
  master,
  @JsonValue('doctorate')
  doctorate,
  @JsonValue('diploma')
  diploma,
  @JsonValue('certificate')
  certificate,
}

@JsonSerializable()
class EducationModel extends EducationEntity {
  const EducationModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.institution,
    super.description,
    required super.type,
    super.degreeLevel,
    super.fieldOfStudy,
    super.startDate,
    super.endDate,
    super.completionDate,
    super.grade,
    super.credits,
    super.certificateId,
    super.issuer,
    super.validityPeriod,
    super.pdfDocument,
    super.verificationUrl,
    super.skills,
    required super.order,
    required super.visible,
    required super.createdAt,
    required super.updatedAt,
  });

  factory EducationModel.fromJson(Map<String, dynamic> json) =>
      _$EducationModelFromJson(json);

  Map<String, dynamic> toJson() => _$EducationModelToJson(this);

  factory EducationModel.fromEntity(EducationEntity entity) {
    return EducationModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      institution: entity.institution,
      description: entity.description,
      type: entity.type,
      degreeLevel: entity.degreeLevel,
      fieldOfStudy: entity.fieldOfStudy,
      startDate: entity.startDate,
      endDate: entity.endDate,
      completionDate: entity.completionDate,
      grade: entity.grade,
      credits: entity.credits,
      certificateId: entity.certificateId,
      issuer: entity.issuer,
      validityPeriod: entity.validityPeriod,
      pdfDocument: entity.pdfDocument,
      verificationUrl: entity.verificationUrl,
      skills: entity.skills,
      order: entity.order,
      visible: entity.visible,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  EducationEntity toEntity() {
    return EducationEntity(
      id: id,
      userId: userId,
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
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  EducationModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? institution,
    String? description,
    EducationType? type,
    DegreeLevel? degreeLevel,
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
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return EducationModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      institution: institution ?? this.institution,
      description: description ?? this.description,
      type: type ?? this.type,
      degreeLevel: degreeLevel ?? this.degreeLevel,
      fieldOfStudy: fieldOfStudy ?? this.fieldOfStudy,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      completionDate: completionDate ?? this.completionDate,
      grade: grade ?? this.grade,
      credits: credits ?? this.credits,
      certificateId: certificateId ?? this.certificateId,
      issuer: issuer ?? this.issuer,
      validityPeriod: validityPeriod ?? this.validityPeriod,
      pdfDocument: pdfDocument ?? this.pdfDocument,
      verificationUrl: verificationUrl ?? this.verificationUrl,
      skills: skills ?? this.skills,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
