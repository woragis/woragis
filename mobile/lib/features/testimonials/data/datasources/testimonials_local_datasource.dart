import 'package:sqflite/sqflite.dart';
import '../../../../core/database/database_helper.dart';
import '../../../../core/database/sync_manager.dart';
import '../../domain/entities/testimonial_entity.dart';
import '../models/testimonial_model.dart';

abstract class TestimonialsLocalDataSource {
  Future<List<TestimonialEntity>> getCachedTestimonials();
  Future<TestimonialEntity?> getCachedTestimonial(String id);
  Future<List<TestimonialEntity>> getCachedFeaturedTestimonials();
  Future<void> cacheTestimonial(TestimonialEntity testimonial);
  Future<void> cacheTestimonials(List<TestimonialEntity> testimonials);
  Future<void> updateCachedTestimonial(TestimonialEntity testimonial);
  Future<void> removeCachedTestimonial(String id);
}

class TestimonialsLocalDataSourceImpl implements TestimonialsLocalDataSource {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  final SyncManager _syncManager = SyncManager();

  @override
  Future<List<TestimonialEntity>> getCachedTestimonials() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'testimonials',
      orderBy: '`order` ASC, name ASC',
    );
    return result.map((testimonialMap) => TestimonialModel.fromDatabaseJson(testimonialMap).toEntity()).toList();
  }

  @override
  Future<TestimonialEntity?> getCachedTestimonial(String id) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'testimonials',
      where: 'id = ?',
      whereArgs: [id],
    );
    return result.isEmpty ? null : TestimonialModel.fromDatabaseJson(result.first).toEntity();
  }

  @override
  Future<List<TestimonialEntity>> getCachedFeaturedTestimonials() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'testimonials',
      where: 'featured = ? AND visible = ?',
      whereArgs: [1, 1],
      orderBy: '`order` ASC, name ASC',
    );
    return result.map((testimonialMap) => TestimonialModel.fromDatabaseJson(testimonialMap).toEntity()).toList();
  }

  @override
  Future<void> cacheTestimonial(TestimonialEntity testimonial) async {
    final db = await _dbHelper.database;
    final testimonialMap = TestimonialModel.fromEntity(testimonial).toDatabaseJson();
    testimonialMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
    testimonialMap['is_dirty'] = 0;

    await db.insert(
      'testimonials',
      testimonialMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> cacheTestimonials(List<TestimonialEntity> testimonials) async {
    final db = await _dbHelper.database;
    final batch = db.batch();

    for (final testimonial in testimonials) {
      final testimonialMap = TestimonialModel.fromEntity(testimonial).toDatabaseJson();
      testimonialMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
      testimonialMap['is_dirty'] = 0;

      batch.insert(
        'testimonials',
        testimonialMap,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit();
  }

  @override
  Future<void> updateCachedTestimonial(TestimonialEntity testimonial) async {
    final db = await _dbHelper.database;
    final testimonialMap = TestimonialModel.fromEntity(testimonial).toDatabaseJson();
    testimonialMap['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    testimonialMap['is_dirty'] = 1;

    await db.update(
      'testimonials',
      testimonialMap,
      where: 'id = ?',
      whereArgs: [testimonial.id],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'testimonials',
      recordId: testimonial.id,
      operation: SyncOperation.update,
      data: testimonialMap,
    );
  }

  @override
  Future<void> removeCachedTestimonial(String id) async {
    final db = await _dbHelper.database;
    
    await _syncManager.addToSyncQueue(
      tableName: 'testimonials',
      recordId: id,
      operation: SyncOperation.delete,
    );

    await db.delete(
      'testimonials',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
