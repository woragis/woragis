import 'package:equatable/equatable.dart';

class AboutCoreEntity extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String? currentProfessionId;
  final String? biography;
  final String? featuredBiography;
  final bool visible;
  final DateTime createdAt;
  final DateTime updatedAt;

  const AboutCoreEntity({
    required this.id,
    required this.userId,
    required this.name,
    this.currentProfessionId,
    this.biography,
    this.featuredBiography,
    required this.visible,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        currentProfessionId,
        biography,
        featuredBiography,
        visible,
        createdAt,
        updatedAt,
      ];

  AboutCoreEntity copyWith({
    String? id,
    String? userId,
    String? name,
    String? currentProfessionId,
    String? biography,
    String? featuredBiography,
    bool? visible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AboutCoreEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      currentProfessionId: currentProfessionId ?? this.currentProfessionId,
      biography: biography ?? this.biography,
      featuredBiography: featuredBiography ?? this.featuredBiography,
      visible: visible ?? this.visible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
