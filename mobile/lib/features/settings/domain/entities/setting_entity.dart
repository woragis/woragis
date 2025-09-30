import 'package:equatable/equatable.dart';

class SettingEntity extends Equatable {
  final String id;
  final String userId;
  final String key;
  final String value;
  final String? description;
  final String? category;
  final bool isPublic;
  final DateTime createdAt;
  final DateTime updatedAt;

  const SettingEntity({
    required this.id,
    required this.userId,
    required this.key,
    required this.value,
    this.description,
    this.category,
    required this.isPublic,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        key,
        value,
        description,
        category,
        isPublic,
        createdAt,
        updatedAt,
      ];

  SettingEntity copyWith({
    String? id,
    String? userId,
    String? key,
    String? value,
    String? description,
    String? category,
    bool? isPublic,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return SettingEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      key: key ?? this.key,
      value: value ?? this.value,
      description: description ?? this.description,
      category: category ?? this.category,
      isPublic: isPublic ?? this.isPublic,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
