import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/injection/injection_container.dart';
import '../../domain/entities/blog_post_entity.dart';
import '../../domain/entities/blog_tag_entity.dart';
import '../../domain/usecases/usecases.dart';

// Events
abstract class BlogEvent extends Equatable {
  const BlogEvent();

  @override
  List<Object?> get props => [];
}

// Blog Posts Events
class GetBlogPostsRequested extends BlogEvent {
  final int? page;
  final int? limit;
  final bool? published;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  const GetBlogPostsRequested({
    this.page,
    this.limit,
    this.published,
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
        published,
        featured,
        visible,
        public,
        search,
        sortBy,
        sortOrder,
      ];
}

class GetBlogPostByIdRequested extends BlogEvent {
  final String id;

  const GetBlogPostByIdRequested(this.id);

  @override
  List<Object> get props => [id];
}

class CreateBlogPostRequested extends BlogEvent {
  final String title;
  final String slug;
  final String excerpt;
  final String content;
  final String? featuredImage;
  final int? readingTime;
  final bool featured;
  final bool published;
  final bool visible;
  final bool public;
  final int order;

  const CreateBlogPostRequested({
    required this.title,
    required this.slug,
    required this.excerpt,
    required this.content,
    this.featuredImage,
    this.readingTime,
    required this.featured,
    required this.published,
    required this.visible,
    required this.public,
    required this.order,
  });

  @override
  List<Object?> get props => [
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        readingTime,
        featured,
        published,
        visible,
        public,
        order,
      ];
}

class UpdateBlogPostRequested extends BlogEvent {
  final String id;
  final String? title;
  final String? slug;
  final String? excerpt;
  final String? content;
  final String? featuredImage;
  final int? readingTime;
  final bool? featured;
  final bool? published;
  final bool? visible;
  final bool? public;
  final int? order;

  const UpdateBlogPostRequested({
    required this.id,
    this.title,
    this.slug,
    this.excerpt,
    this.content,
    this.featuredImage,
    this.readingTime,
    this.featured,
    this.published,
    this.visible,
    this.public,
    this.order,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        readingTime,
        featured,
        published,
        visible,
        public,
        order,
      ];
}

class DeleteBlogPostRequested extends BlogEvent {
  final String id;

  const DeleteBlogPostRequested(this.id);

  @override
  List<Object> get props => [id];
}

class IncrementViewCountRequested extends BlogEvent {
  final String postId;

  const IncrementViewCountRequested(this.postId);

  @override
  List<Object> get props => [postId];
}

class IncrementLikeCountRequested extends BlogEvent {
  final String postId;

  const IncrementLikeCountRequested(this.postId);

  @override
  List<Object> get props => [postId];
}

// Blog Tags Events
class GetBlogTagsRequested extends BlogEvent {
  final int? page;
  final int? limit;
  final bool? visible;
  final String? search;

  const GetBlogTagsRequested({
    this.page,
    this.limit,
    this.visible,
    this.search,
  });

  @override
  List<Object?> get props => [page, limit, visible, search];
}

class CreateBlogTagRequested extends BlogEvent {
  final String name;
  final String slug;
  final String? description;
  final String? color;

  const CreateBlogTagRequested({
    required this.name,
    required this.slug,
    this.description,
    this.color,
  });

  @override
  List<Object?> get props => [name, slug, description, color];
}

class UpdateBlogTagRequested extends BlogEvent {
  final String id;
  final String? name;
  final String? slug;
  final String? description;
  final String? color;

  const UpdateBlogTagRequested({
    required this.id,
    this.name,
    this.slug,
    this.description,
    this.color,
  });

  @override
  List<Object?> get props => [id, name, slug, description, color];
}

class DeleteBlogTagRequested extends BlogEvent {
  final String id;

  const DeleteBlogTagRequested(this.id);

  @override
  List<Object> get props => [id];
}

// States
abstract class BlogState extends Equatable {
  const BlogState();

  @override
  List<Object?> get props => [];
}

class BlogInitial extends BlogState {}

class BlogLoading extends BlogState {}

class BlogError extends BlogState {
  final String message;

  const BlogError(this.message);

  @override
  List<Object> get props => [message];
}

// Blog Posts States
class BlogPostsLoaded extends BlogState {
  final List<BlogPostEntity> posts;

  const BlogPostsLoaded(this.posts);

  @override
  List<Object> get props => [posts];
}

class BlogPostLoaded extends BlogState {
  final BlogPostEntity post;

  const BlogPostLoaded(this.post);

  @override
  List<Object> get props => [post];
}

class BlogPostCreated extends BlogState {
  final BlogPostEntity post;

  const BlogPostCreated(this.post);

  @override
  List<Object> get props => [post];
}

class BlogPostUpdated extends BlogState {
  final BlogPostEntity post;

  const BlogPostUpdated(this.post);

  @override
  List<Object> get props => [post];
}

class BlogPostDeleted extends BlogState {
  final String id;

  const BlogPostDeleted(this.id);

  @override
  List<Object> get props => [id];
}

class ViewCountIncremented extends BlogState {
  final String postId;

  const ViewCountIncremented(this.postId);

