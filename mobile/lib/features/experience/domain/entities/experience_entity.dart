import 'package:equatable/equatable.dart';

class ExperienceEntity extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String company;
  final String period;
  final String location;
  final String description;
  final List<String> achievements;
  final List<String> technologies;
  final String icon;
  final int order;
  final bool visible;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ExperienceEntity({
    required this.id,
    required this.userId,
    required this.title,
    required this.company,
    required this.period,
    required this.location,
    required this.description,
    required this.achievements,
    required this.technologies,
    required this.icon,
    required this.order,
    required this.visible,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object> get props => [
        id,
        userId,
        title,
        company,
        period,
        location,
        description,
        achievements,
        technologies,
        icon,
        order,
        visible,
        createdAt,
        updatedAt,
      ];

  ExperienceEntity copyWith({
    String? id,
    String? userId,
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
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ExperienceEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      company: company ?? this.company,
      period: period ?? this.period,
      location: location ?? this.location,
      description: description ?? this.description,
      achievements: achievements ?? this.achievements,
      technologies: technologies ?? this.technologies,
      icon: icon ?? this.icon,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
