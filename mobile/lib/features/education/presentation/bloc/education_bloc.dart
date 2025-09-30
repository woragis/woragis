import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/education_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

// Events
abstract class EducationEvent extends Equatable {
  const EducationEvent();

  @override
  List<Object?> get props => [];
}

class LoadEducationList extends EducationEvent {
  final int? page;
  final int? limit;
  final String? type;
  final String? institution;
  final bool? visible;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  const LoadEducationList({
    this.page,
    this.limit,
    this.type,
    this.institution,
    this.visible,
    this.search,
    this.sortBy,
    this.sortOrder,
  });

  @override
  List<Object?> get props => [
        page,
        limit,
        type,
        institution,
        visible,
        search,
        sortBy,
        sortOrder,
      ];
}

class GetEducationById extends EducationEvent {
  final String id;

  const GetEducationById(this.id);

  @override
  List<Object> get props => [id];
}

class CreateEducation extends EducationEvent {
  final String title;
  final String institution;
  final String? description;
  final String type;
  final String? degreeLevel;
  final String? fieldOfStudy;
  final DateTime? startDate;
  final DateTime? endDate;
  final DateTime? completionDate;
  final String? grade;
  final int? credits;
  final String? certificateId;
  final String? issuer;
  final String? validityPeriod;
  final String? pdfDocument;
  final String? verificationUrl;
  final List<String>? skills;
  final int order;
  final bool visible;

  const CreateEducation({
    required this.title,
    required this.institution,
    this.description,
    required this.type,
    this.degreeLevel,
    this.fieldOfStudy,
    this.startDate,
    this.endDate,
    this.completionDate,
    this.grade,
    this.credits,
    this.certificateId,
    this.issuer,
    this.validityPeriod,
    this.pdfDocument,
    this.verificationUrl,
    this.skills,
    required this.order,
    required this.visible,
  });

  @override
  List<Object?> get props => [
        title,
        institution,
        description,
        type,
        degreeLevel,
        fieldOfStudy,
        startDate,
        endDate,
        completionDate,
        grade,
        credits,
        certificateId,
        issuer,
        validityPeriod,
        pdfDocument,
        verificationUrl,
        skills,
        order,
        visible,
      ];
}

class UpdateEducation extends EducationEvent {
  final String id;
  final String? title;
  final String? institution;
  final String? description;
  final String? type;
  final String? degreeLevel;
  final String? fieldOfStudy;
  final DateTime? startDate;
  final DateTime? endDate;
  final DateTime? completionDate;
  final String? grade;
  final int? credits;
  final String? certificateId;
  final String? issuer;
  final String? validityPeriod;
  final String? pdfDocument;
  final String? verificationUrl;
  final List<String>? skills;
  final int? order;
  final bool? visible;

  const UpdateEducation({
    required this.id,
    this.title,
    this.institution,
    this.description,
    this.type,
    this.degreeLevel,
    this.fieldOfStudy,
    this.startDate,
    this.endDate,
    this.completionDate,
    this.grade,
    this.credits,
    this.certificateId,
    this.issuer,
    this.validityPeriod,
    this.pdfDocument,
    this.verificationUrl,
    this.skills,
    this.order,
    this.visible,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        institution,
        description,
        type,
        degreeLevel,
        fieldOfStudy,
        startDate,
        endDate,
        completionDate,
        grade,
        credits,
        certificateId,
        issuer,
        validityPeriod,
        pdfDocument,
        verificationUrl,
        skills,
        order,
        visible,
      ];
}

class DeleteEducation extends EducationEvent {
  final String id;

  const DeleteEducation(this.id);

  @override
  List<Object> get props => [id];
}

class UpdateEducationOrder extends EducationEvent {
  final List<Map<String, dynamic>> educationOrders;

  const UpdateEducationOrder(this.educationOrders);

  @override
  List<Object> get props => [educationOrders];
}

class RefreshEducationList extends EducationEvent {
  const RefreshEducationList();
}

class SearchEducation extends EducationEvent {
  final String query;

  const SearchEducation(this.query);

  @override
  List<Object> get props => [query];
}

class FilterEducation extends EducationEvent {
  final String? type;
  final String? institution;
  final bool? visible;

  const FilterEducation({
    this.type,
    this.institution,
    this.visible,
  });

  @override
  List<Object?> get props => [type, institution, visible];
}

class SortEducation extends EducationEvent {
  final String sortBy;
  final String sortOrder;

  const SortEducation({
    required this.sortBy,
    required this.sortOrder,
  });

  @override
  List<Object> get props => [sortBy, sortOrder];
}

// States
abstract class EducationState extends Equatable {
  const EducationState();

  @override
  List<Object?> get props => [];
}

class EducationInitial extends EducationState {}

class EducationLoading extends EducationState {}

class EducationLoaded extends EducationState {
  final List<EducationEntity> educationList;
  final bool hasReachedMax;
  final int currentPage;
  final String? currentSearch;
  final String? currentType;
  final String? currentInstitution;
  final bool? currentVisible;
  final String currentSortBy;
  final String currentSortOrder;

