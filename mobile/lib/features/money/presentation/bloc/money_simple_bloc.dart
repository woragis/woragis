import 'dart:developer';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/idea_entity.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../../domain/repositories/money_repository.dart';
import '../../../../core/injection/injection_container.dart';

// Events
abstract class MoneySimpleEvent {}

class LoadIdeas extends MoneySimpleEvent {
  final int? page;
  final int? limit;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  LoadIdeas({
    this.page,
    this.limit,
    this.featured,
    this.visible,
    this.public,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}

class LoadIdeaById extends MoneySimpleEvent {
  final String id;

  LoadIdeaById(this.id);
}

class LoadIdeaBySlug extends MoneySimpleEvent {
  final String slug;

  LoadIdeaBySlug(this.slug);
}

class CreateIdea extends MoneySimpleEvent {
  final String title;
  final String slug;
  final String document;
  final String? description;
  final bool featured;
  final bool visible;
  final bool public;
  final int order;

  CreateIdea({
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

class UpdateIdea extends MoneySimpleEvent {
  final String id;
  final String? title;
  final String? slug;
  final String? document;
  final String? description;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final int? order;

  UpdateIdea({
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

class DeleteIdea extends MoneySimpleEvent {
  final String id;

  DeleteIdea(this.id);
}

class LoadAiChats extends MoneySimpleEvent {
  final int? page;
  final int? limit;
  final String? ideaNodeId;
  final String? agent;
  final bool? archived;
  final bool? visible;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  LoadAiChats({
    this.page,
    this.limit,
    this.ideaNodeId,
    this.agent,
    this.archived,
    this.visible,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}

class LoadAiChatById extends MoneySimpleEvent {
  final String id;

  LoadAiChatById(this.id);
}

class CreateAiChat extends MoneySimpleEvent {
  final String title;
  final String? ideaNodeId;
  final String agent;
  final String? model;
  final String? systemPrompt;
  final double temperature;
  final int? maxTokens;
  final bool visible;
  final bool archived;

  CreateAiChat({
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

class UpdateAiChat extends MoneySimpleEvent {
  final String id;
  final String? title;
  final String? ideaNodeId;
  final String? agent;
  final String? model;
  final String? systemPrompt;
  final double? temperature;
  final int? maxTokens;
  final bool? visible;
  final bool? archived;

  UpdateAiChat({
    required this.id,
    this.title,
    this.ideaNodeId,
    this.agent,
    this.model,
    this.systemPrompt,
    this.temperature,
    this.maxTokens,
    this.visible,
    this.archived,
  });
}

class DeleteAiChat extends MoneySimpleEvent {
  final String id;

  DeleteAiChat(this.id);
}

// States
abstract class MoneySimpleState {}

class MoneySimpleInitial extends MoneySimpleState {}

class MoneySimpleLoading extends MoneySimpleState {}

class MoneySimpleLoaded extends MoneySimpleState {
  final List<IdeaEntity>? ideas;
  final IdeaEntity? idea;
  final List<AiChatEntity>? aiChats;
  final AiChatEntity? aiChat;

  MoneySimpleLoaded({
    this.ideas,
    this.idea,
    this.aiChats,
    this.aiChat,
  });
}

class MoneySimpleError extends MoneySimpleState {
  final String message;

  MoneySimpleError(this.message);
}

// BLoC
class MoneySimpleBloc extends Bloc<MoneySimpleEvent, MoneySimpleState> {
  final MoneyRepository _moneyRepository = sl<MoneyRepository>();

  MoneySimpleBloc() : super(MoneySimpleInitial()) {
    on<LoadIdeas>(_onLoadIdeas);
    on<LoadIdeaById>(_onLoadIdeaById);
    on<LoadIdeaBySlug>(_onLoadIdeaBySlug);
    on<CreateIdea>(_onCreateIdea);
    on<UpdateIdea>(_onUpdateIdea);
    on<DeleteIdea>(_onDeleteIdea);
    on<LoadAiChats>(_onLoadAiChats);
    on<LoadAiChatById>(_onLoadAiChatById);
    on<CreateAiChat>(_onCreateAiChat);
    on<UpdateAiChat>(_onUpdateAiChat);
    on<DeleteAiChat>(_onDeleteAiChat);
  }

  Future<void> _onLoadIdeas(LoadIdeas event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Loading ideas');
      
      final result = await _moneyRepository.getIdeas(
        page: event.page,
        limit: event.limit,
        featured: event.featured,
        visible: event.visible,
        public: event.public,
        search: event.search,
        sortBy: event.sortBy,
        sortOrder: event.sortOrder,
      );
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (ideas) {
          emit(MoneySimpleLoaded(ideas: ideas));
          log('✅ MoneySimpleBloc: Ideas loaded successfully: ${ideas.length} items');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error loading ideas: $e');
      emit(MoneySimpleError('Failed to load ideas: $e'));
    }
  }

  Future<void> _onLoadIdeaById(LoadIdeaById event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Loading idea by ID: ${event.id}');
      
      final result = await _moneyRepository.getIdeaById(event.id);
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (idea) {
          emit(MoneySimpleLoaded(idea: idea));
          log('✅ MoneySimpleBloc: Idea loaded successfully: ${idea.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error loading idea by ID: $e');
      emit(MoneySimpleError('Failed to load idea: $e'));
    }
  }

  Future<void> _onLoadIdeaBySlug(LoadIdeaBySlug event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Loading idea by slug: ${event.slug}');
      
      final result = await _moneyRepository.getIdeaBySlug(event.slug);
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (idea) {
          emit(MoneySimpleLoaded(idea: idea));
          log('✅ MoneySimpleBloc: Idea loaded successfully: ${idea.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error loading idea by slug: $e');
      emit(MoneySimpleError('Failed to load idea: $e'));
    }
  }

  Future<void> _onCreateIdea(CreateIdea event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Creating idea: ${event.title}');
      
      final result = await _moneyRepository.createIdea(
        title: event.title,
        slug: event.slug,
        document: event.document,
        description: event.description,
        featured: event.featured,
        visible: event.visible,
        public: event.public,
        order: event.order,
      );
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (idea) {
          emit(MoneySimpleLoaded(idea: idea));
          log('✅ MoneySimpleBloc: Idea created successfully: ${idea.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error creating idea: $e');
      emit(MoneySimpleError('Failed to create idea: $e'));
    }
  }

  Future<void> _onUpdateIdea(UpdateIdea event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Updating idea: ${event.id}');
      
      final result = await _moneyRepository.updateIdea(
        id: event.id,
        title: event.title,
        slug: event.slug,
        document: event.document,
        description: event.description,
        featured: event.featured,
        visible: event.visible,
        public: event.public,
        order: event.order,
      );
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (idea) {
          emit(MoneySimpleLoaded(idea: idea));
          log('✅ MoneySimpleBloc: Idea updated successfully: ${idea.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error updating idea: $e');
      emit(MoneySimpleError('Failed to update idea: $e'));
    }
  }

  Future<void> _onDeleteIdea(DeleteIdea event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Deleting idea: ${event.id}');
      
      final result = await _moneyRepository.deleteIdea(event.id);
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (_) {
          emit(MoneySimpleInitial());
          log('✅ MoneySimpleBloc: Idea deleted successfully');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error deleting idea: $e');
      emit(MoneySimpleError('Failed to delete idea: $e'));
    }
  }

  Future<void> _onLoadAiChats(LoadAiChats event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Loading AI chats');
      
      final result = await _moneyRepository.getAiChats(
        page: event.page,
        limit: event.limit,
        ideaNodeId: event.ideaNodeId,
        agent: event.agent,
        archived: event.archived,
        visible: event.visible,
        search: event.search,
        sortBy: event.sortBy,
        sortOrder: event.sortOrder,
      );
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (aiChats) {
          emit(MoneySimpleLoaded(aiChats: aiChats));
          log('✅ MoneySimpleBloc: AI chats loaded successfully: ${aiChats.length} items');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error loading AI chats: $e');
      emit(MoneySimpleError('Failed to load AI chats: $e'));
    }
  }

  Future<void> _onLoadAiChatById(LoadAiChatById event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Loading AI chat by ID: ${event.id}');
      
      final result = await _moneyRepository.getAiChatById(event.id);
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (aiChat) {
          emit(MoneySimpleLoaded(aiChat: aiChat));
          log('✅ MoneySimpleBloc: AI chat loaded successfully: ${aiChat.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error loading AI chat by ID: $e');
      emit(MoneySimpleError('Failed to load AI chat: $e'));
    }
  }

  Future<void> _onCreateAiChat(CreateAiChat event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Creating AI chat: ${event.title}');
      
      final result = await _moneyRepository.createAiChat(
        title: event.title,
        ideaNodeId: event.ideaNodeId,
        agent: event.agent,
        model: event.model,
        systemPrompt: event.systemPrompt,
        temperature: event.temperature,
        maxTokens: event.maxTokens,
        visible: event.visible,
        archived: event.archived,
      );
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (aiChat) {
          emit(MoneySimpleLoaded(aiChat: aiChat));
          log('✅ MoneySimpleBloc: AI chat created successfully: ${aiChat.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error creating AI chat: $e');
      emit(MoneySimpleError('Failed to create AI chat: $e'));
    }
  }

  Future<void> _onUpdateAiChat(UpdateAiChat event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Updating AI chat: ${event.id}');
      
      final result = await _moneyRepository.updateAiChat(
        id: event.id,
        title: event.title,
        ideaNodeId: event.ideaNodeId,
        agent: event.agent,
        model: event.model,
        systemPrompt: event.systemPrompt,
        temperature: event.temperature,
        maxTokens: event.maxTokens,
        visible: event.visible,
        archived: event.archived,
      );
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (aiChat) {
          emit(MoneySimpleLoaded(aiChat: aiChat));
          log('✅ MoneySimpleBloc: AI chat updated successfully: ${aiChat.title}');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error updating AI chat: $e');
      emit(MoneySimpleError('Failed to update AI chat: $e'));
    }
  }

  Future<void> _onDeleteAiChat(DeleteAiChat event, Emitter<MoneySimpleState> emit) async {
    try {
      emit(MoneySimpleLoading());
      log('🔍 MoneySimpleBloc: Deleting AI chat: ${event.id}');
      
      final result = await _moneyRepository.deleteAiChat(event.id);
      
      result.fold(
        (failure) => emit(MoneySimpleError(failure.message)),
        (_) {
          emit(MoneySimpleInitial());
          log('✅ MoneySimpleBloc: AI chat deleted successfully');
        },
      );
    } catch (e) {
      log('❌ MoneySimpleBloc: Error deleting AI chat: $e');
      emit(MoneySimpleError('Failed to delete AI chat: $e'));
    }
  }
}
