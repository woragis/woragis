import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/injection/injection_container.dart';
import '../../domain/entities/idea_entity.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../../domain/usecases/usecases.dart';

// Events
abstract class MoneyEvent extends Equatable {
  const MoneyEvent();

  @override
  List<Object?> get props => [];
}

class GetIdeasRequested extends MoneyEvent {
  final int? page;
  final int? limit;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  const GetIdeasRequested({
    this.page,
    this.limit,
    this.featured,
    this.visible,
    this.public,
    this.search,
    this.sortBy,
    this.sortOrder,
  });

  @override
  List<Object?> get props => [
        page,
        limit,
        featured,
        visible,
        public,
        search,
        sortBy,
        sortOrder,
      ];
}

class GetIdeaByIdRequested extends MoneyEvent {
  final String id;

  const GetIdeaByIdRequested(this.id);

  @override
  List<Object> get props => [id];
}

class CreateIdeaRequested extends MoneyEvent {
  final String title;
  final String slug;
  final String document;
  final String? description;
  final bool featured;
  final bool visible;
  final bool public;
  final int order;

  const CreateIdeaRequested({
    required this.title,
    required this.slug,
    required this.document,
    this.description,
    required this.featured,
    required this.visible,
    required this.public,
    required this.order,
  });

  @override
  List<Object?> get props => [
        title,
        slug,
        document,
        description,
        featured,
        visible,
        public,
        order,
      ];
}

class UpdateIdeaRequested extends MoneyEvent {
  final String id;
  final String? title;
  final String? slug;
  final String? document;
  final String? description;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final int? order;

