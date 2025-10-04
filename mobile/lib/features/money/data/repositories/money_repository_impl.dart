import 'package:dartz/dartz.dart';
import '../../domain/entities/idea_entity.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../../domain/repositories/money_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../datasources/money_local_datasource.dart';
import '../datasources/money_remote_datasource_dio.dart';

class MoneyRepositoryImpl implements MoneyRepository {
  final MoneyRemoteDataSourceDio remoteDataSource;
  final MoneyLocalDataSource localDataSource;

  MoneyRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, List<IdeaEntity>>> getIdeas({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final ideas = await remoteDataSource.getIdeas(
        page: page,
        limit: limit,
        featured: featured,
        visible: visible,
        public: public,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );

      // Cache the ideas locally
      await localDataSource.cacheIdeas(ideas);

      return Right(ideas);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedIdeas = await localDataSource.getCachedIdeas();
        return Right(cachedIdeas);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, IdeaEntity>> getIdeaById(String id) async {
    try {
      final idea = await remoteDataSource.getIdeaById(id);
      return Right(idea);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedIdea = await localDataSource.getCachedIdea(id);
        if (cachedIdea != null) {
          return Right(cachedIdea);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, IdeaEntity>> getIdeaBySlug(String slug) async {
    try {
      final idea = await remoteDataSource.getIdeaBySlug(slug);
      return Right(idea);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, IdeaEntity>> createIdea({
    required String title,
    required String slug,
    required String document,
    String? description,
    required bool featured,
    required bool visible,
    required bool public,
    required int order,
  }) async {
    try {
      final idea = await remoteDataSource.createIdea(
        title: title,
        slug: slug,
        document: document,
        description: description,
        featured: featured,
        visible: visible,
        public: public,
        order: order,
      );

      // Cache the new idea
      await localDataSource.cacheIdea(idea);

      return Right(idea);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, IdeaEntity>> updateIdea({
    required String id,
    String? title,
    String? slug,
    String? document,
    String? description,
    bool? featured,
    bool? visible,
    bool? public,
    int? order,
  }) async {
    try {
      final idea = await remoteDataSource.updateIdea(
        id: id,
        title: title,
        slug: slug,
        document: document,
        description: description,
        featured: featured,
        visible: visible,
        public: public,
        order: order,
      );

      // Update cached idea
      await localDataSource.updateCachedIdea(idea);

      return Right(idea);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteIdea(String id) async {
    try {
      await remoteDataSource.deleteIdea(id);
      await localDataSource.removeCachedIdea(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<AiChatEntity>>> getAiChats({
    int? page,
    int? limit,
    String? ideaNodeId,
    String? agent,
    bool? archived,
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final chats = await remoteDataSource.getAiChats(
        page: page,
        limit: limit,
        ideaNodeId: ideaNodeId,
        agent: agent,
        archived: archived,
        visible: visible,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      );

      // Cache the chats locally
      await localDataSource.cacheAiChats(chats);

      return Right(chats);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Return cached data if available
      try {
        final cachedChats = await localDataSource.getCachedAiChats();
        return Right(cachedChats);
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AiChatEntity>> getAiChatById(String id) async {
    try {
      final chat = await remoteDataSource.getAiChatById(id);
      return Right(chat);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      // Try to get from cache
      try {
        final cachedChat = await localDataSource.getCachedAiChat(id);
        if (cachedChat != null) {
          return Right(cachedChat);
        }
        return Left(NetworkFailure(e.message));
      } catch (cacheError) {
        return Left(NetworkFailure(e.message));
      }
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AiChatEntity>> createAiChat({
    required String title,
    String? ideaNodeId,
    required String agent,
    String? model,
    String? systemPrompt,
    required double temperature,
    int? maxTokens,
    required bool visible,
    required bool archived,
  }) async {
    try {
      final chat = await remoteDataSource.createAiChat(
        title: title,
        ideaNodeId: ideaNodeId,
        agent: agent,
        model: model,
        systemPrompt: systemPrompt,
        temperature: temperature,
        maxTokens: maxTokens,
        visible: visible,
        archived: archived,
      );

      // Cache the new chat
      await localDataSource.cacheAiChat(chat);

      return Right(chat);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AiChatEntity>> updateAiChat({
    required String id,
    String? title,
    String? ideaNodeId,
    String? agent,
    String? model,
    String? systemPrompt,
    double? temperature,
    int? maxTokens,
    bool? visible,
    bool? archived,
  }) async {
    try {
      final chat = await remoteDataSource.updateAiChat(
        id: id,
        title: title,
        ideaNodeId: ideaNodeId,
        agent: agent,
        model: model,
        systemPrompt: systemPrompt,
        temperature: temperature,
        maxTokens: maxTokens,
        visible: visible,
        archived: archived,
      );

      // Update cached chat
      await localDataSource.updateCachedAiChat(chat);

      return Right(chat);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteAiChat(String id) async {
    try {
      await remoteDataSource.deleteAiChat(id);
      await localDataSource.removeCachedAiChat(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AiChatEntity>> sendMessage({
    required String chatId,
    required String message,
  }) async {
    try {
      final chat = await remoteDataSource.sendMessage(
        chatId: chatId,
        message: message,
      );
      return Right(chat);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<ChatMessageEntity>>> getChatMessages(String chatId) async {
    try {
      final messages = await remoteDataSource.getChatMessages(chatId);
      return Right(messages);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnexpectedFailure(e.toString()));
    }
  }


  @override
  Future<Either<Failure, List<IdeaEntity>>> getCachedIdeas() async {
    try {
      final ideas = await localDataSource.getCachedIdeas();
      return Right(ideas);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheIdeas(List<IdeaEntity> ideas) async {
    try {
      await localDataSource.cacheIdeas(ideas);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<AiChatEntity>>> getCachedAiChats() async {
    try {
      final chats = await localDataSource.getCachedAiChats();
      return Right(chats);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> cacheAiChats(List<AiChatEntity> chats) async {
    try {
      await localDataSource.cacheAiChats(chats);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
