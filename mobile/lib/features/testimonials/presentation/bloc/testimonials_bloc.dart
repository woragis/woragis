import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/injection/injection_container.dart';
import '../../domain/entities/testimonial_entity.dart';
import '../../domain/usecases/usecases.dart';

// Events
abstract class TestimonialsEvent extends Equatable {
  const TestimonialsEvent();

  @override
  List<Object?> get props => [];
}

class GetTestimonialsRequested extends TestimonialsEvent {
  final int? page;
  final int? limit;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final int? rating;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  const GetTestimonialsRequested({
    this.page,
    this.limit,
    this.featured,
    this.visible,
    this.public,
    this.rating,
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
        rating,
        search,
        sortBy,
        sortOrder,
      ];
}

class GetTestimonialByIdRequested extends TestimonialsEvent {
  final String id;

  const GetTestimonialByIdRequested(this.id);

  @override
  List<Object> get props => [id];
}

class CreateTestimonialRequested extends TestimonialsEvent {
  final String name;
  final String position;
  final String company;
  final String content;
  final String? avatar;
  final int rating;
  final bool featured;
  final bool visible;
  final bool public;
  final int order;

  const CreateTestimonialRequested({
    required this.name,
    required this.position,
    required this.company,
    required this.content,
    this.avatar,
    required this.rating,
    required this.featured,
    required this.visible,
    required this.public,
    required this.order,
  });

  @override
  List<Object?> get props => [
        name,
        position,
        company,
        content,
        avatar,
        rating,
        featured,
        visible,
        public,
        order,
      ];
}

class UpdateTestimonialRequested extends TestimonialsEvent {
  final String id;
  final String? name;
  final String? position;
  final String? company;
  final String? content;
  final String? avatar;
  final int? rating;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final int? order;

  const UpdateTestimonialRequested({
    required this.id,
    this.name,
    this.position,
    this.company,
    this.content,
    this.avatar,
    this.rating,
    this.featured,
    this.visible,
    this.public,
    this.order,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        position,
        company,
        content,
        avatar,
        rating,
        featured,
        visible,
        public,
        order,
      ];
}

class DeleteTestimonialRequested extends TestimonialsEvent {
  final String id;

  const DeleteTestimonialRequested(this.id);

  @override
  List<Object> get props => [id];
}

class UpdateTestimonialOrderRequested extends TestimonialsEvent {
  final List<Map<String, dynamic>> testimonialOrders;

  const UpdateTestimonialOrderRequested(this.testimonialOrders);

  @override
  List<Object> get props => [testimonialOrders];
}

class IncrementViewCountRequested extends TestimonialsEvent {
  final String testimonialId;

  const IncrementViewCountRequested(this.testimonialId);

  @override
  List<Object> get props => [testimonialId];
}

class IncrementLikeCountRequested extends TestimonialsEvent {
  final String testimonialId;

  const IncrementLikeCountRequested(this.testimonialId);

  @override
  List<Object> get props => [testimonialId];
}

// States
abstract class TestimonialsState extends Equatable {
  const TestimonialsState();

  @override
  List<Object?> get props => [];
}

class TestimonialsInitial extends TestimonialsState {}

class TestimonialsLoading extends TestimonialsState {}

class TestimonialsError extends TestimonialsState {
  final String message;

  const TestimonialsError(this.message);

  @override
  List<Object> get props => [message];
}

class TestimonialsLoaded extends TestimonialsState {
  final List<TestimonialEntity> testimonials;

  const TestimonialsLoaded(this.testimonials);

  @override
  List<Object> get props => [testimonials];
}

class TestimonialLoaded extends TestimonialsState {
  final TestimonialEntity testimonial;

  const TestimonialLoaded(this.testimonial);

  @override
  List<Object> get props => [testimonial];
}

class TestimonialCreated extends TestimonialsState {
  final TestimonialEntity testimonial;

  const TestimonialCreated(this.testimonial);

  @override
  List<Object> get props => [testimonial];
}

class TestimonialUpdated extends TestimonialsState {
  final TestimonialEntity testimonial;

  const TestimonialUpdated(this.testimonial);

  @override
  List<Object> get props => [testimonial];
}

class TestimonialDeleted extends TestimonialsState {
  final String id;

  const TestimonialDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class TestimonialOrderUpdated extends TestimonialsState {
  final List<Map<String, dynamic>> testimonialOrders;

  const TestimonialOrderUpdated(this.testimonialOrders);

  @override
  List<Object> get props => [testimonialOrders];
}

class ViewCountIncremented extends TestimonialsState {
  final String testimonialId;

  const ViewCountIncremented(this.testimonialId);

  @override
  List<Object> get props => [testimonialId];
}

class LikeCountIncremented extends TestimonialsState {
  final String testimonialId;

  const LikeCountIncremented(this.testimonialId);

  @override
  List<Object> get props => [testimonialId];
}

// BLoC
class TestimonialsBloc extends Bloc<TestimonialsEvent, TestimonialsState> {
  final GetTestimonialsUseCase getTestimonialsUseCase;
  final GetTestimonialByIdUseCase getTestimonialByIdUseCase;
  final CreateTestimonialUseCase createTestimonialUseCase;
  final UpdateTestimonialUseCase updateTestimonialUseCase;
  final DeleteTestimonialUseCase deleteTestimonialUseCase;
  final UpdateTestimonialOrderUseCase updateTestimonialOrderUseCase;
  final IncrementTestimonialViewCountUseCase incrementViewCountUseCase;
  final IncrementTestimonialLikeCountUseCase incrementLikeCountUseCase;