  const UpdateIdeaRequested({
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

  @override
  List<Object?> get props => [
        id,
        title,
        slug,
        document,
        description,
        featured,
        visible,
        public,
        order,
      ];
}

class DeleteIdeaRequested extends MoneyEvent {
  final String id;

  const DeleteIdeaRequested(this.id);

  @override
  List<Object> get props => [id];
}

class GetAiChatsRequested extends MoneyEvent {
  final int? page;
  final int? limit;
  final String? ideaNodeId;
  final String? agent;
  final bool? archived;
  final bool? visible;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  const GetAiChatsRequested({
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

  @override
  List<Object?> get props => [
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
}

class GetAiChatByIdRequested extends MoneyEvent {
  final String id;

  const GetAiChatByIdRequested(this.id);

  @override
  List<Object> get props => [id];
}

class CreateAiChatRequested extends MoneyEvent {
  final String title;
  final String? ideaNodeId;
  final String agent;
  final String? model;
  final String? systemPrompt;
  final double temperature;
  final int? maxTokens;
  final bool visible;
  final bool archived;

  const CreateAiChatRequested({
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

  @override
  List<Object?> get props => [
        title,
        ideaNodeId,
        agent,
        model,
        systemPrompt,
        temperature,
        maxTokens,
        visible,
        archived,
      ];
}

class SendMessageRequested extends MoneyEvent {
  final String chatId;
  final String message;

  const SendMessageRequested({
    required this.chatId,
    required this.message,
  });

  @override
  List<Object> get props => [chatId, message];
}

// States
abstract class MoneyState extends Equatable {
  const MoneyState();

  @override
  List<Object?> get props => [];
}

class MoneyInitial extends MoneyState {}

class MoneyLoading extends MoneyState {}

class MoneyError extends MoneyState {
  final String message;

  const MoneyError(this.message);

  @override
  List<Object> get props => [message];
}

// Composite state that holds multiple pieces of data
class MoneyDataState extends MoneyState {
  final List<IdeaEntity>? ideas;
  final IdeaEntity? currentIdea;
  final List<AiChatEntity>? aiChats;
  final AiChatEntity? currentAiChat;
  final bool isLoading;
  final String? error;

  const MoneyDataState({
    this.ideas,
    this.currentIdea,
    this.aiChats,
    this.currentAiChat,
    this.isLoading = false,
    this.error,
  });

  MoneyDataState copyWith({
    List<IdeaEntity>? ideas,
    IdeaEntity? currentIdea,
    List<AiChatEntity>? aiChats,
    AiChatEntity? currentAiChat,
    bool? isLoading,
    String? error,
    bool clearIdeas = false,
    bool clearCurrentIdea = false,
    bool clearAiChats = false,
    bool clearCurrentAiChat = false,
  }) {
    return MoneyDataState(
      ideas: clearIdeas ? null : (ideas ?? this.ideas),
      currentIdea: clearCurrentIdea ? null : (currentIdea ?? this.currentIdea),
      aiChats: clearAiChats ? null : (aiChats ?? this.aiChats),
      currentAiChat: clearCurrentAiChat ? null : (currentAiChat ?? this.currentAiChat),
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  @override
  List<Object?> get props => [ideas, currentIdea, aiChats, currentAiChat, isLoading, error];
}

// Legacy states for backward compatibility
class IdeasLoaded extends MoneyState {
  final List<IdeaEntity> ideas;

  const IdeasLoaded(this.ideas);

  @override
  List<Object> get props => [ideas];
}

class IdeaLoaded extends MoneyState {
  final IdeaEntity idea;

  const IdeaLoaded(this.idea);

  @override
  List<Object> get props => [idea];
}

class IdeaCreated extends MoneyState {
  final IdeaEntity idea;

  const IdeaCreated(this.idea);

  @override
  List<Object> get props => [idea];
}

class IdeaUpdated extends MoneyState {
  final IdeaEntity idea;

  const IdeaUpdated(this.idea);

  @override
  List<Object> get props => [idea];
}

class IdeaDeleted extends MoneyState {
  final String id;

  const IdeaDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class AiChatsLoaded extends MoneyState {
  final List<AiChatEntity> aiChats;

  const AiChatsLoaded(this.aiChats);

  @override
  List<Object> get props => [aiChats];
}

class AiChatLoaded extends MoneyState {
  final AiChatEntity aiChat;

  const AiChatLoaded(this.aiChat);

  @override
  List<Object> get props => [aiChat];
}

class AiChatCreated extends MoneyState {
  final AiChatEntity aiChat;

  const AiChatCreated(this.aiChat);

  @override
  List<Object> get props => [aiChat];
}

class MessageSent extends MoneyState {
  final String chatId;
  final String message;

  const MessageSent({
    required this.chatId,
    required this.message,
  });

  @override
  List<Object> get props => [chatId, message];
}

// BLoC
class MoneyBloc extends Bloc<MoneyEvent, MoneyState> {
  final GetIdeasUseCase getIdeasUseCase;
  final GetIdeaByIdUseCase getIdeaByIdUseCase;
  final GetIdeaBySlugUseCase getIdeaBySlugUseCase;
  final CreateIdeaUseCase createIdeaUseCase;
  final UpdateIdeaUseCase updateIdeaUseCase;
  final DeleteIdeaUseCase deleteIdeaUseCase;
  final GetAiChatsUseCase getAiChatsUseCase;
  final GetAiChatByIdUseCase getAiChatByIdUseCase;
  final CreateAiChatUseCase createAiChatUseCase;
  final UpdateAiChatUseCase updateAiChatUseCase;
  final DeleteAiChatUseCase deleteAiChatUseCase;
  final SendMessageUseCase sendMessageUseCase;
  final GetChatMessagesUseCase getChatMessagesUseCase;

  MoneyBloc({
    required this.getIdeasUseCase,
    required this.getIdeaByIdUseCase,
    required this.getIdeaBySlugUseCase,
    required this.createIdeaUseCase,
    required this.updateIdeaUseCase,
    required this.deleteIdeaUseCase,
    required this.getAiChatsUseCase,
    required this.getAiChatByIdUseCase,
    required this.createAiChatUseCase,
    required this.updateAiChatUseCase,
    required this.deleteAiChatUseCase,
    required this.sendMessageUseCase,
    required this.getChatMessagesUseCase,
  }) : super(const MoneyDataState()) {
    on<GetIdeasRequested>(_onGetIdeasRequested);
    on<GetIdeaByIdRequested>(_onGetIdeaByIdRequested);
    on<CreateIdeaRequested>(_onCreateIdeaRequested);
    on<UpdateIdeaRequested>(_onUpdateIdeaRequested);
    on<DeleteIdeaRequested>(_onDeleteIdeaRequested);
    on<GetAiChatsRequested>(_onGetAiChatsRequested);
    on<GetAiChatByIdRequested>(_onGetAiChatByIdRequested);
    on<CreateAiChatRequested>(_onCreateAiChatRequested);
    on<SendMessageRequested>(_onSendMessageRequested);
  }

  Future<void> _onGetIdeasRequested(
    GetIdeasRequested event,
    Emitter<MoneyState> emit,
  ) async {
    // Preserve existing data while loading
    if (state is MoneyDataState) {
      final currentState = state as MoneyDataState;
      emit(currentState.copyWith(isLoading: true, error: null));
    } else {
      emit(const MoneyDataState(isLoading: true));
    }

    final result = await getIdeasUseCase(GetIdeasParams(
      page: event.page,
      limit: event.limit,
      featured: event.featured,
      visible: event.visible,
      public: event.public,
      search: event.search,
      sortBy: event.sortBy,
      sortOrder: event.sortOrder,
    ));

    result.fold(
      (failure) {
        if (state is MoneyDataState) {
          final currentState = state as MoneyDataState;
          emit(currentState.copyWith(isLoading: false, error: failure.message));
        } else {
          emit(MoneyError(failure.message));
        }
      },
      (ideas) {
        if (state is MoneyDataState) {
          final currentState = state as MoneyDataState;
          emit(currentState.copyWith(ideas: ideas, isLoading: false, error: null));
        } else {
          emit(IdeasLoaded(ideas));
        }
      },
    );
  }

  Future<void> _onGetIdeaByIdRequested(
    GetIdeaByIdRequested event,
    Emitter<MoneyState> emit,
  ) async {
    // Preserve existing data while loading
    if (state is MoneyDataState) {
      final currentState = state as MoneyDataState;
      emit(currentState.copyWith(isLoading: true, error: null));
    } else {
      emit(const MoneyDataState(isLoading: true));
    }

    final result = await getIdeaByIdUseCase(event.id);

    result.fold(
      (failure) {
        if (state is MoneyDataState) {
          final currentState = state as MoneyDataState;
          emit(currentState.copyWith(isLoading: false, error: failure.message));
        } else {
          emit(MoneyError(failure.message));
        }
      },
      (idea) {
        if (state is MoneyDataState) {
          final currentState = state as MoneyDataState;
          emit(currentState.copyWith(currentIdea: idea, isLoading: false, error: null));
        } else {
          emit(IdeaLoaded(idea));
        }
      },
    );
  }

  Future<void> _onCreateIdeaRequested(
    CreateIdeaRequested event,
    Emitter<MoneyState> emit,
  ) async {
    emit(MoneyLoading());

    final result = await createIdeaUseCase(
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
      (failure) => emit(MoneyError(failure.message)),
      (idea) => emit(IdeaCreated(idea)),
    );
  }

  Future<void> _onUpdateIdeaRequested(
    UpdateIdeaRequested event,
    Emitter<MoneyState> emit,
  ) async {
    emit(MoneyLoading());

    final result = await updateIdeaUseCase(
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
      (failure) => emit(MoneyError(failure.message)),
      (idea) => emit(IdeaUpdated(idea)),
    );
  }

  Future<void> _onDeleteIdeaRequested(
    DeleteIdeaRequested event,
    Emitter<MoneyState> emit,
  ) async {
    emit(MoneyLoading());

    final result = await deleteIdeaUseCase(event.id);

    result.fold(
      (failure) => emit(MoneyError(failure.message)),
      (_) => emit(IdeaDeleted(event.id)),
    );
  }

  Future<void> _onGetAiChatsRequested(
    GetAiChatsRequested event,
    Emitter<MoneyState> emit,
  ) async {
    emit(MoneyLoading());

    final result = await getAiChatsUseCase(
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
      (failure) => emit(MoneyError(failure.message)),
      (chats) => emit(AiChatsLoaded(chats)),
    );
  }

  Future<void> _onGetAiChatByIdRequested(
    GetAiChatByIdRequested event,
    Emitter<MoneyState> emit,
  ) async {
    emit(MoneyLoading());

    final result = await getAiChatByIdUseCase(event.id);

    result.fold(
      (failure) => emit(MoneyError(failure.message)),
      (chat) => emit(AiChatLoaded(chat)),
    );
  }

  Future<void> _onCreateAiChatRequested(
    CreateAiChatRequested event,
    Emitter<MoneyState> emit,
  ) async {
    emit(MoneyLoading());

    final result = await createAiChatUseCase(
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
      (failure) => emit(MoneyError(failure.message)),
      (chat) => emit(AiChatCreated(chat)),
    );
  }

  Future<void> _onSendMessageRequested(
    SendMessageRequested event,
    Emitter<MoneyState> emit,
  ) async {
    final result = await sendMessageUseCase(
      chatId: event.chatId,
      message: event.message,
    );

    result.fold(
      (failure) => emit(MoneyError(failure.message)),
      (chat) => emit(MessageSent(chatId: event.chatId, message: event.message)),
    );
  }
}

// Factory function for creating MoneyBloc with dependency injection
MoneyBloc createMoneyBloc() {
  return MoneyBloc(
    getIdeasUseCase: sl<GetIdeasUseCase>(),
    getIdeaByIdUseCase: sl<GetIdeaByIdUseCase>(),
    getIdeaBySlugUseCase: sl<GetIdeaBySlugUseCase>(),
    createIdeaUseCase: sl<CreateIdeaUseCase>(),
    updateIdeaUseCase: sl<UpdateIdeaUseCase>(),
    deleteIdeaUseCase: sl<DeleteIdeaUseCase>(),
    getAiChatsUseCase: sl<GetAiChatsUseCase>(),
    getAiChatByIdUseCase: sl<GetAiChatByIdUseCase>(),
    createAiChatUseCase: sl<CreateAiChatUseCase>(),
    updateAiChatUseCase: sl<UpdateAiChatUseCase>(),
    deleteAiChatUseCase: sl<DeleteAiChatUseCase>(),
    sendMessageUseCase: sl<SendMessageUseCase>(),
    getChatMessagesUseCase: sl<GetChatMessagesUseCase>(),
  );
}
