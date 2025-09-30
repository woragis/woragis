import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/injection/injection_container.dart';
import '../../domain/entities/setting_entity.dart';
import '../../domain/usecases/usecases.dart';

// Events
abstract class SettingsEvent extends Equatable {
  const SettingsEvent();

  @override
  List<Object?> get props => [];
}

class GetSettingsRequested extends SettingsEvent {
  final String? category;
  final bool? isPublic;

  const GetSettingsRequested({
    this.category,
    this.isPublic,
  });

  @override
  List<Object?> get props => [category, isPublic];
}

class GetSettingByKeyRequested extends SettingsEvent {
  final String key;

  const GetSettingByKeyRequested(this.key);

  @override
  List<Object> get props => [key];
}

class CreateSettingRequested extends SettingsEvent {
  final String key;
  final String value;
  final String? description;
  final String? category;
  final bool isPublic;

  const CreateSettingRequested({
    required this.key,
    required this.value,
    this.description,
    this.category,
    required this.isPublic,
  });

  @override
  List<Object?> get props => [key, value, description, category, isPublic];
}

class UpdateSettingRequested extends SettingsEvent {
  final String id;
  final String? key;
  final String? value;
  final String? description;
  final String? category;
  final bool? isPublic;

  const UpdateSettingRequested({
    required this.id,
    this.key,
    this.value,
    this.description,
    this.category,
    this.isPublic,
  });

  @override
  List<Object?> get props => [id, key, value, description, category, isPublic];
}

class UpdateSettingByKeyRequested extends SettingsEvent {
  final String key;
  final String value;

  const UpdateSettingByKeyRequested({
    required this.key,
    required this.value,
  });

  @override
  List<Object> get props => [key, value];
}

class DeleteSettingRequested extends SettingsEvent {
  final String id;

  const DeleteSettingRequested(this.id);

  @override
  List<Object> get props => [id];
}

class UpdateSettingsBulkRequested extends SettingsEvent {
  final Map<String, String> settings;

  const UpdateSettingsBulkRequested(this.settings);

  @override
  List<Object> get props => [settings];
}

// Category-specific events
class GetCoreProfileSettingsRequested extends SettingsEvent {}

class GetSocialMediaSettingsRequested extends SettingsEvent {}

class GetContactSettingsRequested extends SettingsEvent {}

class GetSiteSettingsRequested extends SettingsEvent {}

class UpdateCoreProfileSettingsRequested extends SettingsEvent {
  final Map<String, String> settings;

  const UpdateCoreProfileSettingsRequested(this.settings);

  @override
  List<Object> get props => [settings];
}

class UpdateSocialMediaSettingsRequested extends SettingsEvent {
  final Map<String, String> settings;

  const UpdateSocialMediaSettingsRequested(this.settings);

  @override
  List<Object> get props => [settings];
}

class UpdateContactSettingsRequested extends SettingsEvent {
  final Map<String, String> settings;

  const UpdateContactSettingsRequested(this.settings);

  @override
  List<Object> get props => [settings];
}

class UpdateSiteSettingsRequested extends SettingsEvent {
  final Map<String, String> settings;

  const UpdateSiteSettingsRequested(this.settings);

  @override
  List<Object> get props => [settings];
}

// States
abstract class SettingsState extends Equatable {
  const SettingsState();

  @override
  List<Object?> get props => [];
}

class SettingsInitial extends SettingsState {}

class SettingsLoading extends SettingsState {}

class SettingsError extends SettingsState {
  final String message;

  const SettingsError(this.message);

  @override
  List<Object> get props => [message];
}

class SettingsLoaded extends SettingsState {
  final List<SettingEntity> settings;

  const SettingsLoaded(this.settings);

  @override
  List<Object> get props => [settings];
}

class SettingLoaded extends SettingsState {
  final SettingEntity setting;

  const SettingLoaded(this.setting);

  @override
  List<Object> get props => [setting];
}

class SettingCreated extends SettingsState {
  final SettingEntity setting;

  const SettingCreated(this.setting);

  @override
  List<Object> get props => [setting];
}

class SettingUpdated extends SettingsState {
  final SettingEntity setting;

  const SettingUpdated(this.setting);

  @override
  List<Object> get props => [setting];
}

class SettingDeleted extends SettingsState {
  final String id;

  const SettingDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class SettingsBulkUpdated extends SettingsState {
  final Map<String, String> settings;

  const SettingsBulkUpdated(this.settings);

  @override
  List<Object> get props => [settings];
}

// Category-specific states
class CoreProfileSettingsLoaded extends SettingsState {
  final Map<String, String> settings;

