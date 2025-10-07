// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'education_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EducationModel _$EducationModelFromJson(
  Map<String, dynamic> json,
) => EducationModel(
  id: json['id'] as String,
  userId: json['user_id'] as String,
  title: json['title'] as String,
  institution: json['institution'] as String,
  description: json['description'] as String?,
  type: $enumDecode(_$EducationTypeEnumMap, json['type']),
  degreeLevel: $enumDecodeNullable(_$DegreeLevelEnumMap, json['degree_level']),
  fieldOfStudy: json['field_of_study'] as String?,
  startDate: json['start_date'] == null
      ? null
      : DateTime.parse(json['start_date'] as String),
  endDate: json['end_date'] == null
      ? null
      : DateTime.parse(json['end_date'] as String),
  completionDate: json['completion_date'] == null
      ? null
      : DateTime.parse(json['completion_date'] as String),
  grade: json['grade'] as String?,
  credits: (json['credits'] as num?)?.toInt(),
  certificateId: json['certificate_id'] as String?,
  issuer: json['issuer'] as String?,
  validityPeriod: json['validity_period'] as String?,
  pdfDocument: json['pdf_document'] as String?,
  verificationUrl: json['verification_url'] as String?,
  skills: (json['skills'] as List<dynamic>?)?.map((e) => e as String).toList(),
  order: (json['order'] as num).toInt(),
  visible: json['visible'] as bool,
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
);

Map<String, dynamic> _$EducationModelToJson(EducationModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'title': instance.title,
      'institution': instance.institution,
      'description': instance.description,
      'type': _$EducationTypeEnumMap[instance.type]!,
      'degree_level': _$DegreeLevelEnumMap[instance.degreeLevel],
      'field_of_study': instance.fieldOfStudy,
      'start_date': instance.startDate?.toIso8601String(),
      'end_date': instance.endDate?.toIso8601String(),
      'completion_date': instance.completionDate?.toIso8601String(),
      'grade': instance.grade,
      'credits': instance.credits,
      'certificate_id': instance.certificateId,
      'issuer': instance.issuer,
      'validity_period': instance.validityPeriod,
      'pdf_document': instance.pdfDocument,
      'verification_url': instance.verificationUrl,
      'skills': instance.skills,
      'order': instance.order,
      'visible': instance.visible,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };

const _$EducationTypeEnumMap = {
  EducationType.degree: 'degree',
  EducationType.certificate: 'certificate',
};

const _$DegreeLevelEnumMap = {
  DegreeLevel.associate: 'associate',
  DegreeLevel.bachelor: 'bachelor',
  DegreeLevel.master: 'master',
  DegreeLevel.doctorate: 'doctorate',
  DegreeLevel.diploma: 'diploma',
};
