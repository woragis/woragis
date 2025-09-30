class QueryKeys {
  // Auth queries
  static const String authCurrentUser = 'auth:currentUser';
  static const String authSession = 'auth:session';
  static String authUser(String userId) => 'auth:user:$userId';

  // Blog queries
  static const String blogPosts = 'blog:posts';
  static String blogPost(String postId) => 'blog:post:$postId';
  static String blogPostBySlug(String slug) => 'blog:post:slug:$slug';
  static String blogPostsByTag(String tagId) => 'blog:posts:tag:$tagId';
  static String blogPostsSearch(String search) => 'blog:posts:search:$search';
  
  static const String blogTags = 'blog:tags';
  static String blogTag(String tagId) => 'blog:tag:$tagId';
  static String blogTagBySlug(String slug) => 'blog:tag:slug:$slug';
  static String blogPostTags(String postId) => 'blog:post:$postId:tags';

  // Projects queries
  static const String projects = 'projects:all';
  static String project(String projectId) => 'project:$projectId';
  static String projectBySlug(String slug) => 'project:slug:$slug';
  static String projectsByFramework(String frameworkId) => 'projects:framework:$frameworkId';
  static String projectsSearch(String search) => 'projects:search:$search';
  static String projectFrameworks(String projectId) => 'project:$projectId:frameworks';

  // Frameworks queries
  static const String frameworks = 'frameworks:all';
  static String framework(String frameworkId) => 'framework:$frameworkId';
  static String frameworkBySlug(String slug) => 'framework:slug:$slug';
  static String frameworksByType(String type) => 'frameworks:type:$type';
  static String frameworkProjects(String frameworkId) => 'framework:$frameworkId:projects';

  // About queries
  static const String aboutCore = 'about:core';
  static const String biography = 'about:biography';
  
  static const String animeList = 'about:anime:list';
  static String anime(String animeId) => 'about:anime:$animeId';
  static String animeByStatus(String status) => 'about:anime:status:$status';
  
  static const String musicGenres = 'about:music:genres';
  static String musicGenre(String genreId) => 'about:music:genre:$genreId';

  // Education queries
  static const String educationList = 'education:list';
  static String education(String educationId) => 'education:$educationId';
  static String educationByType(String type) => 'education:type:$type';
  static String educationByInstitution(String institution) => 'education:institution:$institution';

  // Experience queries
  static const String experienceList = 'experience:list';
  static String experience(String experienceId) => 'experience:$experienceId';
  static String experienceByCompany(String company) => 'experience:company:$company';

  // Money queries
  static const String ideas = 'money:ideas';
  static String idea(String ideaId) => 'money:idea:$ideaId';
  static String ideaBySlug(String slug) => 'money:idea:slug:$slug';
  
  static const String aiChats = 'money:ai:chats';
  static String aiChat(String chatId) => 'money:ai:chat:$chatId';
  static String aiChatsByIdea(String ideaId) => 'money:ai:chats:idea:$ideaId';
  static String aiChatMessages(String chatId) => 'money:ai:chat:$chatId:messages';

  // Testimonials queries
  static const String testimonials = 'testimonials:all';
  static String testimonial(String testimonialId) => 'testimonial:$testimonialId';
  static String testimonialsByRating(int rating) => 'testimonials:rating:$rating';

  // Settings queries
  static const String settings = 'settings:all';
  static String setting(String key) => 'settings:$key';
  static String settingsByCategory(String category) => 'settings:category:$category';
  static const String coreProfileSettings = 'settings:core:profile';
  static const String socialMediaSettings = 'settings:social:media';
  static const String contactSettings = 'settings:contact';
  static const String siteSettings = 'settings:site';

  // Sync queries
  static const String syncStatus = 'sync:status';
  static const String syncQueue = 'sync:queue';
  static String syncTableStatus(String tableName) => 'sync:table:$tableName';

  // Statistics queries
  static String blogPostStats(String postId) => 'blog:post:$postId:stats';
  static String projectStats(String projectId) => 'project:$projectId:stats';
  static String testimonialStats(String testimonialId) => 'testimonial:$testimonialId:stats';

  // Search queries
  static String globalSearch(String query) => 'search:global:$query';
  static String blogSearch(String query) => 'search:blog:$query';
  static String projectSearch(String query) => 'search:project:$query';
}

// Helper class for building query keys with parameters
class QueryKeyBuilder {
  static List<dynamic> list({
    required String base,
    Map<String, dynamic>? params,
    String? suffix,
  }) {
    final key = <dynamic>[base];
    
    if (params != null) {
      params.forEach((paramKey, value) {
        if (value != null) {
          key.add('$paramKey:$value');
        }
      });
    }
    
    if (suffix != null) {
      key.add(suffix);
    }
    
    return key;
  }

  static String blogPostsKey({
    int? page,
    int? limit,
    bool? published,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) {
    final params = <String, dynamic>{};
    if (page != null) params['page'] = page;
    if (limit != null) params['limit'] = limit;
    if (published != null) params['published'] = published;
    if (featured != null) params['featured'] = featured;
    if (visible != null) params['visible'] = visible;
    if (public != null) params['public'] = public;
    if (search != null) params['search'] = search;
    if (sortBy != null) params['sortBy'] = sortBy;
    if (sortOrder != null) params['sortOrder'] = sortOrder;
    
    return 'blog:posts:${params.toString()}';
  }

  static String projectsKey({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    List<String>? technologies,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) {
    final params = <String, dynamic>{};
    if (page != null) params['page'] = page;
    if (limit != null) params['limit'] = limit;
    if (featured != null) params['featured'] = featured;
    if (visible != null) params['visible'] = visible;
    if (public != null) params['public'] = public;
    if (technologies != null) params['technologies'] = technologies;
    if (search != null) params['search'] = search;
    if (sortBy != null) params['sortBy'] = sortBy;
    if (sortOrder != null) params['sortOrder'] = sortOrder;
    
    return 'projects:${params.toString()}';
  }

  static String frameworksKey({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? type,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) {
    final params = <String, dynamic>{};
    if (page != null) params['page'] = page;
    if (limit != null) params['limit'] = limit;
    if (visible != null) params['visible'] = visible;
    if (public != null) params['public'] = public;
    if (type != null) params['type'] = type;
    if (search != null) params['search'] = search;
    if (sortBy != null) params['sortBy'] = sortBy;
    if (sortOrder != null) params['sortOrder'] = sortOrder;
    
    return 'frameworks:${params.toString()}';
  }
}
