import 'package:sqflite/sqflite.dart';
import '../../../../core/database/database_helper.dart';
import '../../../../core/database/sync_manager.dart';
import '../../domain/entities/blog_post_entity.dart';
import '../../domain/entities/blog_tag_entity.dart';
import '../models/blog_post_model.dart';
import '../models/blog_tag_model.dart';

abstract class BlogLocalDataSource {
  // Blog posts
  Future<List<BlogPostEntity>> getCachedBlogPosts({
    int? limit,
    int? offset,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
  });

  Future<BlogPostEntity?> getCachedBlogPost(String id);
  Future<BlogPostEntity?> getCachedBlogPostBySlug(String slug);
  Future<void> cacheBlogPost(BlogPostEntity post);
  Future<void> cacheBlogPosts(List<BlogPostEntity> posts);
  Future<void> updateCachedBlogPost(BlogPostEntity post);
  Future<void> removeCachedBlogPost(String id);

  // Blog tags
  Future<List<BlogTagEntity>> getCachedBlogTags({
    int? limit,
    int? offset,
    bool? visible,
    String? search,
  });

  Future<BlogTagEntity?> getCachedBlogTag(String id);
  Future<BlogTagEntity?> getCachedBlogTagBySlug(String slug);
  Future<void> cacheBlogTag(BlogTagEntity tag);
  Future<void> cacheBlogTags(List<BlogTagEntity> tags);
  Future<void> updateCachedBlogTag(BlogTagEntity tag);
  Future<void> removeCachedBlogTag(String id);

  // Blog post tags relationship
  Future<void> assignTagToPost(String postId, String tagId);
  Future<void> removeTagFromPost(String postId, String tagId);
  Future<List<BlogTagEntity>> getPostTags(String postId);

  // Offline operations
  Future<List<BlogPostEntity>> getDirtyBlogPosts();
  Future<List<BlogTagEntity>> getDirtyBlogTags();
  Future<void> markBlogPostAsDirty(String postId);
  Future<void> markBlogTagAsDirty(String tagId);
  Future<void> markBlogPostAsSynced(String postId);
  Future<void> markBlogTagAsSynced(String tagId);
}

class BlogLocalDataSourceImpl implements BlogLocalDataSource {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  final SyncManager _syncManager = SyncManager();

  // Blog Posts Methods
  @override
  Future<List<BlogPostEntity>> getCachedBlogPosts({
    int? limit,
    int? offset,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
  }) async {
    final db = await _dbHelper.database;
    
    String whereClause = '1=1';
    List<dynamic> whereArgs = [];

    if (published != null) {
      whereClause += ' AND published = ?';
      whereArgs.add(published ? 1 : 0);
    }

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
      whereClause += ' AND (title LIKE ? OR excerpt LIKE ?)';
      whereArgs.add('%$search%');
      whereArgs.add('%$search%');
    }

    final result = await db.query(
      'blog_posts',
      where: whereClause,
      whereArgs: whereArgs,
      orderBy: '`order` ASC, created_at DESC',
      limit: limit,
      offset: offset,
    );

