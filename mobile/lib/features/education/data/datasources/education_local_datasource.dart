import 'package:sqflite/sqflite.dart';
import '../../../../core/database/database_helper.dart';
import '../../domain/entities/education_entity.dart';
import '../models/education_model.dart';

abstract class EducationLocalDataSource {
  Future<List<EducationEntity>> getCachedEducationList();
  Future<EducationEntity?> getCachedEducation(String id);
  Future<void> cacheEducation(EducationEntity education);
  Future<void> cacheEducationList(List<EducationEntity> educationList);
  Future<void> updateCachedEducation(EducationEntity education);
  Future<void> removeCachedEducation(String id);
}

class EducationLocalDataSourceImpl implements EducationLocalDataSource {
  final DatabaseHelper _dbHelper = DatabaseHelper();

  @override
  Future<List<EducationEntity>> getCachedEducationList() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'education',
      orderBy: '`order` ASC, institution ASC',
    );
    return result.map((educationMap) => EducationModel.fromJson(educationMap)).toList();
  }

  @override
  Future<EducationEntity?> getCachedEducation(String id) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'education',
      where: 'id = ?',
      whereArgs: [id],
    );
    return result.isEmpty ? null : EducationModel.fromJson(result.first);
  }

  @override
  Future<void> cacheEducation(EducationEntity education) async {
    final db = await _dbHelper.database;
    final educationMap = EducationModel.fromEntity(education).toJson();

    await db.insert(
      'education',
      educationMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> cacheEducationList(List<EducationEntity> educationList) async {
    final db = await _dbHelper.database;
    final batch = db.batch();

    for (final education in educationList) {
      final educationMap = EducationModel.fromEntity(education).toJson();

      batch.insert(
        'education',
        educationMap,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit();
  }

  @override
  Future<void> updateCachedEducation(EducationEntity education) async {
    final db = await _dbHelper.database;
    final educationMap = EducationModel.fromEntity(education).toJson();
    educationMap['updated_at'] = DateTime.now().millisecondsSinceEpoch;

    await db.update(
      'education',
      educationMap,
      where: 'id = ?',
      whereArgs: [education.id],
    );
  }

  @override
  Future<void> removeCachedEducation(String id) async {
    final db = await _dbHelper.database;
    
    await db.delete(
      'education',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