  const EducationLoaded({
    required this.educationList,
    required this.hasReachedMax,
    required this.currentPage,
    this.currentSearch,
    this.currentType,
    this.currentInstitution,
    this.currentVisible,
    required this.currentSortBy,
    required this.currentSortOrder,
  });

  @override
  List<Object?> get props => [
        educationList,
        hasReachedMax,
        currentPage,
        currentSearch,
        currentType,
        currentInstitution,
        currentVisible,
        currentSortBy,
        currentSortOrder,
      ];

  EducationLoaded copyWith({
    List<EducationEntity>? educationList,
    bool? hasReachedMax,
    int? currentPage,
    String? currentSearch,
    String? currentType,
    String? currentInstitution,
    bool? currentVisible,
    String? currentSortBy,
    String? currentSortOrder,
  }) {
    return EducationLoaded(
      educationList: educationList ?? this.educationList,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
      currentPage: currentPage ?? this.currentPage,
      currentSearch: currentSearch ?? this.currentSearch,
      currentType: currentType ?? this.currentType,
      currentInstitution: currentInstitution ?? this.currentInstitution,
      currentVisible: currentVisible ?? this.currentVisible,
      currentSortBy: currentSortBy ?? this.currentSortBy,
      currentSortOrder: currentSortOrder ?? this.currentSortOrder,
    );
  }
}

class EducationDetailLoaded extends EducationState {
  final EducationEntity education;

  const EducationDetailLoaded(this.education);

  @override
  List<Object> get props => [education];
}

class EducationCreated extends EducationState {
  final EducationEntity education;

  const EducationCreated(this.education);

  @override
  List<Object> get props => [education];
}

class EducationUpdated extends EducationState {
  final EducationEntity education;

  const EducationUpdated(this.education);

  @override
  List<Object> get props => [education];
}

class EducationDeleted extends EducationState {
  final String id;

  const EducationDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class EducationOrderUpdated extends EducationState {}

class EducationError extends EducationState {
  final String message;

