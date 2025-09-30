import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class CreateBlogPostEvent extends Equatable {
  const CreateBlogPostEvent();

  @override
  List<Object?> get props => [];
}

class TitleChanged extends CreateBlogPostEvent {
  final String title;

  const TitleChanged(this.title);

  @override
  List<Object> get props => [title];
}

class SlugChanged extends CreateBlogPostEvent {
  final String slug;

  const SlugChanged(this.slug);

  @override
  List<Object> get props => [slug];
}

class ExcerptChanged extends CreateBlogPostEvent {
  final String excerpt;

  const ExcerptChanged(this.excerpt);

  @override
  List<Object> get props => [excerpt];
}

class ContentChanged extends CreateBlogPostEvent {
  final String content;

  const ContentChanged(this.content);

  @override
  List<Object> get props => [content];
}

class FeaturedImageChanged extends CreateBlogPostEvent {
  final String? imageUrl;

  const FeaturedImageChanged(this.imageUrl);

  @override
  List<Object?> get props => [imageUrl];
}

class TagsChanged extends CreateBlogPostEvent {
  final List<String> tagIds;

  const TagsChanged(this.tagIds);

  @override
  List<Object> get props => [tagIds];
}

class FeaturedToggled extends CreateBlogPostEvent {}

class PublishedToggled extends CreateBlogPostEvent {}

class VisibleToggled extends CreateBlogPostEvent {}

class PublicToggled extends CreateBlogPostEvent {}

class AutoGenerateSlug extends CreateBlogPostEvent {}

class ValidateForm extends CreateBlogPostEvent {}

class NextStep extends CreateBlogPostEvent {}

class PreviousStep extends CreateBlogPostEvent {}

class ResetForm extends CreateBlogPostEvent {}

// States
enum FormStep { basic, content, settings, preview }

class CreateBlogPostState extends Equatable {
  final FormStep currentStep;
  final String title;
  final String slug;
  final String excerpt;
  final String content;
  final String? featuredImage;
  final List<String> tagIds;
  final bool featured;
  final bool published;
  final bool visible;
  final bool public;
  
  // Validation
  final String? titleError;
  final String? slugError;
  final String? excerptError;
  final String? contentError;
  final bool isValid;
  final bool isAutoSlug;

  const CreateBlogPostState({
    required this.currentStep,
    required this.title,
    required this.slug,
    required this.excerpt,
    required this.content,
    this.featuredImage,
    required this.tagIds,
    required this.featured,
    required this.published,
    required this.visible,
    required this.public,
    this.titleError,
    this.slugError,
    this.excerptError,
    this.contentError,
    required this.isValid,
    required this.isAutoSlug,
  });

  factory CreateBlogPostState.initial() {
    return const CreateBlogPostState(
      currentStep: FormStep.basic,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: null,
      tagIds: [],
      featured: false,
      published: false,
      visible: true,
      public: true,
      titleError: null,
      slugError: null,
      excerptError: null,
      contentError: null,
      isValid: false,
      isAutoSlug: true,
    );
  }

  CreateBlogPostState copyWith({
    FormStep? currentStep,
    String? title,
    String? slug,
    String? excerpt,
    String? content,
    String? featuredImage,
    List<String>? tagIds,
    bool? featured,
    bool? published,
    bool? visible,
    bool? public,
    String? titleError,
    String? slugError,
    String? excerptError,
    String? contentError,
    bool? isValid,
    bool? isAutoSlug,
  }) {
    return CreateBlogPostState(
      currentStep: currentStep ?? this.currentStep,
      title: title ?? this.title,
      slug: slug ?? this.slug,
      excerpt: excerpt ?? this.excerpt,
      content: content ?? this.content,
      featuredImage: featuredImage ?? this.featuredImage,
      tagIds: tagIds ?? this.tagIds,
      featured: featured ?? this.featured,
      published: published ?? this.published,
      visible: visible ?? this.visible,
      public: public ?? this.public,
      titleError: titleError,
      slugError: slugError,
      excerptError: excerptError,
      contentError: contentError,
      isValid: isValid ?? this.isValid,
      isAutoSlug: isAutoSlug ?? this.isAutoSlug,
    );
  }

  @override
  List<Object?> get props => [
        currentStep,
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        tagIds,
        featured,
        published,
        visible,
        public,
        titleError,
        slugError,
        excerptError,
        contentError,
        isValid,
        isAutoSlug,
      ];
}

// BLoC
class CreateBlogPostBloc extends Bloc<CreateBlogPostEvent, CreateBlogPostState> {
  CreateBlogPostBloc() : super(CreateBlogPostState.initial()) {
    on<TitleChanged>(_onTitleChanged);
    on<SlugChanged>(_onSlugChanged);
    on<ExcerptChanged>(_onExcerptChanged);
    on<ContentChanged>(_onContentChanged);
    on<FeaturedImageChanged>(_onFeaturedImageChanged);
    on<TagsChanged>(_onTagsChanged);
    on<FeaturedToggled>(_onFeaturedToggled);
    on<PublishedToggled>(_onPublishedToggled);
    on<VisibleToggled>(_onVisibleToggled);
    on<PublicToggled>(_onPublicToggled);
    on<AutoGenerateSlug>(_onAutoGenerateSlug);
    on<ValidateForm>(_onValidateForm);
    on<NextStep>(_onNextStep);
    on<PreviousStep>(_onPreviousStep);
    on<ResetForm>(_onResetForm);
  }