    return result.map((postMap) => BlogPostModel.fromDatabaseJson(postMap).toEntity()).toList();
  }

  @override
  Future<BlogPostEntity?> getCachedBlogPost(String id) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'blog_posts',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (result.isEmpty) return null;
    return BlogPostModel.fromDatabaseJson(result.first).toEntity();
  }

  @override
  Future<BlogPostEntity?> getCachedBlogPostBySlug(String slug) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'blog_posts',
      where: 'slug = ?',
      whereArgs: [slug],
    );

    if (result.isEmpty) return null;
    return BlogPostModel.fromDatabaseJson(result.first).toEntity();
  }

  @override
  Future<void> cacheBlogPost(BlogPostEntity post) async {
    final db = await _dbHelper.database;
    final postModel = BlogPostModel.fromEntity(post);
    final postMap = postModel.toDatabaseJson();
    
    // Add metadata for sync
    postMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
    postMap['is_dirty'] = 0;

    await db.insert(
      'blog_posts',
      postMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> cacheBlogPosts(List<BlogPostEntity> posts) async {
    final db = await _dbHelper.database;
    final batch = db.batch();

    for (final post in posts) {
      final postModel = BlogPostModel.fromEntity(post);
      final postMap = postModel.toDatabaseJson();
      
      postMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
      postMap['is_dirty'] = 0;

      batch.insert(
        'blog_posts',
        postMap,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit();
  }

  @override
  Future<void> updateCachedBlogPost(BlogPostEntity post) async {
    final db = await _dbHelper.database;
    final postModel = BlogPostModel.fromEntity(post);
    final postMap = postModel.toDatabaseJson();
    
    postMap['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    postMap['is_dirty'] = 1;

    await db.update(
      'blog_posts',
      postMap,
      where: 'id = ?',
      whereArgs: [post.id],
    );

    // Add to sync queue
    await _syncManager.addToSyncQueue(
      tableName: 'blog_posts',
      recordId: post.id,
      operation: SyncOperation.update,
      data: postMap,
    );
  }

  @override
  Future<void> removeCachedBlogPost(String id) async {
    final db = await _dbHelper.database;
    
    // Add to sync queue for deletion
    await _syncManager.addToSyncQueue(
      tableName: 'blog_posts',
      recordId: id,
      operation: SyncOperation.delete,
    );

    await db.delete(
      'blog_posts',
      where: 'id = ?',
      whereArgs: [id],
    );

    // Also remove related blog post tags
    await db.delete(
      'blog_post_tags',
      where: 'blog_post_id = ?',
      whereArgs: [id],
    );
  }

  // Blog Tags Methods
  @override
  Future<List<BlogTagEntity>> getCachedBlogTags({
    int? limit,
    int? offset,
    bool? visible,
    String? search,
  }) async {
    final db = await _dbHelper.database;
    
    String whereClause = '1=1';
    List<dynamic> whereArgs = [];

    if (visible != null) {
      whereClause += ' AND visible = ?';
      whereArgs.add(visible ? 1 : 0);
    }

    if (search != null && search.isNotEmpty) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      whereArgs.add('%$search%');
      whereArgs.add('%$search%');
    }

    final result = await db.query(
      'blog_tags',
      where: whereClause,
      whereArgs: whereArgs,
      orderBy: 'name ASC',
      limit: limit,
      offset: offset,
    );

    return result.map((tagMap) => BlogTagModel.fromDatabaseJson(tagMap).toEntity()).toList();
  }

  @override
  Future<BlogTagEntity?> getCachedBlogTag(String id) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'blog_tags',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (result.isEmpty) return null;
    return BlogTagModel.fromDatabaseJson(result.first).toEntity();
  }

  @override
  Future<BlogTagEntity?> getCachedBlogTagBySlug(String slug) async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'blog_tags',
      where: 'slug = ?',
      whereArgs: [slug],
    );

    if (result.isEmpty) return null;
    return BlogTagModel.fromDatabaseJson(result.first).toEntity();
  }

  @override
  Future<void> cacheBlogTag(BlogTagEntity tag) async {
    final db = await _dbHelper.database;
    final tagModel = BlogTagModel.fromEntity(tag);
    final tagMap = tagModel.toDatabaseJson();
    
    tagMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
    tagMap['is_dirty'] = 0;

    await db.insert(
      'blog_tags',
      tagMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> cacheBlogTags(List<BlogTagEntity> tags) async {
    final db = await _dbHelper.database;
    final batch = db.batch();

    for (final tag in tags) {
      final tagModel = BlogTagModel.fromEntity(tag);
      final tagMap = tagModel.toDatabaseJson();
      
      tagMap['synced_at'] = DateTime.now().millisecondsSinceEpoch;
      tagMap['is_dirty'] = 0;

      batch.insert(
        'blog_tags',
        tagMap,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit();
  }

  @override
  Future<void> updateCachedBlogTag(BlogTagEntity tag) async {
    final db = await _dbHelper.database;
    final tagModel = BlogTagModel.fromEntity(tag);
    final tagMap = tagModel.toDatabaseJson();
    
    tagMap['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    tagMap['is_dirty'] = 1;

    await db.update(
      'blog_tags',
      tagMap,
      where: 'id = ?',
      whereArgs: [tag.id],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'blog_tags',
      recordId: tag.id,
      operation: SyncOperation.update,
      data: tagMap,
    );
  }

  @override
  Future<void> removeCachedBlogTag(String id) async {
    final db = await _dbHelper.database;
    
    await _syncManager.addToSyncQueue(
      tableName: 'blog_tags',
      recordId: id,
      operation: SyncOperation.delete,
    );

    await db.delete(
      'blog_tags',
      where: 'id = ?',
      whereArgs: [id],
    );

    // Remove from blog post tags relationships
    await db.delete(
      'blog_post_tags',
      where: 'tag_id = ?',
      whereArgs: [id],
    );
  }

  // Blog Post Tags Relationship Methods
  @override
  Future<void> assignTagToPost(String postId, String tagId) async {
    final db = await _dbHelper.database;
    
    await db.insert(
      'blog_post_tags',
      {
        'blog_post_id': postId,
        'tag_id': tagId,
        'created_at': DateTime.now().millisecondsSinceEpoch,
      },
      conflictAlgorithm: ConflictAlgorithm.ignore,
    );
  }

  @override
  Future<void> removeTagFromPost(String postId, String tagId) async {
    final db = await _dbHelper.database;
    
    await db.delete(
      'blog_post_tags',
      where: 'blog_post_id = ? AND tag_id = ?',
      whereArgs: [postId, tagId],
    );
  }

  @override
  Future<List<BlogTagEntity>> getPostTags(String postId) async {
    final db = await _dbHelper.database;
    
    final result = await db.rawQuery('''
      SELECT bt.* FROM blog_tags bt
      INNER JOIN blog_post_tags bpt ON bt.id = bpt.tag_id
      WHERE bpt.blog_post_id = ?
      ORDER BY bt.name ASC
    ''', [postId]);

    return result.map((tagMap) => BlogTagModel.fromDatabaseJson(tagMap).toEntity()).toList();
  }

  // Offline Operations
  @override
  Future<List<BlogPostEntity>> getDirtyBlogPosts() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'blog_posts',
      where: 'is_dirty = ?',
      whereArgs: [1],
    );

    return result.map((postMap) => BlogPostModel.fromDatabaseJson(postMap).toEntity()).toList();
  }

  @override
  Future<List<BlogTagEntity>> getDirtyBlogTags() async {
    final db = await _dbHelper.database;
    final result = await db.query(
      'blog_tags',
      where: 'is_dirty = ?',
      whereArgs: [1],
    );

    return result.map((tagMap) => BlogTagModel.fromDatabaseJson(tagMap).toEntity()).toList();
  }

  @override
  Future<void> markBlogPostAsDirty(String postId) async {
    final db = await _dbHelper.database;
    await db.update(
      'blog_posts',
      {'is_dirty': 1},
      where: 'id = ?',
      whereArgs: [postId],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'blog_posts',
      recordId: postId,
      operation: SyncOperation.update,
    );
  }

  @override
  Future<void> markBlogTagAsDirty(String tagId) async {
    final db = await _dbHelper.database;
    await db.update(
      'blog_tags',
      {'is_dirty': 1},
      where: 'id = ?',
      whereArgs: [tagId],
    );

    await _syncManager.addToSyncQueue(
      tableName: 'blog_tags',
      recordId: tagId,
      operation: SyncOperation.update,
    );
  }

  @override
  Future<void> markBlogPostAsSynced(String postId) async {
    final db = await _dbHelper.database;
    await db.update(
      'blog_posts',
      {
        'is_dirty': 0,
        'synced_at': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [postId],
    );
  }

  @override
  Future<void> markBlogTagAsSynced(String tagId) async {
    final db = await _dbHelper.database;
    await db.update(
      'blog_tags',
      {
        'is_dirty': 0,
        'synced_at': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [tagId],
    );
  }
}