  const EducationError(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class EducationBloc extends Bloc<EducationEvent, EducationState> {
  final GetEducationListUseCase getEducationListUseCase;
  final GetEducationByIdUseCase getEducationByIdUseCase;
  final CreateEducationUseCase createEducationUseCase;
  final UpdateEducationUseCase updateEducationUseCase;
  final DeleteEducationUseCase deleteEducationUseCase;
  final UpdateEducationOrderUseCase updateEducationOrderUseCase;

  EducationBloc({
    required this.getEducationListUseCase,
    required this.getEducationByIdUseCase,
    required this.createEducationUseCase,
    required this.updateEducationUseCase,
    required this.deleteEducationUseCase,
    required this.updateEducationOrderUseCase,
  }) : super(EducationInitial()) {
    on<LoadEducationList>(_onLoadEducationList);
    on<GetEducationById>(_onGetEducationById);
    on<CreateEducation>(_onCreateEducation);
    on<UpdateEducation>(_onUpdateEducation);
    on<DeleteEducation>(_onDeleteEducation);
    on<UpdateEducationOrder>(_onUpdateEducationOrder);
    on<RefreshEducationList>(_onRefreshEducationList);
    on<SearchEducation>(_onSearchEducation);
    on<FilterEducation>(_onFilterEducation);
    on<SortEducation>(_onSortEducation);
  }

  Future<void> _onLoadEducationList(
    LoadEducationList event,
    Emitter<EducationState> emit,
  ) async {
    if (state is EducationLoaded) {
      final currentState = state as EducationLoaded;
      if (currentState.hasReachedMax) return;
    }

    emit(EducationLoading());

    try {
      final params = GetEducationListParams(
        page: event.page ?? 1,
        limit: event.limit ?? 20,
        type: event.type,
        institution: event.institution,
        visible: event.visible,
        search: event.search,
        sortBy: event.sortBy ?? 'order',
        sortOrder: event.sortOrder ?? 'asc',
      );

      final result = await getEducationListUseCase(params);

      result.fold(
        (failure) => emit(EducationError(failure.message)),
        (educationList) {
          if (state is EducationLoaded) {
            final currentState = state as EducationLoaded;
            emit(EducationLoaded(
              educationList: [...currentState.educationList, ...educationList],
              hasReachedMax: educationList.length < (event.limit ?? 20),
              currentPage: event.page ?? 1,
              currentSearch: event.search,
              currentType: event.type,
              currentInstitution: event.institution,
              currentVisible: event.visible,
              currentSortBy: event.sortBy ?? 'order',
              currentSortOrder: event.sortOrder ?? 'asc',
            ));
          } else {
            emit(EducationLoaded(
              educationList: educationList,
              hasReachedMax: educationList.length < (event.limit ?? 20),
              currentPage: event.page ?? 1,
              currentSearch: event.search,
              currentType: event.type,
              currentInstitution: event.institution,
              currentVisible: event.visible,
              currentSortBy: event.sortBy ?? 'order',
              currentSortOrder: event.sortOrder ?? 'asc',
            ));
          }
        },
      );
    } catch (e) {
      emit(EducationError('Failed to load education list: $e'));
    }
  }

  Future<void> _onGetEducationById(
    GetEducationById event,
    Emitter<EducationState> emit,
  ) async {
    emit(EducationLoading());

    final result = await getEducationByIdUseCase(event.id);

    result.fold(
      (failure) => emit(EducationError(failure.message)),
      (education) => emit(EducationDetailLoaded(education)),
    );
  }

  Future<void> _onCreateEducation(
    CreateEducation event,
    Emitter<EducationState> emit,
  ) async {
    emit(EducationLoading());

    final result = await createEducationUseCase(
      title: event.title,
      institution: event.institution,
      description: event.description,
      type: event.type,
      degreeLevel: event.degreeLevel,
      fieldOfStudy: event.fieldOfStudy,
      startDate: event.startDate,
      endDate: event.endDate,
      completionDate: event.completionDate,
      grade: event.grade,
      credits: event.credits,
      certificateId: event.certificateId,
      issuer: event.issuer,
      validityPeriod: event.validityPeriod,
      pdfDocument: event.pdfDocument,
      verificationUrl: event.verificationUrl,
      skills: event.skills,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(EducationError(failure.message)),
      (education) => emit(EducationCreated(education)),
    );
  }

  Future<void> _onUpdateEducation(
    UpdateEducation event,
    Emitter<EducationState> emit,
  ) async {
    emit(EducationLoading());

    final result = await updateEducationUseCase(
      id: event.id,
      title: event.title,
      institution: event.institution,
      description: event.description,
      type: event.type,
      degreeLevel: event.degreeLevel,
      fieldOfStudy: event.fieldOfStudy,
      startDate: event.startDate,
      endDate: event.endDate,
      completionDate: event.completionDate,
      grade: event.grade,
      credits: event.credits,
      certificateId: event.certificateId,
      issuer: event.issuer,
      validityPeriod: event.validityPeriod,
      pdfDocument: event.pdfDocument,
      verificationUrl: event.verificationUrl,
      skills: event.skills,
      order: event.order,
      visible: event.visible,
    );

    result.fold(
      (failure) => emit(EducationError(failure.message)),
      (education) => emit(EducationUpdated(education)),
    );
  }

  Future<void> _onDeleteEducation(
    DeleteEducation event,
    Emitter<EducationState> emit,
  ) async {
    emit(EducationLoading());

    final result = await deleteEducationUseCase(event.id);

    result.fold(
      (failure) => emit(EducationError(failure.message)),
      (_) => emit(EducationDeleted(event.id)),
    );
  }

  Future<void> _onUpdateEducationOrder(
    UpdateEducationOrder event,
    Emitter<EducationState> emit,
  ) async {
    emit(EducationLoading());

    final result = await updateEducationOrderUseCase(event.educationOrders);

    result.fold(
      (failure) => emit(EducationError(failure.message)),
      (_) => emit(EducationOrderUpdated()),
    );
  }

  Future<void> _onRefreshEducationList(
    RefreshEducationList event,
    Emitter<EducationState> emit,
  ) async {
    if (state is EducationLoaded) {
      final currentState = state as EducationLoaded;
      add(LoadEducationList(
        page: 1,
        limit: 20,
        type: currentState.currentType,
        institution: currentState.currentInstitution,
        visible: currentState.currentVisible,
        search: currentState.currentSearch,
        sortBy: currentState.currentSortBy,
        sortOrder: currentState.currentSortOrder,
      ));
    } else {
      add(const LoadEducationList());
    }
  }

  Future<void> _onSearchEducation(
    SearchEducation event,
    Emitter<EducationState> emit,
  ) async {
    add(LoadEducationList(
      page: 1,
      limit: 20,
      search: event.query.isEmpty ? null : event.query,
    ));
  }

  Future<void> _onFilterEducation(
    FilterEducation event,
    Emitter<EducationState> emit,
  ) async {
    add(LoadEducationList(
      page: 1,
      limit: 20,
      type: event.type,
      institution: event.institution,
      visible: event.visible,
    ));
  }

  Future<void> _onSortEducation(
    SortEducation event,
    Emitter<EducationState> emit,
  ) async {
    add(LoadEducationList(
      page: 1,
      limit: 20,
      sortBy: event.sortBy,
      sortOrder: event.sortOrder,
    ));
  }
}

// Factory function
EducationBloc createEducationBloc() {
  return EducationBloc(
    getEducationListUseCase: sl<GetEducationListUseCase>(),
    getEducationByIdUseCase: sl<GetEducationByIdUseCase>(),
    createEducationUseCase: sl<CreateEducationUseCase>(),
    updateEducationUseCase: sl<UpdateEducationUseCase>(),
    deleteEducationUseCase: sl<DeleteEducationUseCase>(),
    updateEducationOrderUseCase: sl<UpdateEducationOrderUseCase>(),
  );
}