import 'package:sqflite/sqflite.dart';
import '../../../../core/database/database_helper.dart';
import '../../../../core/database/sync_manager.dart';
import '../../domain/entities/user_entity.dart';
import '../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<UserEntity?> getStoredUserData();
  Future<void> storeUserData(UserEntity user);
  Future<void> clearStoredUserData();
  
  Future<String?> getStoredAccessToken();
  Future<String?> getStoredRefreshToken();
  Future<DateTime?> getTokenExpiration();
  Future<void> storeTokens({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  });
  Future<void> clearStoredTokens();
  
  Future<bool> isUserLoggedIn();
  Future<bool> isTokenValid();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  final SyncManager _syncManager = SyncManager();

  @override
  Future<UserEntity?> getStoredUserData() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'users',
      limit: 1,
      orderBy: 'updated_at DESC',
    );

    if (result.isEmpty) return null;

    final userMap = result.first;
    return UserModel.fromDatabaseMap(userMap).toEntity();
  }

  @override
  Future<void> storeUserData(UserEntity user) async {
    final db = await _dbHelper.database;
    final userModel = UserModel.fromEntity(user);
    final userMap = userModel.toDatabaseMap();
    
    // Add metadata for sync
    userMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
    userMap['is_dirty'] = 0;

    print('👤 Storing user data for: ${user.email}');
    await db.insert(
      'users',
      userMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
    print('✅ User data stored successfully');
  }

  @override
  Future<void> clearStoredUserData() async {
    final db = await _dbHelper.database;
    print('🗑️ Clearing stored user data from database');
    await db.delete('users');
    print('✅ User data cleared from database');
  }

  @override
  Future<String?> getStoredAccessToken() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'user_sessions',
      columns: ['access_token'],
      limit: 1,
      orderBy: 'created_at DESC',
    );

    final token = result.isEmpty ? null : result.first['access_token'] as String?;
    print('🔍 Retrieved access token: ${token != null ? 'Found' : 'Not found'}');
    return token;
  }

  @override
  Future<String?> getStoredRefreshToken() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'user_sessions',
      columns: ['refresh_token'],
      limit: 1,
      orderBy: 'created_at DESC',
    );

    return result.isEmpty ? null : result.first['refresh_token'] as String?;
  }

  @override
  Future<DateTime?> getTokenExpiration() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'user_sessions',
      columns: ['expires_at'],
      limit: 1,
      orderBy: 'created_at DESC',
    );

    if (result.isEmpty) return null;
    
    final expiresAt = result.first['expires_at'] as int?;
    return expiresAt != null ? DateTime.fromMillisecondsSinceEpoch(expiresAt) : null;
  }

  @override
  Future<void> storeTokens({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  }) async {
    final db = await _dbHelper.database;
    
    // Get current user ID
    final userData = await getStoredUserData();
    if (userData == null) {
      print('🚨 Cannot store tokens: No user data found');
      return;
    }
    
    print('🔐 Storing tokens for user: ${userData.id}');

    await db.insert(
      'user_sessions',
      {
        'id': 'session_${DateTime.now().millisecondsSinceEpoch}',
        'user_id': userData.id,
        'access_token': accessToken,
        'refresh_token': refreshToken,
        'expires_at': expiresAt.millisecondsSinceEpoch,
        'created_at': DateTime.now().millisecondsSinceEpoch,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> clearStoredTokens() async {
    final db = await _dbHelper.database;
    print('🗑️ Clearing stored tokens from database');
    await db.delete('user_sessions');
    print('✅ Tokens cleared from database');
  }

  @override
  Future<bool> isUserLoggedIn() async {
    final user = await getStoredUserData();
    final token = await getStoredAccessToken();
    return user != null && token != null;
  }

  @override
  Future<bool> isTokenValid() async {
    final expiresAt = await getTokenExpiration();
    if (expiresAt == null) return false;
    
    return DateTime.now().isBefore(expiresAt);
  }

  // Additional methods for offline support
  Future<void> markUserAsDirty(String userId) async {
    final db = await _dbHelper.database;
    await db.update(
      'users',
      {'is_dirty': 1},
      where: 'id = ?',
      whereArgs: [userId],
    );

    // Add to sync queue
    await _syncManager.addToSyncQueue(
      tableName: 'users',
      recordId: userId,
      operation: SyncOperation.update,
    );
  }

  Future<List<UserEntity>> getDirtyUsers() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'users',
      where: 'is_dirty = ?',
      whereArgs: [1],
    );

    return result.map((userMap) => UserModel.fromJson(userMap).toEntity()).toList();
  }

  Future<void> markUserAsSynced(String userId) async {
    final db = await _dbHelper.database;
    await db.update(
      'users',
      {
        'is_dirty': 0,
        'synced_at': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [userId],
    );
  }
}
