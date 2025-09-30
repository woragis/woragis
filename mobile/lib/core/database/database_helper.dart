import 'dart:async';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  DatabaseHelper._internal();

  factory DatabaseHelper() => _instance;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'woragis.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
      onConfigure: _onConfigure,
    );
  }

  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
    await db.execute('PRAGMA journal_mode = WAL');
  }

  Future<void> _onCreate(Database db, int version) async {
    // Create all tables
    await _createAuthTables(db);
    await _createBlogTables(db);
    await _createProjectsTables(db);
    await _createFrameworksTables(db);
    await _createAboutTables(db);
    await _createEducationTables(db);
    await _createExperienceTables(db);
    await _createMoneyTables(db);
    await _createTestimonialsTables(db);
    await _createSettingsTables(db);
    await _createSyncTables(db);
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database migrations here
    // For now, we'll just recreate tables (in production, you'd want proper migrations)
    if (oldVersion < newVersion) {
      await _onCreate(db, newVersion);
    }
  }

  // Auth tables
  Future<void> _createAuthTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        first_name TEXT,
        last_name TEXT,
        avatar TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        is_active INTEGER NOT NULL DEFAULT 1,
        email_verified INTEGER NOT NULL DEFAULT 0,
        last_login_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    ''');
  }

  // Blog tables
  Future<void> _createBlogTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        featured_image TEXT,
        reading_time INTEGER,
        featured INTEGER NOT NULL DEFAULT 0,
        published INTEGER NOT NULL DEFAULT 0,
        published_at INTEGER,
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        public INTEGER NOT NULL DEFAULT 1,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS blog_tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT,
        post_count INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS blog_post_tags (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES blog_tags (id) ON DELETE CASCADE,
        UNIQUE(post_id, tag_id)
      )
    ''');
  }

  // Projects tables
  Future<void> _createProjectsTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        long_description TEXT,
        content TEXT,
        video_url TEXT,
        image TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        featured INTEGER NOT NULL DEFAULT 0,
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        public INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS project_frameworks (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        framework_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (framework_id) REFERENCES frameworks (id) ON DELETE CASCADE,
        UNIQUE(project_id, framework_id)
      )
    ''');
  }

  // Frameworks tables
  Future<void> _createFrameworksTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS frameworks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT,
        type TEXT NOT NULL,
        proficiency_level TEXT,
        visible INTEGER NOT NULL DEFAULT 1,
        public INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // About tables
  Future<void> _createAboutTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS about_core (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        current_profession_id TEXT,
        biography TEXT,
        featured_biography TEXT,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS biographies (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        featured_biography TEXT,
        full_biography TEXT,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS anime_list (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        my_anime_list_id TEXT,
        cover_image TEXT,
        genres TEXT, -- JSON array
        episodes INTEGER,
        current_episode INTEGER,
        rating REAL,
        notes TEXT,
        started_at INTEGER,
        completed_at INTEGER,
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS music_genres (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // Education tables
  Future<void> _createEducationTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS education (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        institution TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        degree_level TEXT,
        field_of_study TEXT,
        start_date INTEGER,
        end_date INTEGER,
        completion_date INTEGER,
        grade TEXT,
        credits INTEGER,
        certificate_id TEXT,
        issuer TEXT,
        validity_period TEXT,
        pdf_document TEXT,
        verification_url TEXT,
        skills TEXT, -- JSON array
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // Experience tables
  Future<void> _createExperienceTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        period TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        achievements TEXT, -- JSON array
        technologies TEXT, -- JSON array
        icon TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // Money tables
  Future<void> _createMoneyTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS ideas (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        document TEXT NOT NULL,
        description TEXT,
        featured INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        public INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS ai_chats (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        idea_node_id TEXT,
        agent TEXT NOT NULL,
        model TEXT,
        system_prompt TEXT,
        temperature REAL NOT NULL DEFAULT 0.7,
        max_tokens INTEGER,
        messages TEXT NOT NULL, -- JSON array
        visible INTEGER NOT NULL DEFAULT 1,
        archived INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // Testimonials tables
  Future<void> _createTestimonialsTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        company TEXT NOT NULL,
        content TEXT NOT NULL,
        avatar TEXT,
        rating INTEGER NOT NULL,
        featured INTEGER NOT NULL DEFAULT 0,
        order_index INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        public INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // Settings tables
  Future<void> _createSettingsTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        description TEXT,
        category TEXT,
        is_public INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER,
        is_dirty INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  // Sync tables
  Future<void> _createSyncTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        operation TEXT NOT NULL, -- CREATE, UPDATE, DELETE
        data TEXT, -- JSON data for the operation
        retry_count INTEGER NOT NULL DEFAULT 0,
        max_retries INTEGER NOT NULL DEFAULT 3,
        created_at INTEGER NOT NULL,
        last_retry_at INTEGER,
        status TEXT NOT NULL DEFAULT 'PENDING' -- PENDING, SYNCING, COMPLETED, FAILED
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS sync_status (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL UNIQUE,
        last_sync_at INTEGER,
        sync_token TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    ''');
  }

  // Utility methods
  Future<void> clearAllData() async {
    final db = await database;
    await db.delete('users');
    await db.delete('blog_posts');
    await db.delete('blog_tags');
    await db.delete('projects');
    await db.delete('frameworks');
    await db.delete('about_core');
    await db.delete('biographies');
    await db.delete('anime_list');
    await db.delete('music_genres');
    await db.delete('education');
    await db.delete('experiences');
    await db.delete('ideas');
    await db.delete('ai_chats');
    await db.delete('testimonials');
    await db.delete('settings');
    await db.delete('sync_queue');
    await db.delete('sync_status');
  }

  Future<void> close() async {
    final db = _database;
    if (db != null) {
      await db.close();
      _database = null;
    }
  }
}
