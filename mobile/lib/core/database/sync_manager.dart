import 'dart:async';
import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'database_helper.dart';
import '../network/network_info.dart';

enum SyncOperation { create, update, delete }

class SyncItem {
  final String id;
  final String tableName;
  final String recordId;
  final SyncOperation operation;
  final Map<String, dynamic>? data;
  final int retryCount;
  final int maxRetries;
  final DateTime createdAt;
  final DateTime? lastRetryAt;
  final SyncStatus status;

  SyncItem({
    required this.id,
    required this.tableName,
    required this.recordId,
    required this.operation,
    this.data,
    required this.retryCount,
    required this.maxRetries,
    required this.createdAt,
    this.lastRetryAt,
    required this.status,
  });

  factory SyncItem.fromMap(Map<String, dynamic> map) {
    return SyncItem(
      id: map['id'],
      tableName: map['table_name'],
      recordId: map['record_id'],
      operation: SyncOperation.values.firstWhere(
        (op) => op.name.toUpperCase() == map['operation'],
        orElse: () => SyncOperation.update,
      ),
      data: map['data'] != null ? json.decode(map['data']) : null,
      retryCount: map['retry_count'],
      maxRetries: map['max_retries'],
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      lastRetryAt: map['last_retry_at'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['last_retry_at'])
          : null,
      status: SyncStatus.values.firstWhere(
        (status) => status.name.toUpperCase() == map['status'],
        orElse: () => SyncStatus.pending,
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'table_name': tableName,
      'record_id': recordId,
      'operation': operation.name.toUpperCase(),
      'data': data != null ? json.encode(data) : null,
      'retry_count': retryCount,
      'max_retries': maxRetries,
      'created_at': createdAt.millisecondsSinceEpoch,
      'last_retry_at': lastRetryAt?.millisecondsSinceEpoch,
      'status': status.name.toUpperCase(),
    };
  }
}

enum SyncStatus { pending, syncing, completed, failed }

class SyncManager {
  static final SyncManager _instance = SyncManager._internal();
  factory SyncManager() => _instance;
  SyncManager._internal();

  final DatabaseHelper _dbHelper = DatabaseHelper();
  final NetworkInfo _networkInfo = NetworkInfoImpl(Connectivity());
  Timer? _syncTimer;
  bool _isSyncing = false;

  // Start automatic sync
  void startAutoSync({Duration interval = const Duration(minutes: 5)}) {
    stopAutoSync();
    _syncTimer = Timer.periodic(interval, (_) => syncPendingItems());
  }

  // Stop automatic sync
  void stopAutoSync() {
    _syncTimer?.cancel();
    _syncTimer = null;
  }

  // Add item to sync queue
  Future<void> addToSyncQueue({
    required String tableName,
    required String recordId,
    required SyncOperation operation,
    Map<String, dynamic>? data,
    int maxRetries = 3,
  }) async {
    final db = await _dbHelper.database;
    
    final syncItem = SyncItem(
      id: '${tableName}_${recordId}_${DateTime.now().millisecondsSinceEpoch}',
      tableName: tableName,
      recordId: recordId,
      operation: operation,
      data: data,
      retryCount: 0,
      maxRetries: maxRetries,
      createdAt: DateTime.now(),
      status: SyncStatus.pending,
    );

    await db.insert('sync_queue', syncItem.toMap());
    
    // Try to sync immediately if online
    if (await _networkInfo.isConnected) {
      syncPendingItems();
    }
  }

  // Sync all pending items
  Future<void> syncPendingItems() async {
    if (_isSyncing) return;
    
    final isConnected = await _networkInfo.isConnected;
    if (!isConnected) return;

    _isSyncing = true;
    
    try {
      final pendingItems = await _getPendingItems();
      
      for (final item in pendingItems) {
        try {
          await _syncItem(item);
          await _markItemAsCompleted(item.id);
        } catch (e) {
          await _handleSyncFailure(item, e.toString());
        }
      }
    } finally {
      _isSyncing = false;
    }
  }

  // Get pending sync items
  Future<List<SyncItem>> _getPendingItems() async {
    final db = await _dbHelper.database;
    final maps = await db.query(
      'sync_queue',
      where: 'status = ? AND retry_count < max_retries',
      whereArgs: [SyncStatus.pending.name.toUpperCase()],
      orderBy: 'created_at ASC',
    );

    return maps.map((map) => SyncItem.fromMap(map)).toList();
  }

  // Sync individual item
  Future<void> _syncItem(SyncItem item) async {
    // Mark as syncing
    await _markItemAsSyncing(item.id);
    
    // Here you would implement the actual API calls based on the table and operation
    // For now, this is a placeholder - you'll need to implement the actual sync logic
    // based on your API endpoints
    
    switch (item.operation) {
      case SyncOperation.create:
        await _syncCreateOperation(item);
        break;
      case SyncOperation.update:
        await _syncUpdateOperation(item);
        break;
      case SyncOperation.delete:
        await _syncDeleteOperation(item);
        break;
    }
  }