  const CoreProfileSettingsLoaded(this.settings);

  @override
  List<Object> get props => [settings];
}

class CoreProfileSettingsUpdated extends SettingsState {
  final Map<String, String> settings;

  const CoreProfileSettingsUpdated(this.settings);

  @override
  List<Object> get props => [settings];
}

class SocialMediaSettingsLoaded extends SettingsState {
  final Map<String, String> settings;

  const SocialMediaSettingsLoaded(this.settings);

  @override
  List<Object> get props => [settings];
}

class SocialMediaSettingsUpdated extends SettingsState {
  final Map<String, String> settings;

  const SocialMediaSettingsUpdated(this.settings);

  @override
  List<Object> get props => [settings];
}

class ContactSettingsLoaded extends SettingsState {
  final Map<String, String> settings;

  const ContactSettingsLoaded(this.settings);

  @override
  List<Object> get props => [settings];
}

class ContactSettingsUpdated extends SettingsState {
  final Map<String, String> settings;

  const ContactSettingsUpdated(this.settings);

  @override
  List<Object> get props => [settings];
}

class SiteSettingsLoaded extends SettingsState {
  final Map<String, String> settings;

  const SiteSettingsLoaded(this.settings);

  @override
  List<Object> get props => [settings];
}

class SiteSettingsUpdated extends SettingsState {
  final Map<String, String> settings;

  const SiteSettingsUpdated(this.settings);

  @override
  List<Object> get props => [settings];
}

// BLoC
class SettingsBloc extends Bloc<SettingsEvent, SettingsState> {
  final GetSettingsUseCase getSettingsUseCase;
  final GetSettingByKeyUseCase getSettingByKeyUseCase;
  final UpdateSettingUseCase updateSettingUseCase;
  final UpdateSettingByKeyUseCase updateSettingByKeyUseCase;
  final UpdateSettingsBulkUseCase updateSettingsBulkUseCase;
  final GetCoreProfileSettingsUseCase getCoreProfileSettingsUseCase;
  final GetSocialMediaSettingsUseCase getSocialMediaSettingsUseCase;
  final GetContactSettingsUseCase getContactSettingsUseCase;
  final UpdateCoreProfileSettingsUseCase updateCoreProfileSettingsUseCase;
  final UpdateSocialMediaSettingsUseCase updateSocialMediaSettingsUseCase;
  final UpdateContactSettingsUseCase updateContactSettingsUseCase;

  SettingsBloc({
    required this.getSettingsUseCase,
    required this.getSettingByKeyUseCase,
    required this.updateSettingUseCase,
    required this.updateSettingByKeyUseCase,
    required this.updateSettingsBulkUseCase,
    required this.getCoreProfileSettingsUseCase,
    required this.getSocialMediaSettingsUseCase,
    required this.getContactSettingsUseCase,
    required this.updateCoreProfileSettingsUseCase,
    required this.updateSocialMediaSettingsUseCase,
    required this.updateContactSettingsUseCase,
  }) : super(SettingsInitial()) {
    on<GetSettingsRequested>(_onGetSettingsRequested);
    on<GetSettingByKeyRequested>(_onGetSettingByKeyRequested);
    on<CreateSettingRequested>(_onCreateSettingRequested);
    on<UpdateSettingRequested>(_onUpdateSettingRequested);
    on<UpdateSettingByKeyRequested>(_onUpdateSettingByKeyRequested);
    on<DeleteSettingRequested>(_onDeleteSettingRequested);
    on<UpdateSettingsBulkRequested>(_onUpdateSettingsBulkRequested);
    on<GetCoreProfileSettingsRequested>(_onGetCoreProfileSettingsRequested);
    on<GetSocialMediaSettingsRequested>(_onGetSocialMediaSettingsRequested);
    on<GetContactSettingsRequested>(_onGetContactSettingsRequested);
    on<GetSiteSettingsRequested>(_onGetSiteSettingsRequested);
    on<UpdateCoreProfileSettingsRequested>(_onUpdateCoreProfileSettingsRequested);
    on<UpdateSocialMediaSettingsRequested>(_onUpdateSocialMediaSettingsRequested);
    on<UpdateContactSettingsRequested>(_onUpdateContactSettingsRequested);
    on<UpdateSiteSettingsRequested>(_onUpdateSiteSettingsRequested);
  }

  Future<void> _onGetSettingsRequested(
    GetSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await getSettingsUseCase(GetSettingsParams(
      category: event.category,
      isPublic: event.isPublic,
    ));

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (settings) => emit(SettingsLoaded(settings)),
    );
  }

