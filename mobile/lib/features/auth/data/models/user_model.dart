import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user_entity.dart';

part 'user_model.g.dart';

enum UserRoleModel {
  @JsonValue('user')
  user,
  @JsonValue('admin')
  admin,
  @JsonValue('super_admin')
  superAdmin,
}

@JsonSerializable()
class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.email,
    required super.username,
    super.firstName,
    super.lastName,
    super.avatar,
    required super.role,
    required super.isActive,
    required super.emailVerified,
    super.lastLoginAt,
    required super.createdAt,
    required super.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);

  /// Creates a UserModel from a database map
  /// Converts integer values back to booleans for SQLite compatibility
  factory UserModel.fromDatabaseMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'] as String,
      email: map['email'] as String,
      username: map['username'] as String,
      firstName: map['first_name'] as String?,
      lastName: map['last_name'] as String?,
      avatar: map['avatar'] as String?,
      role: UserRole.values.firstWhere(
        (e) => e.name == map['role'],
        orElse: () => UserRole.user,
      ),
      isActive: (map['is_active'] as int?) == 1,
      emailVerified: (map['email_verified'] as int?) == 1,
      lastLoginAt: map['last_login_at'] != null 
          ? DateTime.fromMillisecondsSinceEpoch(map['last_login_at'] as int)
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at'] as int),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at'] as int),
    );
  }

  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  /// Converts the model to a map suitable for database storage
  /// Converts boolean values to integers (0/1) for SQLite compatibility
  Map<String, dynamic> toDatabaseMap() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'first_name': firstName,
      'last_name': lastName,
      'avatar': avatar,
      'role': role.name,
      'is_active': isActive ? 1 : 0,
      'email_verified': emailVerified ? 1 : 0,
      'last_login_at': lastLoginAt?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory UserModel.fromEntity(UserEntity entity) {
    return UserModel(
      id: entity.id,
      email: entity.email,
      username: entity.username,
      firstName: entity.firstName,
      lastName: entity.lastName,
      avatar: entity.avatar,
      role: entity.role,
      isActive: entity.isActive,
      emailVerified: entity.emailVerified,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  UserEntity toEntity() {
    return UserEntity(
      id: id,
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      role: role,
      isActive: isActive,
      emailVerified: emailVerified,
      lastLoginAt: lastLoginAt,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  UserModel copyWith({
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
    return UserModel(
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