  @override
  List<Object> get props => [postId];
}

class LikeCountIncremented extends BlogState {
  final String postId;

  const LikeCountIncremented(this.postId);

  @override
  List<Object> get props => [postId];
}

// Blog Tags States
class BlogTagsLoaded extends BlogState {
  final List<BlogTagEntity> tags;

  const BlogTagsLoaded(this.tags);

  @override
  List<Object> get props => [tags];
}

class BlogTagCreated extends BlogState {
  final BlogTagEntity tag;

  const BlogTagCreated(this.tag);

  @override
  List<Object> get props => [tag];
}

class BlogTagUpdated extends BlogState {
  final BlogTagEntity tag;

  const BlogTagUpdated(this.tag);

  @override
  List<Object> get props => [tag];
}

class BlogTagDeleted extends BlogState {
  final String id;

  const BlogTagDeleted(this.id);

  @override
  List<Object> get props => [id];
}

// BLoC
class BlogBloc extends Bloc<BlogEvent, BlogState> {
  final GetBlogPostsUseCase getBlogPostsUseCase;

  BlogBloc({
    required this.getBlogPostsUseCase,
  }) : super(BlogInitial()) {
    // Blog Posts Events
    on<GetBlogPostsRequested>(_onGetBlogPostsRequested);
    on<GetBlogPostByIdRequested>(_onGetBlogPostByIdRequested);
    on<CreateBlogPostRequested>(_onCreateBlogPostRequested);
    on<UpdateBlogPostRequested>(_onUpdateBlogPostRequested);
    on<DeleteBlogPostRequested>(_onDeleteBlogPostRequested);
    on<IncrementViewCountRequested>(_onIncrementViewCountRequested);
    on<IncrementLikeCountRequested>(_onIncrementLikeCountRequested);

    // Blog Tags Events
    on<GetBlogTagsRequested>(_onGetBlogTagsRequested);
    on<CreateBlogTagRequested>(_onCreateBlogTagRequested);
    on<UpdateBlogTagRequested>(_onUpdateBlogTagRequested);
    on<DeleteBlogTagRequested>(_onDeleteBlogTagRequested);
  }

  Future<void> _onGetBlogPostsRequested(
    GetBlogPostsRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement GetBlogPostsUseCase with proper parameters
    final result = await getBlogPostsUseCase(GetBlogPostsParams(
      page: event.page,
      limit: event.limit,
      published: event.published,
      featured: event.featured,
      visible: event.visible,
      public: event.public,
      search: event.search,
      sortBy: event.sortBy,
      sortOrder: event.sortOrder,
    ));

    result.fold(
      (failure) => emit(BlogError(failure.message)),
      (posts) => emit(BlogPostsLoaded(posts)),
    );
  }

  Future<void> _onGetBlogPostByIdRequested(
    GetBlogPostByIdRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement GetBlogPostByIdUseCase
    emit(BlogError('GetBlogPostByIdUseCase not implemented yet'));
  }

  Future<void> _onCreateBlogPostRequested(
    CreateBlogPostRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement CreateBlogPostUseCase
    emit(BlogError('CreateBlogPostUseCase not implemented yet'));
  }

  Future<void> _onUpdateBlogPostRequested(
    UpdateBlogPostRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement UpdateBlogPostUseCase
    emit(BlogError('UpdateBlogPostUseCase not implemented yet'));
  }

  Future<void> _onDeleteBlogPostRequested(
    DeleteBlogPostRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement DeleteBlogPostUseCase
    emit(BlogError('DeleteBlogPostUseCase not implemented yet'));
  }

  Future<void> _onIncrementViewCountRequested(
    IncrementViewCountRequested event,
    Emitter<BlogState> emit,
  ) async {
    // TODO: Implement IncrementViewCountUseCase
    emit(ViewCountIncremented(event.postId));
  }

  Future<void> _onIncrementLikeCountRequested(
    IncrementLikeCountRequested event,
    Emitter<BlogState> emit,
  ) async {
    // TODO: Implement IncrementLikeCountUseCase
    emit(LikeCountIncremented(event.postId));
  }

  Future<void> _onGetBlogTagsRequested(
    GetBlogTagsRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement GetBlogTagsUseCase
    emit(BlogError('GetBlogTagsUseCase not implemented yet'));
  }

  Future<void> _onCreateBlogTagRequested(
    CreateBlogTagRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement CreateBlogTagUseCase
    emit(BlogError('CreateBlogTagUseCase not implemented yet'));
  }

  Future<void> _onUpdateBlogTagRequested(
    UpdateBlogTagRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement UpdateBlogTagUseCase
    emit(BlogError('UpdateBlogTagUseCase not implemented yet'));
  }

  Future<void> _onDeleteBlogTagRequested(
    DeleteBlogTagRequested event,
    Emitter<BlogState> emit,
  ) async {
    emit(BlogLoading());

    // TODO: Implement DeleteBlogTagUseCase
    emit(BlogError('DeleteBlogTagUseCase not implemented yet'));
  }
}

// Factory function for creating BlogBloc with dependency injection
BlogBloc createBlogBloc() {
  return BlogBloc(
    getBlogPostsUseCase: sl<GetBlogPostsUseCase>(),
  );
}
