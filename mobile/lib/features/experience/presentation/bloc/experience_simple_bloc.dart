import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/injection/injection_container.dart';
import '../../domain/entities/experience_entity.dart';
import '../../domain/repositories/experience_repository.dart';

// Events
abstract class ExperienceEvent {}

class LoadExperiences extends ExperienceEvent {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? company;
  final String? search;

  LoadExperiences({
    this.page,
    this.limit,
    this.visible,
    this.company,
    this.search,
  });
}

class LoadExperienceById extends ExperienceEvent {
  final String id;

  LoadExperienceById(this.id);
}

class CreateExperience extends ExperienceEvent {
  final String title;
  final String company;
  final String period;
  final String location;
  final String description;
  final List<String>? achievements;
  final List<String>? technologies;
  final String? icon;
  final int order;
  final bool visible;

  CreateExperience({
    required this.title,
    required this.company,
    required this.period,
    required this.location,
    required this.description,
    this.achievements,
    this.technologies,
    this.icon,
    required this.order,
    required this.visible,
  });
}

class UpdateExperience extends ExperienceEvent {
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

  UpdateExperience({
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
}

class DeleteExperience extends ExperienceEvent {
  final String id;

  DeleteExperience(this.id);
}

// States
abstract class ExperienceState {}

class ExperienceInitial extends ExperienceState {}

class ExperienceLoading extends ExperienceState {}

class ExperienceLoaded extends ExperienceState {
  final List<ExperienceEntity> experiences;

  ExperienceLoaded(this.experiences);
}

class ExperienceDetailLoaded extends ExperienceState {
  final ExperienceEntity experience;

  ExperienceDetailLoaded(this.experience);
}

class ExperienceError extends ExperienceState {
  final String message;

  ExperienceError(this.message);
}

class ExperienceSuccess extends ExperienceState {
  final String message;

  ExperienceSuccess(this.message);
}

// BLoC
class ExperienceSimpleBloc extends Bloc<ExperienceEvent, ExperienceState> {
  final ExperienceRepository _experienceRepository = sl<ExperienceRepository>();

  ExperienceSimpleBloc() : super(ExperienceInitial()) {
    on<LoadExperiences>(_onLoadExperiences);
    on<LoadExperienceById>(_onLoadExperienceById);
    on<CreateExperience>(_onCreateExperience);
    on<UpdateExperience>(_onUpdateExperience);
    on<DeleteExperience>(_onDeleteExperience);
  }

  Future<void> _onLoadExperiences(
    LoadExperiences event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());
    try {
      final result = await _experienceRepository.getExperienceList(
        page: event.page,
        limit: event.limit,
        visible: event.visible,
        company: event.company,
        search: event.search,
      );
      
      result.fold(
        (failure) => emit(ExperienceError(failure.message)),
        (experiences) => emit(ExperienceLoaded(experiences)),
      );
    } catch (e) {
      emit(ExperienceError('Failed to load experiences: ${e.toString()}'));
    }
  }

  Future<void> _onLoadExperienceById(
    LoadExperienceById event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());
    try {
      final result = await _experienceRepository.getExperienceById(event.id);
      
      result.fold(
        (failure) => emit(ExperienceError(failure.message)),
        (experience) => emit(ExperienceDetailLoaded(experience)),
      );
    } catch (e) {
      emit(ExperienceError('Failed to load experience: ${e.toString()}'));
    }
  }

  Future<void> _onCreateExperience(
    CreateExperience event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());
    try {
      final result = await _experienceRepository.createExperience(
        title: event.title,
        company: event.company,
        period: event.period,
        location: event.location,
        description: event.description,
        achievements: event.achievements ?? [],
        technologies: event.technologies ?? [],
        icon: event.icon ?? '💼',
        order: event.order,
        visible: event.visible,
      );
      
      result.fold(
        (failure) => emit(ExperienceError(failure.message)),
        (experience) => emit(ExperienceSuccess('Experience created successfully')),
      );
    } catch (e) {
      emit(ExperienceError('Failed to create experience: ${e.toString()}'));
    }
  }

  Future<void> _onUpdateExperience(
    UpdateExperience event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());
    try {
      final result = await _experienceRepository.updateExperience(
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
        (experience) => emit(ExperienceSuccess('Experience updated successfully')),
      );
    } catch (e) {
      emit(ExperienceError('Failed to update experience: ${e.toString()}'));
    }
  }

  Future<void> _onDeleteExperience(
    DeleteExperience event,
    Emitter<ExperienceState> emit,
  ) async {
    emit(ExperienceLoading());
    try {
      final result = await _experienceRepository.deleteExperience(event.id);
      
      result.fold(
        (failure) => emit(ExperienceError(failure.message)),
        (_) => emit(ExperienceSuccess('Experience deleted successfully')),
      );
    } catch (e) {
      emit(ExperienceError('Failed to delete experience: ${e.toString()}'));
    }
  }
}
