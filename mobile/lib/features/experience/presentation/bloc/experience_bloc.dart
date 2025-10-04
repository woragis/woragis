import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/injection/injection_container.dart';
import '../../domain/entities/experience_entity.dart';
import '../../domain/usecases/usecases.dart';

// Events
abstract class ExperienceEvent extends Equatable {
  const ExperienceEvent();

  @override
  List<Object?> get props => [];
}

class GetExperienceListRequested extends ExperienceEvent {
  final int? page;
  final int? limit;
  final String? company;
  final bool? visible;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  const GetExperienceListRequested({
    this.page,
    this.limit,
    this.company,
    this.visible,
    this.search,
    this.sortBy,
    this.sortOrder,
  });

  @override
  List<Object?> get props => [page, limit, company, visible, search, sortBy, sortOrder];
}

class GetExperienceByIdRequested extends ExperienceEvent {
  final String id;

  const GetExperienceByIdRequested(this.id);

  @override
  List<Object> get props => [id];
}

class CreateExperienceRequested extends ExperienceEvent {
  final String title;
  final String company;
  final String period;
  final String location;
  final String description;
  final List<String> achievements;
  final List<String> technologies;
  final String icon;
  final int order;
  final bool visible;

  const CreateExperienceRequested({
    required this.title,
    required this.company,
    required this.period,
    required this.location,
    required this.description,
    required this.achievements,
    required this.technologies,
    required this.icon,
    required this.order,
    required this.visible,
  });

  @override
  List<Object> get props => [
        title,
        company,
        period,
        location,
        description,
        achievements,
        technologies,
        icon,
        order,
        visible,
      ];
}

class UpdateExperienceRequested extends ExperienceEvent {
  final String id;
  final String? title;
  final String? company;
  final String? period;
  final String? location;
  final String? description;
  final List<String>? achievements;
  final List<String>? technologies;
  final String? icon;
  final int? order;
  final bool? visible;

  const UpdateExperienceRequested({
    required this.id,
    this.title,
    this.company,
    this.period,
    this.location,
    this.description,
    this.achievements,
    this.technologies,
    this.icon,
    this.order,
    this.visible,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        company,
        period,
        location,
        description,
        achievements,
        technologies,
        icon,
        order,
        visible,
      ];
}

class DeleteExperienceRequested extends ExperienceEvent {
  final String id;

  const DeleteExperienceRequested(this.id);

  @override
  List<Object> get props => [id];
}

class UpdateExperienceOrderRequested extends ExperienceEvent {
  final List<Map<String, dynamic>> experienceOrders;

  const UpdateExperienceOrderRequested(this.experienceOrders);

  @override
  List<Object> get props => [experienceOrders];
}

// States
abstract class ExperienceState extends Equatable {
  const ExperienceState();

  @override
  List<Object?> get props => [];
}

class ExperienceInitial extends ExperienceState {}

class ExperienceLoading extends ExperienceState {}

class ExperienceError extends ExperienceState {
  final String message;

  const ExperienceError(this.message);

  @override
  List<Object> get props => [message];
}

class ExperienceListLoaded extends ExperienceState {
  final List<ExperienceEntity> experiences;

  const ExperienceListLoaded(this.experiences);

  @override
  List<Object> get props => [experiences];
}

class ExperienceLoaded extends ExperienceState {
  final ExperienceEntity experience;

  const ExperienceLoaded(this.experience);

  @override
  List<Object> get props => [experience];
}

class ExperienceCreated extends ExperienceState {
  final ExperienceEntity experience;

  const ExperienceCreated(this.experience);

  @override
  List<Object> get props => [experience];
}

class ExperienceUpdated extends ExperienceState {
  final ExperienceEntity experience;

  const ExperienceUpdated(this.experience);

  @override
  List<Object> get props => [experience];
}

class ExperienceDeleted extends ExperienceState {
  final String id;

