import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class BlogFilterEvent extends Equatable {
  const BlogFilterEvent();

  @override
  List<Object?> get props => [];
}

class SearchQueryChanged extends BlogFilterEvent {
  final String query;

  const SearchQueryChanged(this.query);

  @override
  List<Object> get props => [query];
}

class TagFilterChanged extends BlogFilterEvent {
  final List<String> tagIds;

  const TagFilterChanged(this.tagIds);

  @override
  List<Object> get props => [tagIds];
}

class FeaturedFilterToggled extends BlogFilterEvent {}

class PublishedFilterToggled extends BlogFilterEvent {}

class SortByChanged extends BlogFilterEvent {
  final BlogSortBy sortBy;

  const SortByChanged(this.sortBy);

  @override
  List<Object> get props => [sortBy];
}

class SortOrderToggled extends BlogFilterEvent {}

class ViewModeChanged extends BlogFilterEvent {
  final BlogViewMode viewMode;

  const ViewModeChanged(this.viewMode);

  @override
  List<Object> get props => [viewMode];
}

class ResetFilters extends BlogFilterEvent {}

// Enums
enum BlogSortBy { date, title, views, likes }

enum BlogViewMode { grid, list, compact }

enum SortOrder { ascending, descending }

// States
class BlogFilterState extends Equatable {
  final String searchQuery;
  final List<String> selectedTagIds;
  final bool? featuredFilter; // null = all, true = featured only, false = non-featured only
  final bool? publishedFilter;
  final BlogSortBy sortBy;
  final SortOrder sortOrder;
  final BlogViewMode viewMode;
  final bool hasActiveFilters;

  const BlogFilterState({
    required this.searchQuery,
    required this.selectedTagIds,
    this.featuredFilter,
    this.publishedFilter,
    required this.sortBy,
    required this.sortOrder,
    required this.viewMode,
    required this.hasActiveFilters,
  });

  factory BlogFilterState.initial() {
    return const BlogFilterState(
      searchQuery: '',
      selectedTagIds: [],
      featuredFilter: null,
      publishedFilter: null,
      sortBy: BlogSortBy.date,
      sortOrder: SortOrder.descending,
      viewMode: BlogViewMode.list,
      hasActiveFilters: false,
    );
  }

  BlogFilterState copyWith({
    String? searchQuery,
    List<String>? selectedTagIds,
    bool? featuredFilter,
    bool? publishedFilter,
    BlogSortBy? sortBy,
    SortOrder? sortOrder,
    BlogViewMode? viewMode,
    bool? hasActiveFilters,
  }) {
    return BlogFilterState(
      searchQuery: searchQuery ?? this.searchQuery,
      selectedTagIds: selectedTagIds ?? this.selectedTagIds,
      featuredFilter: featuredFilter ?? this.featuredFilter,
      publishedFilter: publishedFilter ?? this.publishedFilter,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      viewMode: viewMode ?? this.viewMode,
      hasActiveFilters: hasActiveFilters ?? this.hasActiveFilters,
    );
  }

  @override
  List<Object?> get props => [
        searchQuery,
        selectedTagIds,
        featuredFilter,
        publishedFilter,
        sortBy,
        sortOrder,
        viewMode,
        hasActiveFilters,
      ];
}

// BLoC
class BlogFilterBloc extends Bloc<BlogFilterEvent, BlogFilterState> {
  BlogFilterBloc() : super(BlogFilterState.initial()) {
    on<SearchQueryChanged>(_onSearchQueryChanged);
    on<TagFilterChanged>(_onTagFilterChanged);
    on<FeaturedFilterToggled>(_onFeaturedFilterToggled);
    on<PublishedFilterToggled>(_onPublishedFilterToggled);
    on<SortByChanged>(_onSortByChanged);
    on<SortOrderToggled>(_onSortOrderToggled);
    on<ViewModeChanged>(_onViewModeChanged);
    on<ResetFilters>(_onResetFilters);
  }

  void _onSearchQueryChanged(
    SearchQueryChanged event,
    Emitter<BlogFilterState> emit,
  ) {
    emit(state.copyWith(
      searchQuery: event.query,
      hasActiveFilters: _hasActiveFilters(searchQuery: event.query),
    ));
  }

  void _onTagFilterChanged(
    TagFilterChanged event,
    Emitter<BlogFilterState> emit,
  ) {
    emit(state.copyWith(
      selectedTagIds: event.tagIds,
      hasActiveFilters: _hasActiveFilters(selectedTagIds: event.tagIds),
    ));
  }

  void _onFeaturedFilterToggled(
    FeaturedFilterToggled event,
    Emitter<BlogFilterState> emit,
  ) {
    bool? newFeaturedFilter;
    if (state.featuredFilter == null) {
      newFeaturedFilter = true;
    } else if (state.featuredFilter == true) {
      newFeaturedFilter = false;
    } else {
      newFeaturedFilter = null;
    }

    emit(state.copyWith(
      featuredFilter: newFeaturedFilter,
      hasActiveFilters: _hasActiveFilters(featuredFilter: newFeaturedFilter),
    ));
  }

  void _onPublishedFilterToggled(
    PublishedFilterToggled event,
    Emitter<BlogFilterState> emit,
  ) {
    bool? newPublishedFilter;
    if (state.publishedFilter == null) {
      newPublishedFilter = true;
    } else if (state.publishedFilter == true) {
      newPublishedFilter = false;
    } else {
      newPublishedFilter = null;
    }

    emit(state.copyWith(
      publishedFilter: newPublishedFilter,
      hasActiveFilters: _hasActiveFilters(publishedFilter: newPublishedFilter),
    ));
  }

  void _onSortByChanged(
    SortByChanged event,
    Emitter<BlogFilterState> emit,
  ) {
    emit(state.copyWith(sortBy: event.sortBy));
  }

  void _onSortOrderToggled(
    SortOrderToggled event,
    Emitter<BlogFilterState> emit,
  ) {
    final newSortOrder = state.sortOrder == SortOrder.ascending
        ? SortOrder.descending
        : SortOrder.ascending;

    emit(state.copyWith(sortOrder: newSortOrder));
  }

  void _onViewModeChanged(
    ViewModeChanged event,
    Emitter<BlogFilterState> emit,
  ) {
    emit(state.copyWith(viewMode: event.viewMode));
  }

  void _onResetFilters(
    ResetFilters event,
    Emitter<BlogFilterState> emit,
  ) {
    emit(BlogFilterState.initial().copyWith(
      viewMode: state.viewMode, // Keep view mode
      sortBy: state.sortBy, // Keep sort preferences
      sortOrder: state.sortOrder,
    ));
  }

  bool _hasActiveFilters({
    String? searchQuery,
    List<String>? selectedTagIds,
    bool? featuredFilter,
    bool? publishedFilter,
  }) {
    final query = searchQuery ?? state.searchQuery;
    final tags = selectedTagIds ?? state.selectedTagIds;
    final featured = featuredFilter ?? state.featuredFilter;
    final published = publishedFilter ?? state.publishedFilter;

    return query.isNotEmpty ||
        tags.isNotEmpty ||
        featured != null ||
        published != null;
  }
}
