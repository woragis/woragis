import 'package:equatable/equatable.dart';

class MusicGenreEntity extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String? description;
  final int order;
  final bool visible;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MusicGenreEntity({
    required this.id,
    required this.userId,
    required this.name,
    this.description,
    required this.order,
    required this.visible,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object> get props => [
        id,
        userId,
        name,
        description ?? '',
        order,
        visible,
        createdAt,
        updatedAt,
      ];

  MusicGenreEntity copyWith({
    String? id,
    String? userId,
    String? name,
    String? description,
    int? order,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return MusicGenreEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      description: description ?? this.description,
      order: order ?? this.order,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