  const ExperienceDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class ExperienceOrderUpdated extends ExperienceState {
  final List<Map<String, dynamic>> experienceOrders;

  const ExperienceOrderUpdated(this.experienceOrders);

  @override
  List<Object> get props => [experienceOrders];
}

// BLoC
class ExperienceBloc extends Bloc<ExperienceEvent, ExperienceState> {
  final GetExperienceListUseCase getExperienceListUseCase;
  final GetExperienceByIdUseCase getExperienceByIdUseCase;
  final CreateExperienceUseCase createExperienceUseCase;
  final UpdateExperienceUseCase updateExperienceUseCase;
  final DeleteExperienceUseCase deleteExperienceUseCase;
  final UpdateExperienceOrderUseCase updateExperienceOrderUseCase;

  ExperienceBloc({
    required this.getExperienceListUseCase,
    required this.getExperienceByIdUseCase,
    required this.createExperienceUseCase,
    required this.updateExperienceUseCase,
    required this.deleteExperienceUseCase,
    required this.updateExperienceOrderUseCase,
  }) : super(ExperienceInitial()) {
    on<GetExperienceListRequested>(_onGetExperienceListRequested);
    on<GetExperienceByIdRequested>(_onGetExperienceByIdRequested);
    on<CreateExperienceRequested>(_onCreateExperienceRequested);
    on<UpdateExperienceRequested>(_onUpdateExperienceRequested);
    on<DeleteExperienceRequested>(_onDeleteExperienceRequested);
    on<UpdateExperienceOrderRequested>(_onUpdateExperienceOrderRequested);
  }

  Future<void> _onGetExperienceListRequested(
    GetExperienceListRequested event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());

    final result = await getExperienceListUseCase(GetExperienceListParams(
      page: event.page,
      limit: event.limit,
      company: event.company,
      visible: event.visible,
      search: event.search,
      sortBy: event.sortBy,
      sortOrder: event.sortOrder,
    ));

    result.fold(
      (failure) => emit(ExperienceError(failure.message)),
      (experiences) => emit(ExperienceListLoaded(experiences)),
    );
  }

  Future<void> _onGetExperienceByIdRequested(
    GetExperienceByIdRequested event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());

    final result = await getExperienceByIdUseCase(event.id);

    result.fold(
      (failure) => emit(ExperienceError(failure.message)),
      (experience) => emit(ExperienceLoaded(experience)),
    );
  }

  Future<void> _onCreateExperienceRequested(
    CreateExperienceRequested event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());

    final result = await createExperienceUseCase(
      title: event.title,
      company: event.company,
      period: event.period,
      location: event.location,
      description: event.description,
      achievements: event.achievements,
      technologies: event.technologies,
      icon: event.icon,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(ExperienceError(failure.message)),
      (experience) => emit(ExperienceCreated(experience)),
    );
  }

  Future<void> _onUpdateExperienceRequested(
    UpdateExperienceRequested event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());

    final result = await updateExperienceUseCase(
      id: event.id,
      title: event.title,
      company: event.company,
      period: event.period,
      location: event.location,
      description: event.description,
      achievements: event.achievements,
      technologies: event.technologies,
      icon: event.icon,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(ExperienceError(failure.message)),
      (experience) => emit(ExperienceUpdated(experience)),
    );
  }

  Future<void> _onDeleteExperienceRequested(
    DeleteExperienceRequested event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());

    final result = await deleteExperienceUseCase(event.id);

    result.fold(
      (failure) => emit(ExperienceError(failure.message)),
      (_) => emit(ExperienceDeleted(event.id)),
    );
  }

  Future<void> _onUpdateExperienceOrderRequested(
    UpdateExperienceOrderRequested event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());

    final result = await updateExperienceOrderUseCase(event.experienceOrders);

    result.fold(
      (failure) => emit(ExperienceError(failure.message)),
      (_) => emit(ExperienceOrderUpdated(event.experienceOrders)),
    );
  }
}

// Factory function for creating ExperienceBloc with dependency injection
ExperienceBloc createExperienceBloc() {
  return ExperienceBloc(
    getExperienceListUseCase: sl<GetExperienceListUseCase>(),
    getExperienceByIdUseCase: sl<GetExperienceByIdUseCase>(),
    createExperienceUseCase: sl<CreateExperienceUseCase>(),
    updateExperienceUseCase: sl<UpdateExperienceUseCase>(),
    deleteExperienceUseCase: sl<DeleteExperienceUseCase>(),
    updateExperienceOrderUseCase: sl<UpdateExperienceOrderUseCase>(),
  );
}
