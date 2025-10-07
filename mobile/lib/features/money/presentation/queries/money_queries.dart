import 'package:flutter_query/flutter_query.dart';
import '../../domain/entities/idea_entity.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../../data/datasources/money_remote_datasource_dio.dart';
import '../../../../core/injection/injection_container.dart';

class MoneyQueries {
  static final _remoteDataSource = sl<MoneyRemoteDataSourceDio>();

  // Ideas Queries
  static QueryOptions<List<IdeaEntity>, List<dynamic>> getIdeas({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) {
    final key = [
      'money-ideas',
      page,
      limit,
      featured,
      visible,
      public,
      search,
      sortBy,
      sortOrder,
    ];

    return QueryOptions<List<IdeaEntity>, List<dynamic>>(
      key: key,
      fetcher: (key) => _remoteDataSource.getIdeas(
        page: page,
        limit: limit,
        featured: featured,
        visible: visible,
        public: public,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      ),
      enabled: true,
      initialData: null,
      initialDataUpdatedAt: null,
      placeholder: null,
      staleDuration: const Duration(minutes: 5),
      gcDuration: const Duration(hours: 1),
      refetchOnInit: RefetchBehavior.stale,
      refetchOnResumed: RefetchBehavior.stale,
    );
  }

  static QueryOptions<IdeaEntity, List<dynamic>> getIdeaById(String id) {
    final key = ['money-idea', id];

    return QueryOptions<IdeaEntity, List<dynamic>>(
      key: key,
      fetcher: (key) => _remoteDataSource.getIdeaById(id),
      enabled: true,
      initialData: null,
      initialDataUpdatedAt: null,
      placeholder: null,
      staleDuration: const Duration(minutes: 10),
      gcDuration: const Duration(hours: 2),
      refetchOnInit: RefetchBehavior.stale,
      refetchOnResumed: RefetchBehavior.stale,
    );
  }

  static QueryOptions<IdeaEntity, List<dynamic>> getIdeaBySlug(String slug) {
    final key = ['money-idea-slug', slug];

    return QueryOptions<IdeaEntity, List<dynamic>>(
      key: key,
      fetcher: (key) => _remoteDataSource.getIdeaBySlug(slug),
      enabled: true,
      initialData: null,
      initialDataUpdatedAt: null,
      placeholder: null,
      staleDuration: const Duration(minutes: 10),
      gcDuration: const Duration(hours: 2),
      refetchOnInit: RefetchBehavior.stale,
      refetchOnResumed: RefetchBehavior.stale,
    );
  }

  // AI Chats Queries
  static QueryOptions<List<AiChatEntity>, List<dynamic>> getAiChats({
    int? page,
    int? limit,
    String? ideaNodeId,
    String? agent,
    bool? archived,
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) {
    final key = [
      'money-ai-chats',
      page,
      limit,
      ideaNodeId,
      agent,
      archived,
      visible,
      search,
      sortBy,
      sortOrder,
    ];

    return QueryOptions<List<AiChatEntity>, List<dynamic>>(
      key: key,
      fetcher: (key) => _remoteDataSource.getAiChats(
        page: page,
        limit: limit,
        ideaNodeId: ideaNodeId,
        agent: agent,
        archived: archived,
        visible: visible,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      ),
      enabled: true,
      initialData: null,
      initialDataUpdatedAt: null,
      placeholder: null,
      staleDuration: const Duration(minutes: 5),
      gcDuration: const Duration(hours: 1),
      refetchOnInit: RefetchBehavior.stale,
      refetchOnResumed: RefetchBehavior.stale,
    );
  }

  static QueryOptions<AiChatEntity, List<dynamic>> getAiChatById(String id) {
    final key = ['money-ai-chat', id];

    return QueryOptions<AiChatEntity, List<dynamic>>(
      key: key,
      fetcher: (key) => _remoteDataSource.getAiChatById(id),
      enabled: true,
      initialData: null,
      initialDataUpdatedAt: null,
      placeholder: null,
      staleDuration: const Duration(minutes: 10),
      gcDuration: const Duration(hours: 2),
      refetchOnInit: RefetchBehavior.stale,
      refetchOnResumed: RefetchBehavior.stale,
    );
  }
}

// Parameter classes for mutations
class CreateIdeaParams {
  final String title;
  final String slug;
  final String document;
  final String? description;
  final bool featured;
  final bool visible;
  final bool public;
  final int order;

  CreateIdeaParams({
    required this.title,
    required this.slug,
    required this.document,
    this.description,
    required this.featured,
    required this.visible,
    required this.public,
    required this.order,
  });
}

class UpdateIdeaParams {
  final String id;
  final String? title;
  final String? slug;
  final String? document;
  final String? description;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final int? order;

  UpdateIdeaParams({
    required this.id,
    this.title,
    this.slug,
    this.document,
    this.description,
    this.featured,
    this.visible,
    this.public,
    this.order,
  });
}

class CreateAiChatParams {
  final String title;
  final String? ideaNodeId;
  final String agent;
  final String? model;
  final String? systemPrompt;
  final double temperature;
  final int? maxTokens;
  final bool visible;
  final bool archived;

  CreateAiChatParams({
    required this.title,
    this.ideaNodeId,
    required this.agent,
    this.model,
    this.systemPrompt,
    required this.temperature,
    this.maxTokens,
    required this.visible,
    required this.archived,
  });
}