  // Sync create operation
  Future<void> _syncCreateOperation(SyncItem item) async {
    // Implement API call for create operation
    // This would depend on your specific API structure
    throw UnimplementedError('Sync create operation not implemented');
  }

  // Sync update operation
  Future<void> _syncUpdateOperation(SyncItem item) async {
    // Implement API call for update operation
    throw UnimplementedError('Sync update operation not implemented');
  }

  // Sync delete operation
  Future<void> _syncDeleteOperation(SyncItem item) async {
    // Implement API call for delete operation
    throw UnimplementedError('Sync delete operation not implemented');
  }

  // Mark item as syncing
  Future<void> _markItemAsSyncing(String itemId) async {
    final db = await _dbHelper.database;
    await db.update(
      'sync_queue',
      {
        'status': SyncStatus.syncing.name.toUpperCase(),
      },
      where: 'id = ?',
      whereArgs: [itemId],
    );
  }

  // Mark item as completed
  Future<void> _markItemAsCompleted(String itemId) async {
    final db = await _dbHelper.database;
    await db.delete(
      'sync_queue',
      where: 'id = ?',
      whereArgs: [itemId],
    );
  }

  // Handle sync failure
  Future<void> _handleSyncFailure(SyncItem item, String error) async {
    final db = await _dbHelper.database;
    final newRetryCount = item.retryCount + 1;
    
    if (newRetryCount >= item.maxRetries) {
      // Mark as failed
      await db.update(
        'sync_queue',
        {
          'status': SyncStatus.failed.name.toUpperCase(),
          'retry_count': newRetryCount,
          'last_retry_at': DateTime.now().millisecondsSinceEpoch,
        },
        where: 'id = ?',
        whereArgs: [item.id],
      );
    } else {
      // Reset to pending for retry
      await db.update(
        'sync_queue',
        {
          'status': SyncStatus.pending.name.toUpperCase(),
          'retry_count': newRetryCount,
          'last_retry_at': DateTime.now().millisecondsSinceEpoch,
        },
        where: 'id = ?',
        whereArgs: [item.id],
      );
    }
  }

  // Get sync status for a table
  Future<Map<String, dynamic>?> getSyncStatus(String tableName) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'sync_status',
      where: 'table_name = ?',
      whereArgs: [tableName],
    );

    if (result.isEmpty) return null;

    return {
      'last_sync_at': result.first['last_sync_at'],
      'sync_token': result.first['sync_token'],
    };
  }

  // Update sync status for a table
  Future<void> updateSyncStatus({
    required String tableName,
    DateTime? lastSyncAt,
    String? syncToken,
  }) async {
    final db = await _dbHelper.database;
    
    await db.insert(
      'sync_status',
      {
        'id': '${tableName}_${DateTime.now().millisecondsSinceEpoch}',
        'table_name': tableName,
        'last_sync_at': lastSyncAt?.millisecondsSinceEpoch,
        'sync_token': syncToken,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  // Get failed sync items
  Future<List<SyncItem>> getFailedItems() async {
    final db = await _dbHelper.database;
    final maps = await db.query(
      'sync_queue',
      where: 'status = ?',
      whereArgs: [SyncStatus.failed.name.toUpperCase()],
      orderBy: 'created_at DESC',
    );

    return maps.map((map) => SyncItem.fromMap(map)).toList();
  }

  // Retry failed items
  Future<void> retryFailedItems() async {
    final db = await _dbHelper.database;
    await db.update(
      'sync_queue',
      {
        'status': SyncStatus.pending.name.toUpperCase(),
        'retry_count': 0,
      },
      where: 'status = ?',
      whereArgs: [SyncStatus.failed.name.toUpperCase()],
    );
    
    // Trigger sync
    syncPendingItems();
  }

  // Clear completed items
  Future<void> clearCompletedItems() async {
    final db = await _dbHelper.database;
    await db.delete(
      'sync_queue',
      where: 'status = ?',
      whereArgs: [SyncStatus.completed.name.toUpperCase()],
    );
  }

  // Get sync queue statistics
  Future<Map<String, int>> getSyncStats() async {
    final db = await _dbHelper.database;
    
    final pending = Sqflite.firstIntValue(
      await db.rawQuery(
        'SELECT COUNT(*) FROM sync_queue WHERE status = ?',
        [SyncStatus.pending.name.toUpperCase()],
      ),
    ) ?? 0;
    
    final syncing = Sqflite.firstIntValue(
      await db.rawQuery(
        'SELECT COUNT(*) FROM sync_queue WHERE status = ?',
        [SyncStatus.syncing.name.toUpperCase()],
      ),
    ) ?? 0;
    
    final failed = Sqflite.firstIntValue(
      await db.rawQuery(
        'SELECT COUNT(*) FROM sync_queue WHERE status = ?',
        [SyncStatus.failed.name.toUpperCase()],
      ),
    ) ?? 0;
    
    return {
      'pending': pending,
      'syncing': syncing,
      'failed': failed,
      'total': pending + syncing + failed,
    };
  }
}
