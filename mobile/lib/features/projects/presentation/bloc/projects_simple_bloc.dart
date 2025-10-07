import 'dart:developer';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/project_entity.dart';
import '../../domain/repositories/projects_repository.dart';
import '../../../../core/injection/injection_container.dart';

// Events
abstract class ProjectsSimpleEvent {}

class LoadProjects extends ProjectsSimpleEvent {
  final int? page;
  final int? limit;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final List<String>? technologies;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  LoadProjects({
    this.page,
    this.limit,
    this.featured,
    this.visible,
    this.public,
    this.technologies,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}

class LoadProjectById extends ProjectsSimpleEvent {
  final String id;

  LoadProjectById(this.id);
}

class LoadProjectBySlug extends ProjectsSimpleEvent {
  final String slug;

  LoadProjectBySlug(this.slug);
}

class CreateProject extends ProjectsSimpleEvent {
  final Map<String, dynamic> projectData;

  CreateProject(this.projectData);
}

class UpdateProject extends ProjectsSimpleEvent {
  final String id;
  final Map<String, dynamic> projectData;

  UpdateProject(this.id, this.projectData);
}

class DeleteProject extends ProjectsSimpleEvent {
  final String id;

  DeleteProject(this.id);
}

class UpdateProjectOrder extends ProjectsSimpleEvent {
  final List<Map<String, dynamic>> projectOrders;

  UpdateProjectOrder(this.projectOrders);
}

class IncrementProjectViewCount extends ProjectsSimpleEvent {
  final String id;

  IncrementProjectViewCount(this.id);
}

class IncrementProjectLikeCount extends ProjectsSimpleEvent {
  final String id;

  IncrementProjectLikeCount(this.id);
}

// States
abstract class ProjectsSimpleState {}

class ProjectsSimpleInitial extends ProjectsSimpleState {}

class ProjectsSimpleLoading extends ProjectsSimpleState {}

class ProjectsSimpleLoaded extends ProjectsSimpleState {
  final List<ProjectEntity>? projects;
  final ProjectEntity? project;

  ProjectsSimpleLoaded({
    this.projects,
    this.project,
  });
}

class ProjectsSimpleError extends ProjectsSimpleState {
  final String message;

  ProjectsSimpleError(this.message);
}

// BLoC
class ProjectsSimpleBloc extends Bloc<ProjectsSimpleEvent, ProjectsSimpleState> {
  final ProjectsRepository _projectsRepository = sl<ProjectsRepository>();

  ProjectsSimpleBloc() : super(ProjectsSimpleInitial()) {
    on<LoadProjects>(_onLoadProjects);
    on<LoadProjectById>(_onLoadProjectById);
    on<LoadProjectBySlug>(_onLoadProjectBySlug);
    on<CreateProject>(_onCreateProject);
    on<UpdateProject>(_onUpdateProject);
    on<DeleteProject>(_onDeleteProject);
    on<UpdateProjectOrder>(_onUpdateProjectOrder);
    on<IncrementProjectViewCount>(_onIncrementProjectViewCount);
    on<IncrementProjectLikeCount>(_onIncrementProjectLikeCount);
  }

  Future<void> _onLoadProjects(LoadProjects event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Loading projects');
      
      final result = await _projectsRepository.getProjects(
        page: event.page,
        limit: event.limit,
        featured: event.featured,
        visible: event.visible,
        public: event.public,
        technologies: event.technologies,
        search: event.search,
        sortBy: event.sortBy,
        sortOrder: event.sortOrder,
      );
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (projects) {
          emit(ProjectsSimpleLoaded(projects: projects));
          log('✅ ProjectsSimpleBloc: Projects loaded successfully: ${projects.length} items');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error loading projects: $e');
      emit(ProjectsSimpleError('Failed to load projects: $e'));
    }
  }

  Future<void> _onLoadProjectById(LoadProjectById event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Loading project by ID: ${event.id}');
      
      final result = await _projectsRepository.getProjectById(event.id);
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (project) {
          emit(ProjectsSimpleLoaded(project: project));
          log('✅ ProjectsSimpleBloc: Project loaded successfully: ${project.title}');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error loading project by ID: $e');
      emit(ProjectsSimpleError('Failed to load project: $e'));
    }
  }

  Future<void> _onLoadProjectBySlug(LoadProjectBySlug event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Loading project by slug: ${event.slug}');
      
      final result = await _projectsRepository.getProjectBySlug(event.slug);
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (project) {
          emit(ProjectsSimpleLoaded(project: project));
          log('✅ ProjectsSimpleBloc: Project loaded successfully: ${project.title}');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error loading project by slug: $e');
      emit(ProjectsSimpleError('Failed to load project: $e'));
    }
  }

  Future<void> _onCreateProject(CreateProject event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Creating project');
      
      final result = await _projectsRepository.createProject(
        title: event.projectData['title'] as String,
        slug: event.projectData['slug'] as String,
        description: event.projectData['description'] as String,
        longDescription: event.projectData['longDescription'] as String?,
        content: event.projectData['content'] as String?,
        videoUrl: event.projectData['videoUrl'] as String?,
        image: event.projectData['image'] as String,
        githubUrl: event.projectData['githubUrl'] as String?,
        liveUrl: event.projectData['liveUrl'] as String?,
        featured: event.projectData['featured'] as bool,
        order: event.projectData['order'] as int,
        visible: event.projectData['visible'] as bool,
        public: event.projectData['public'] as bool,
        frameworkIds: event.projectData['frameworkIds'] as List<String>?,
      );
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (project) {
          emit(ProjectsSimpleLoaded(project: project));
          log('✅ ProjectsSimpleBloc: Project created successfully: ${project.title}');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error creating project: $e');
      emit(ProjectsSimpleError('Failed to create project: $e'));
    }
  }

  Future<void> _onUpdateProject(UpdateProject event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Updating project: ${event.id}');
      
      final result = await _projectsRepository.updateProject(
        id: event.id,
        title: event.projectData['title'] as String?,
        slug: event.projectData['slug'] as String?,
        description: event.projectData['description'] as String?,
        longDescription: event.projectData['longDescription'] as String?,
        content: event.projectData['content'] as String?,
        videoUrl: event.projectData['videoUrl'] as String?,
        image: event.projectData['image'] as String?,
        githubUrl: event.projectData['githubUrl'] as String?,
        liveUrl: event.projectData['liveUrl'] as String?,
        featured: event.projectData['featured'] as bool?,
        order: event.projectData['order'] as int?,
        visible: event.projectData['visible'] as bool?,
        public: event.projectData['public'] as bool?,
        frameworkIds: event.projectData['frameworkIds'] as List<String>?,
      );
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (project) {
          emit(ProjectsSimpleLoaded(project: project));
          log('✅ ProjectsSimpleBloc: Project updated successfully: ${project.title}');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error updating project: $e');
      emit(ProjectsSimpleError('Failed to update project: $e'));
    }
  }

  Future<void> _onDeleteProject(DeleteProject event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Deleting project: ${event.id}');
      
      final result = await _projectsRepository.deleteProject(event.id);
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (_) {
          emit(ProjectsSimpleInitial());
          log('✅ ProjectsSimpleBloc: Project deleted successfully');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error deleting project: $e');
      emit(ProjectsSimpleError('Failed to delete project: $e'));
    }
  }

  Future<void> _onUpdateProjectOrder(UpdateProjectOrder event, Emitter<ProjectsSimpleState> emit) async {
    try {
      emit(ProjectsSimpleLoading());
      log('🔍 ProjectsSimpleBloc: Updating project order');
      
      final result = await _projectsRepository.updateProjectOrder(event.projectOrders);
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (_) {
          emit(ProjectsSimpleInitial());
          log('✅ ProjectsSimpleBloc: Project order updated successfully');
        },
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error updating project order: $e');
      emit(ProjectsSimpleError('Failed to update project order: $e'));
    }
  }

  Future<void> _onIncrementProjectViewCount(IncrementProjectViewCount event, Emitter<ProjectsSimpleState> emit) async {
    try {
      log('🔍 ProjectsSimpleBloc: Incrementing view count for project: ${event.id}');
      
      final result = await _projectsRepository.incrementViewCount(event.id);
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (_) => log('✅ ProjectsSimpleBloc: View count incremented successfully'),
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error incrementing view count: $e');
      emit(ProjectsSimpleError('Failed to increment view count: $e'));
    }
  }

  Future<void> _onIncrementProjectLikeCount(IncrementProjectLikeCount event, Emitter<ProjectsSimpleState> emit) async {
    try {
      log('🔍 ProjectsSimpleBloc: Incrementing like count for project: ${event.id}');
      
      final result = await _projectsRepository.incrementLikeCount(event.id);
      
      result.fold(
        (failure) => emit(ProjectsSimpleError(failure.message)),
        (_) => log('✅ ProjectsSimpleBloc: Like count incremented successfully'),
      );
    } catch (e) {
      log('❌ ProjectsSimpleBloc: Error incrementing like count: $e');
      emit(ProjectsSimpleError('Failed to increment like count: $e'));
    }
  }
}
