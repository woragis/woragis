import 'package:equatable/equatable.dart';

enum UserRole { user, admin, superAdmin }

class UserEntity extends Equatable {
  final String id;
  final String email;
  final String username;
  final String? firstName;
  final String? lastName;
  final String? avatar;
  final UserRole role;
  final bool isActive;
  final bool emailVerified;
  final DateTime? lastLoginAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserEntity({
    required this.id,
    required this.email,
    required this.username,
    this.firstName,
    this.lastName,
    this.avatar,
    required this.role,
    required this.isActive,
    required this.emailVerified,
    this.lastLoginAt,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        email,
        username,
        firstName,
        lastName,
        avatar,
        role,
        isActive,
        emailVerified,
        lastLoginAt,
        createdAt,
        updatedAt,
      ];

  UserEntity copyWith({
    String? id,
    String? email,
    String? username,
    String? firstName,
    String? lastName,
    String? avatar,
    UserRole? role,
    bool? isActive,
    bool? emailVerified,
    DateTime? lastLoginAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserEntity(
      id: id ?? this.id,
      email: email ?? this.email,
      username: username ?? this.username,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      avatar: avatar ?? this.avatar,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      emailVerified: emailVerified ?? this.emailVerified,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