  TestimonialsBloc({
    required this.getTestimonialsUseCase,
    required this.getTestimonialByIdUseCase,
    required this.createTestimonialUseCase,
    required this.updateTestimonialUseCase,
    required this.deleteTestimonialUseCase,
    required this.updateTestimonialOrderUseCase,
    required this.incrementViewCountUseCase,
    required this.incrementLikeCountUseCase,
  }) : super(TestimonialsInitial()) {
    on<GetTestimonialsRequested>(_onGetTestimonialsRequested);
    on<GetTestimonialByIdRequested>(_onGetTestimonialByIdRequested);
    on<CreateTestimonialRequested>(_onCreateTestimonialRequested);
    on<UpdateTestimonialRequested>(_onUpdateTestimonialRequested);
    on<DeleteTestimonialRequested>(_onDeleteTestimonialRequested);
    on<UpdateTestimonialOrderRequested>(_onUpdateTestimonialOrderRequested);
    on<IncrementViewCountRequested>(_onIncrementViewCountRequested);
    on<IncrementLikeCountRequested>(_onIncrementLikeCountRequested);
  }

  Future<void> _onGetTestimonialsRequested(
    GetTestimonialsRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    emit(TestimonialsLoading());

    final result = await getTestimonialsUseCase(GetTestimonialsParams(
      page: event.page,
      limit: event.limit,
      featured: event.featured,
      visible: event.visible,
      public: event.public,
      rating: event.rating,
      search: event.search,
      sortBy: event.sortBy,
      sortOrder: event.sortOrder,
    ));

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (testimonials) => emit(TestimonialsLoaded(testimonials)),
    );
  }

  Future<void> _onGetTestimonialByIdRequested(
    GetTestimonialByIdRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    emit(TestimonialsLoading());

    final result = await getTestimonialByIdUseCase(event.id);

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (testimonial) => emit(TestimonialLoaded(testimonial)),
    );
  }

  Future<void> _onCreateTestimonialRequested(
    CreateTestimonialRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    emit(TestimonialsLoading());

    final result = await createTestimonialUseCase(
      name: event.name,
      position: event.position,
      company: event.company,
      content: event.content,
      avatar: event.avatar,
      rating: event.rating,
      featured: event.featured,
      order: event.order,
      visible: event.visible,
      public: event.public,
    );

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (testimonial) => emit(TestimonialCreated(testimonial)),
    );
  }

  Future<void> _onUpdateTestimonialRequested(
    UpdateTestimonialRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    emit(TestimonialsLoading());

    final result = await updateTestimonialUseCase(
      id: event.id,
      name: event.name,
      position: event.position,
      company: event.company,
      content: event.content,
      avatar: event.avatar,
      rating: event.rating,
      featured: event.featured,
      order: event.order,
      visible: event.visible,
      public: event.public,
    );

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (testimonial) => emit(TestimonialUpdated(testimonial)),
    );
  }

  Future<void> _onDeleteTestimonialRequested(
    DeleteTestimonialRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    emit(TestimonialsLoading());

    final result = await deleteTestimonialUseCase(event.id);

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (_) => emit(TestimonialDeleted(event.id)),
    );
  }

  Future<void> _onUpdateTestimonialOrderRequested(
    UpdateTestimonialOrderRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    emit(TestimonialsLoading());

    final result = await updateTestimonialOrderUseCase(event.testimonialOrders);

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (_) => emit(TestimonialOrderUpdated(event.testimonialOrders)),
    );
  }

  Future<void> _onIncrementViewCountRequested(
    IncrementViewCountRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    final result = await incrementViewCountUseCase(event.testimonialId);

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (_) => emit(ViewCountIncremented(event.testimonialId)),
    );
  }

  Future<void> _onIncrementLikeCountRequested(
    IncrementLikeCountRequested event,
    Emitter<TestimonialsState> emit,
  ) async {
    final result = await incrementLikeCountUseCase(event.testimonialId);

    result.fold(
      (failure) => emit(TestimonialsError(failure.message)),
      (_) => emit(LikeCountIncremented(event.testimonialId)),
    );
  }
}

// Factory function for creating TestimonialsBloc with dependency injection
TestimonialsBloc createTestimonialsBloc() {
  return TestimonialsBloc(
    getTestimonialsUseCase: sl<GetTestimonialsUseCase>(),
    getTestimonialByIdUseCase: sl<GetTestimonialByIdUseCase>(),
    createTestimonialUseCase: sl<CreateTestimonialUseCase>(),
    updateTestimonialUseCase: sl<UpdateTestimonialUseCase>(),
    deleteTestimonialUseCase: sl<DeleteTestimonialUseCase>(),
    updateTestimonialOrderUseCase: sl<UpdateTestimonialOrderUseCase>(),
    incrementViewCountUseCase: sl<IncrementTestimonialViewCountUseCase>(),
    incrementLikeCountUseCase: sl<IncrementTestimonialLikeCountUseCase>(),
  );
}
