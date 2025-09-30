// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'education_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EducationModel _$EducationModelFromJson(
  Map<String, dynamic> json,
) => EducationModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  title: json['title'] as String,
  institution: json['institution'] as String,
  description: json['description'] as String?,
  type: $enumDecode(_$EducationTypeEnumMap, json['type']),
  degreeLevel: $enumDecodeNullable(_$DegreeLevelEnumMap, json['degreeLevel']),
  fieldOfStudy: json['fieldOfStudy'] as String?,
  startDate: json['startDate'] == null
      ? null
      : DateTime.parse(json['startDate'] as String),
  endDate: json['endDate'] == null
      ? null
      : DateTime.parse(json['endDate'] as String),
  completionDate: json['completionDate'] == null
      ? null
      : DateTime.parse(json['completionDate'] as String),
  grade: json['grade'] as String?,
  credits: (json['credits'] as num?)?.toInt(),
  certificateId: json['certificateId'] as String?,
  issuer: json['issuer'] as String?,
  validityPeriod: json['validityPeriod'] as String?,
  pdfDocument: json['pdfDocument'] as String?,
  verificationUrl: json['verificationUrl'] as String?,
  skills: (json['skills'] as List<dynamic>?)?.map((e) => e as String).toList(),
  order: (json['order'] as num).toInt(),
  visible: json['visible'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$EducationModelToJson(EducationModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'institution': instance.institution,
      'description': instance.description,
      'type': _$EducationTypeEnumMap[instance.type]!,
      'degreeLevel': _$DegreeLevelEnumMap[instance.degreeLevel],
      'fieldOfStudy': instance.fieldOfStudy,
      'startDate': instance.startDate?.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'completionDate': instance.completionDate?.toIso8601String(),
      'grade': instance.grade,
      'credits': instance.credits,
      'certificateId': instance.certificateId,
      'issuer': instance.issuer,
      'validityPeriod': instance.validityPeriod,
      'pdfDocument': instance.pdfDocument,
      'verificationUrl': instance.verificationUrl,
      'skills': instance.skills,
      'order': instance.order,
      'visible': instance.visible,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$EducationTypeEnumMap = {
  EducationType.degree: 'degree',
  EducationType.certificate: 'certificate',
  EducationType.course: 'course',
  EducationType.workshop: 'workshop',
  EducationType.bootcamp: 'bootcamp',
  EducationType.other: 'other',
};

const _$DegreeLevelEnumMap = {
  DegreeLevel.associate: 'associate',
  DegreeLevel.bachelor: 'bachelor',
  DegreeLevel.master: 'master',
  DegreeLevel.doctorate: 'doctorate',
  DegreeLevel.diploma: 'diploma',
  DegreeLevel.certificate: 'certificate',
};
