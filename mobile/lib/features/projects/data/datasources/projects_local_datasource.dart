import 'package:sqflite/sqflite.dart';
import '../../../../core/database/database_helper.dart';
import '../../../../core/database/sync_manager.dart';
import '../../domain/entities/project_entity.dart';
import '../models/project_model.dart';

abstract class ProjectsLocalDataSource {
  Future<List<ProjectEntity>> getCachedProjects({
    int? limit,
    int? offset,
    bool? featured,
    bool? visible,
    bool? public,
    List<String>? technologies,
    String? search,
  });

  Future<ProjectEntity?> getCachedProject(String id);
  Future<ProjectEntity?> getCachedProjectBySlug(String slug);
  Future<void> cacheProject(ProjectEntity project);
  Future<void> cacheProjects(List<ProjectEntity> projects);
  Future<void> updateCachedProject(ProjectEntity project);
  Future<void> removeCachedProject(String id);

  // Project frameworks relationship
  Future<void> assignFrameworkToProject(String projectId, String frameworkId);
  Future<void> removeFrameworkFromProject(String projectId, String frameworkId);
  Future<List<String>> getProjectFrameworkIds(String projectId);

  // Offline operations
  Future<List<ProjectEntity>> getDirtyProjects();
  Future<void> markProjectAsDirty(String projectId);
  Future<void> markProjectAsSynced(String projectId);
}

class ProjectsLocalDataSourceImpl implements ProjectsLocalDataSource {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  final SyncManager _syncManager = SyncManager();

  @override
  Future<List<ProjectEntity>> getCachedProjects({
    int? limit,
    int? offset,
    bool? featured,
    bool? visible,
    bool? public,
    List<String>? technologies,
    String? search,
  }) async {
    final db = await _dbHelper.database;
    
    String whereClause = '1=1';
    List<dynamic> whereArgs = [];

    if (featured != null) {
      whereClause += ' AND featured = ?';
      whereArgs.add(featured ? 1 : 0);
    }

    if (visible != null) {
      whereClause += ' AND visible = ?';
      whereArgs.add(visible ? 1 : 0);
    }

    if (public != null) {
      whereClause += ' AND public = ?';
      whereArgs.add(public ? 1 : 0);
    }

    if (search != null && search.isNotEmpty) {
      whereClause += ' AND (title LIKE ? OR description LIKE ?)';
      whereArgs.add('%$search%');
      whereArgs.add('%$search%');
    }

    final result = await db.query(
      'projects',
      where: whereClause,
      whereArgs: whereArgs,
      orderBy: 'order_index ASC, created_at DESC',
      limit: limit,
      offset: offset,
    );

    return result.map((projectMap) => ProjectModel.fromJson(projectMap).toEntity()).toList();
  }

  @override
  Future<ProjectEntity?> getCachedProject(String id) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'projects',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (result.isEmpty) return null;
    return ProjectModel.fromJson(result.first).toEntity();
  }

  @override
  Future<ProjectEntity?> getCachedProjectBySlug(String slug) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'projects',
      where: 'slug = ?',
      whereArgs: [slug],
    );

    if (result.isEmpty) return null;
    return ProjectModel.fromJson(result.first).toEntity();
  }

  @override
  Future<void> cacheProject(ProjectEntity project) async {
    final db = await _dbHelper.database;
    final projectModel = ProjectModel.fromEntity(project);
    final projectMap = projectModel.toJson();
    
    projectMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
    projectMap['is_dirty'] = 0;

    await db.insert(
      'projects',
      projectMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> cacheProjects(List<ProjectEntity> projects) async {
    final db = await _dbHelper.database;
    final batch = db.batch();

    for (final project in projects) {
      final projectModel = ProjectModel.fromEntity(project);
      final projectMap = projectModel.toJson();
      
      projectMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
      projectMap['is_dirty'] = 0;

      batch.insert(
        'projects',
        projectMap,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit();
  }

  @override
  Future<void> updateCachedProject(ProjectEntity project) async {
    final db = await _dbHelper.database;
    final projectModel = ProjectModel.fromEntity(project);
    final projectMap = projectModel.toJson();
    
    projectMap['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    projectMap['is_dirty'] = 1;

    await db.update(
      'projects',
      projectMap,
      where: 'id = ?',
      whereArgs: [project.id],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'projects',
      recordId: project.id,
      operation: SyncOperation.update,
      data: projectMap,
    );
  }

  @override
  Future<void> removeCachedProject(String id) async {
    final db = await _dbHelper.database;
    
    await _syncManager.addToSyncQueue(
      tableName: 'projects',
      recordId: id,
      operation: SyncOperation.delete,
    );

    await db.delete(
      'projects',
      where: 'id = ?',
      whereArgs: [id],
    );

    // Remove related project frameworks
    await db.delete(
      'project_frameworks',
      where: 'project_id = ?',
      whereArgs: [id],
    );
  }

  // Project Frameworks Relationship Methods
  @override
  Future<void> assignFrameworkToProject(String projectId, String frameworkId) async {
    final db = await _dbHelper.database;
    
    await db.insert(
      'project_frameworks',
      {
        'id': '${projectId}_${frameworkId}_${DateTime.now().millisecondsSinceEpoch}',
        'project_id': projectId,
        'framework_id': frameworkId,
        'created_at': DateTime.now().millisecondsSinceEpoch,
      },
      conflictAlgorithm: ConflictAlgorithm.ignore,
    );
  }

  @override
  Future<void> removeFrameworkFromProject(String projectId, String frameworkId) async {
    final db = await _dbHelper.database;
    
    await db.delete(
      'project_frameworks',
      where: 'project_id = ? AND framework_id = ?',
      whereArgs: [projectId, frameworkId],
    );
  }

  @override
  Future<List<String>> getProjectFrameworkIds(String projectId) async {
    final db = await _dbHelper.database;
    
    final result = await db.query(
      'project_frameworks',
      columns: ['framework_id'],
      where: 'project_id = ?',
      whereArgs: [projectId],
    );

    return result.map((row) => row['framework_id'] as String).toList();
  }

  // Offline Operations
  @override
  Future<List<ProjectEntity>> getDirtyProjects() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'projects',
      where: 'is_dirty = ?',
      whereArgs: [1],
    );

    return result.map((projectMap) => ProjectModel.fromJson(projectMap).toEntity()).toList();
  }

  @override
  Future<void> markProjectAsDirty(String projectId) async {
    final db = await _dbHelper.database;
    await db.update(
      'projects',
      {'is_dirty': 1},
      where: 'id = ?',
      whereArgs: [projectId],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'projects',
      recordId: projectId,
      operation: SyncOperation.update,
    );
  }

  @override
  Future<void> markProjectAsSynced(String projectId) async {
    final db = await _dbHelper.database;
    await db.update(
      'projects',
      {
        'is_dirty': 0,
        'synced_at': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [projectId],
    );
  }
}