  void _onTitleChanged(TitleChanged event, Emitter<CreateBlogPostState> emit) {
    final titleError = _validateTitle(event.title);
    
    // Auto-generate slug if enabled
    String slug = state.slug;
    if (state.isAutoSlug) {
      slug = _generateSlug(event.title);
    }

    emit(state.copyWith(
      title: event.title,
      slug: slug,
      titleError: titleError,
    ));
    
    add(ValidateForm());
  }

  void _onSlugChanged(SlugChanged event, Emitter<CreateBlogPostState> emit) {
    final slugError = _validateSlug(event.slug);
    
    emit(state.copyWith(
      slug: event.slug,
      slugError: slugError,
      isAutoSlug: false, // Disable auto-generation when manually edited
    ));
    
    add(ValidateForm());
  }

  void _onExcerptChanged(ExcerptChanged event, Emitter<CreateBlogPostState> emit) {
    final excerptError = _validateExcerpt(event.excerpt);
    
    emit(state.copyWith(
      excerpt: event.excerpt,
      excerptError: excerptError,
    ));
    
    add(ValidateForm());
  }

  void _onContentChanged(ContentChanged event, Emitter<CreateBlogPostState> emit) {
    final contentError = _validateContent(event.content);
    
    emit(state.copyWith(
      content: event.content,
      contentError: contentError,
    ));
    
    add(ValidateForm());
  }

  void _onFeaturedImageChanged(FeaturedImageChanged event, Emitter<CreateBlogPostState> emit) {
    emit(state.copyWith(featuredImage: event.imageUrl));
  }

  void _onTagsChanged(TagsChanged event, Emitter<CreateBlogPostState> emit) {
    emit(state.copyWith(tagIds: event.tagIds));
  }

  void _onFeaturedToggled(FeaturedToggled event, Emitter<CreateBlogPostState> emit) {
    emit(state.copyWith(featured: !state.featured));
  }

  void _onPublishedToggled(PublishedToggled event, Emitter<CreateBlogPostState> emit) {
    emit(state.copyWith(published: !state.published));
  }

  void _onVisibleToggled(VisibleToggled event, Emitter<CreateBlogPostState> emit) {
    emit(state.copyWith(visible: !state.visible));
  }

  void _onPublicToggled(PublicToggled event, Emitter<CreateBlogPostState> emit) {
    emit(state.copyWith(public: !state.public));
  }

  void _onAutoGenerateSlug(AutoGenerateSlug event, Emitter<CreateBlogPostState> emit) {
    final slug = _generateSlug(state.title);
    emit(state.copyWith(
      slug: slug,
      isAutoSlug: true,
    ));
  }

  void _onValidateForm(ValidateForm event, Emitter<CreateBlogPostState> emit) {
    final isValid = state.titleError == null &&
        state.slugError == null &&
        state.excerptError == null &&
        state.contentError == null &&
        state.title.isNotEmpty &&
        state.slug.isNotEmpty &&
        state.excerpt.isNotEmpty &&
        state.content.isNotEmpty;

    emit(state.copyWith(isValid: isValid));
  }

  void _onNextStep(NextStep event, Emitter<CreateBlogPostState> emit) {
    if (!_canProceedToNextStep()) return;

    final currentIndex = FormStep.values.indexOf(state.currentStep);
    if (currentIndex < FormStep.values.length - 1) {
      emit(state.copyWith(
        currentStep: FormStep.values[currentIndex + 1],
      ));
    }
  }

  void _onPreviousStep(PreviousStep event, Emitter<CreateBlogPostState> emit) {
    final currentIndex = FormStep.values.indexOf(state.currentStep);
    if (currentIndex > 0) {
      emit(state.copyWith(
        currentStep: FormStep.values[currentIndex - 1],
      ));
    }
  }

  void _onResetForm(ResetForm event, Emitter<CreateBlogPostState> emit) {
    emit(CreateBlogPostState.initial());
  }

  // Validation methods
  String? _validateTitle(String title) {
    if (title.isEmpty) {
      return 'Title is required';
    }
    if (title.length < 3) {
      return 'Title must be at least 3 characters';
    }
    if (title.length > 200) {
      return 'Title must be less than 200 characters';
    }
    return null;
  }

  String? _validateSlug(String slug) {
    if (slug.isEmpty) {
      return 'Slug is required';
    }
    if (!RegExp(r'^[a-z0-9]+(?:-[a-z0-9]+)*$').hasMatch(slug)) {
      return 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    return null;
  }

  String? _validateExcerpt(String excerpt) {
    if (excerpt.isEmpty) {
      return 'Excerpt is required';
    }
    if (excerpt.length < 10) {
      return 'Excerpt must be at least 10 characters';
    }
    if (excerpt.length > 500) {
      return 'Excerpt must be less than 500 characters';
    }
    return null;
  }

  String? _validateContent(String content) {
    if (content.isEmpty) {
      return 'Content is required';
    }
    if (content.length < 50) {
      return 'Content must be at least 50 characters';
    }
    return null;
  }

  // Helper methods
  String _generateSlug(String title) {
    return title
        .toLowerCase()
        .trim()
        .replaceAll(RegExp(r'[^\w\s-]'), '')
        .replaceAll(RegExp(r'[\s_-]+'), '-')
        .replaceAll(RegExp(r'^-+|-+$'), '');
  }

  bool _canProceedToNextStep() {
    switch (state.currentStep) {
      case FormStep.basic:
        return state.titleError == null &&
            state.slugError == null &&
            state.title.isNotEmpty &&
            state.slug.isNotEmpty;
      case FormStep.content:
        return state.excerptError == null &&
            state.contentError == null &&
            state.excerpt.isNotEmpty &&
            state.content.isNotEmpty;
      case FormStep.settings:
      case FormStep.preview:
        return true;
    }
  }
}
