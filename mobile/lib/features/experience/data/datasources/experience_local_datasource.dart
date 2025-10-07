import 'package:sqflite/sqflite.dart';
import '../../../../core/database/database_helper.dart';
import '../../../../core/database/sync_manager.dart';
import '../../domain/entities/experience_entity.dart';
import '../models/experience_model.dart';

abstract class ExperienceLocalDataSource {
  Future<List<ExperienceEntity>> getCachedExperienceList();
  Future<ExperienceEntity?> getCachedExperience(String id);
  Future<void> cacheExperience(ExperienceEntity experience);
  Future<void> cacheExperienceList(List<ExperienceEntity> experienceList);
  Future<void> updateCachedExperience(ExperienceEntity experience);
  Future<void> removeCachedExperience(String id);
}

class ExperienceLocalDataSourceImpl implements ExperienceLocalDataSource {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  final SyncManager _syncManager = SyncManager();

  @override
  Future<List<ExperienceEntity>> getCachedExperienceList() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'experiences',
      orderBy: '`order` ASC, company ASC',
    );
    return result.map((experienceMap) => ExperienceModel.fromLocalJson(experienceMap).toEntity()).toList();
  }

  @override
  Future<ExperienceEntity?> getCachedExperience(String id) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'experiences',
      where: 'id = ?',
      whereArgs: [id],
    );
    return result.isEmpty ? null : ExperienceModel.fromLocalJson(result.first).toEntity();
  }

  @override
  Future<void> cacheExperience(ExperienceEntity experience) async {
    final db = await _dbHelper.database;
    final experienceMap = ExperienceModel.fromEntity(experience).toLocalJson();
    experienceMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
    experienceMap['is_dirty'] = 0;

    await db.insert(
      'experiences',
      experienceMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> cacheExperienceList(List<ExperienceEntity> experienceList) async {
    final db = await _dbHelper.database;
    final batch = db.batch();

    for (final experience in experienceList) {
      final experienceMap = ExperienceModel.fromEntity(experience).toLocalJson();
      experienceMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
      experienceMap['is_dirty'] = 0;

      batch.insert(
        'experiences',
        experienceMap,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit();
  }

  @override
  Future<void> updateCachedExperience(ExperienceEntity experience) async {
    final db = await _dbHelper.database;
    final experienceMap = ExperienceModel.fromEntity(experience).toLocalJson();
    experienceMap['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    experienceMap['is_dirty'] = 1;

    await db.update(
      'experiences',
      experienceMap,
      where: 'id = ?',
      whereArgs: [experience.id],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'experiences',
      recordId: experience.id,
      operation: SyncOperation.update,
      data: experienceMap,
    );
  }

  @override
  Future<void> removeCachedExperience(String id) async {
    final db = await _dbHelper.database;
    
    await _syncManager.addToSyncQueue(
      tableName: 'experiences',
      recordId: id,
      operation: SyncOperation.delete,
    );

    await db.delete(
      'experiences',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
