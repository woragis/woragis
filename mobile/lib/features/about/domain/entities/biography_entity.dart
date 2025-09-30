import 'package:equatable/equatable.dart';

class BiographyEntity extends Equatable {
  final String id;
  final String userId;
  final String? featuredBiography;
  final String? fullBiography;
  final bool visible;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BiographyEntity({
    required this.id,
    required this.userId,
    this.featuredBiography,
    this.fullBiography,
    required this.visible,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        featuredBiography,
        fullBiography,
        visible,
        createdAt,
        updatedAt,
      ];

  BiographyEntity copyWith({
    String? id,
    String? userId,
    String? featuredBiography,
    String? fullBiography,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BiographyEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      featuredBiography: featuredBiography ?? this.featuredBiography,
      fullBiography: fullBiography ?? this.fullBiography,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
