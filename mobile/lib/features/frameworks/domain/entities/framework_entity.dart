import 'package:equatable/equatable.dart';

enum FrameworkType { language, framework, library, tool, database, other }

enum ProficiencyLevel { beginner, intermediate, advanced, expert }

class FrameworkEntity extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String slug;
  final String? description;
  final String? icon;
  final String? color;
  final FrameworkType type;
  final ProficiencyLevel? proficiencyLevel;
  final bool visible;
  final bool public;
  final int order;
  final DateTime createdAt;
  final DateTime updatedAt;

  const FrameworkEntity({
    required this.id,
    required this.userId,
    required this.name,
    required this.slug,
    this.description,
    this.icon,
    this.color,
    required this.type,
    this.proficiencyLevel,
    required this.visible,
    required this.public,
    required this.order,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        slug,
        description,
        icon,
        color,
        type,
        proficiencyLevel,
        visible,
        public,
        order,
        createdAt,
        updatedAt,
      ];

  FrameworkEntity copyWith({
    String? id,
    String? userId,
    String? name,
    String? slug,
    String? description,
    String? icon,
    String? color,
    FrameworkType? type,
    ProficiencyLevel? proficiencyLevel,
    bool? visible,
    bool? public,
    int? order,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return FrameworkEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      icon: icon ?? this.icon,
      color: color ?? this.color,
      type: type ?? this.type,
      proficiencyLevel: proficiencyLevel ?? this.proficiencyLevel,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      order: order ?? this.order,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