  Future<void> _onGetSettingByKeyRequested(
    GetSettingByKeyRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await getSettingByKeyUseCase(event.key);

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (setting) => emit(SettingLoaded(setting)),
    );
  }

  Future<void> _onCreateSettingRequested(
    CreateSettingRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    // CreateSettingUseCase not added yet - typically settings are managed via bulk updates
    emit(SettingsError('Create setting via bulk update instead'));
  }

  Future<void> _onUpdateSettingRequested(
    UpdateSettingRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await updateSettingUseCase(
      id: event.id,
      key: event.key,
      value: event.value,
      description: event.description,
      category: event.category,
      isPublic: event.isPublic,
    );

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (setting) => emit(SettingUpdated(setting)),
    );
  }

  Future<void> _onUpdateSettingByKeyRequested(
    UpdateSettingByKeyRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await updateSettingByKeyUseCase(
      key: event.key,
      value: event.value,
    );

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (setting) => emit(SettingUpdated(setting)),
    );
  }

  Future<void> _onDeleteSettingRequested(
    DeleteSettingRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    // Delete not typically used for settings - settings are usually just updated
    emit(SettingsError('Delete setting not supported'));
  }

  Future<void> _onUpdateSettingsBulkRequested(
    UpdateSettingsBulkRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await updateSettingsBulkUseCase(event.settings);

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (_) => emit(SettingsBulkUpdated(event.settings)),
    );
  }

  // Category-specific handlers
  Future<void> _onGetCoreProfileSettingsRequested(
    GetCoreProfileSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await getCoreProfileSettingsUseCase();

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (settings) => emit(CoreProfileSettingsLoaded(settings)),
    );
  }

  Future<void> _onGetSocialMediaSettingsRequested(
    GetSocialMediaSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await getSocialMediaSettingsUseCase();

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (settings) => emit(SocialMediaSettingsLoaded(settings)),
    );
  }

  Future<void> _onGetContactSettingsRequested(
    GetContactSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await getContactSettingsUseCase();

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (settings) => emit(ContactSettingsLoaded(settings)),
    );
  }

  Future<void> _onGetSiteSettingsRequested(
    GetSiteSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    // GetSiteSettings not in use cases yet
    emit(SiteSettingsLoaded({}));
  }

  Future<void> _onUpdateCoreProfileSettingsRequested(
    UpdateCoreProfileSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await updateCoreProfileSettingsUseCase(event.settings);

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (_) => emit(CoreProfileSettingsUpdated(event.settings)),
    );
  }

  Future<void> _onUpdateSocialMediaSettingsRequested(
    UpdateSocialMediaSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await updateSocialMediaSettingsUseCase(event.settings);

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (_) => emit(SocialMediaSettingsUpdated(event.settings)),
    );
  }

  Future<void> _onUpdateContactSettingsRequested(
    UpdateContactSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    final result = await updateContactSettingsUseCase(event.settings);

    result.fold(
      (failure) => emit(SettingsError(failure.message)),
      (_) => emit(ContactSettingsUpdated(event.settings)),
    );
  }

  Future<void> _onUpdateSiteSettingsRequested(
    UpdateSiteSettingsRequested event,
    Emitter<SettingsState> emit,
  ) async {
    emit(SettingsLoading());

    // UpdateSiteSettings not in use cases yet
    emit(SiteSettingsUpdated(event.settings));
  }
}

// Factory function for creating SettingsBloc with dependency injection
SettingsBloc createSettingsBloc() {
  return SettingsBloc(
    getSettingsUseCase: sl<GetSettingsUseCase>(),
    getSettingByKeyUseCase: sl<GetSettingByKeyUseCase>(),
    updateSettingUseCase: sl<UpdateSettingUseCase>(),
    updateSettingByKeyUseCase: sl<UpdateSettingByKeyUseCase>(),
    updateSettingsBulkUseCase: sl<UpdateSettingsBulkUseCase>(),
    getCoreProfileSettingsUseCase: sl<GetCoreProfileSettingsUseCase>(),
    getSocialMediaSettingsUseCase: sl<GetSocialMediaSettingsUseCase>(),
    getContactSettingsUseCase: sl<GetContactSettingsUseCase>(),
    updateCoreProfileSettingsUseCase: sl<UpdateCoreProfileSettingsUseCase>(),
    updateSocialMediaSettingsUseCase: sl<UpdateSocialMediaSettingsUseCase>(),
    updateContactSettingsUseCase: sl<UpdateContactSettingsUseCase>(),
  );
}
