import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class NavigationEvent extends Equatable {
  const NavigationEvent();

  @override
  List<Object?> get props => [];
}

class NavigateToTab extends NavigationEvent {
  final int tabIndex;

  const NavigateToTab(this.tabIndex);

  @override
  List<Object> get props => [tabIndex];
}

class NavigateBack extends NavigationEvent {}

class PushRoute extends NavigationEvent {
  final String routeName;
  final Map<String, dynamic>? arguments;

  const PushRoute(this.routeName, {this.arguments});

  @override
  List<Object?> get props => [routeName, arguments];
}

class PopRoute extends NavigationEvent {}

class SetBottomNavVisible extends NavigationEvent {
  final bool visible;

  const SetBottomNavVisible(this.visible);

  @override
  List<Object> get props => [visible];
}

// Tabs
enum AppTab {
  home(0, 'Home', 'home'),
  blog(1, 'Blog', 'blog'),
  projects(2, 'Projects', 'projects'),
  about(3, 'About', 'about'),
  settings(4, 'Settings', 'settings');

  final int tabIndex;
  final String label;
  final String route;

  const AppTab(this.tabIndex, this.label, this.route);

  static AppTab fromIndex(int index) {
    return AppTab.values.firstWhere(
      (tab) => tab.tabIndex == index,
      orElse: () => AppTab.home,
    );
  }
}

// States
class NavigationState extends Equatable {
  final AppTab currentTab;
  final List<String> routeHistory;
  final bool isBottomNavVisible;
  final int tabIndex;

  const NavigationState({
    required this.currentTab,
    required this.routeHistory,
    required this.isBottomNavVisible,
    required this.tabIndex,
  });

  factory NavigationState.initial() {
    return const NavigationState(
      currentTab: AppTab.home,
      routeHistory: [],
      isBottomNavVisible: true,
      tabIndex: 0,
    );
  }

  NavigationState copyWith({
    AppTab? currentTab,
    List<String>? routeHistory,
    bool? isBottomNavVisible,
    int? tabIndex,
  }) {
    return NavigationState(
      currentTab: currentTab ?? this.currentTab,
      routeHistory: routeHistory ?? this.routeHistory,
      isBottomNavVisible: isBottomNavVisible ?? this.isBottomNavVisible,
      tabIndex: tabIndex ?? this.tabIndex,
    );
  }

  @override
  List<Object> get props => [currentTab, routeHistory, isBottomNavVisible, tabIndex];
}

// BLoC
class NavigationBloc extends Bloc<NavigationEvent, NavigationState> {
  NavigationBloc() : super(NavigationState.initial()) {
    on<NavigateToTab>(_onNavigateToTab);
    on<NavigateBack>(_onNavigateBack);
    on<PushRoute>(_onPushRoute);
    on<PopRoute>(_onPopRoute);
    on<SetBottomNavVisible>(_onSetBottomNavVisible);
  }

  void _onNavigateToTab(
    NavigateToTab event,
    Emitter<NavigationState> emit,
  ) {
    final tab = AppTab.fromIndex(event.tabIndex);
    
    emit(state.copyWith(
      currentTab: tab,
      tabIndex: event.tabIndex,
    ));
  }

  void _onNavigateBack(
    NavigateBack event,
    Emitter<NavigationState> emit,
  ) {
    if (state.routeHistory.isNotEmpty) {
      final newHistory = List<String>.from(state.routeHistory)..removeLast();
      emit(state.copyWith(routeHistory: newHistory));
    }
  }

  void _onPushRoute(
    PushRoute event,
    Emitter<NavigationState> emit,
  ) {
    final newHistory = List<String>.from(state.routeHistory)..add(event.routeName);
    emit(state.copyWith(routeHistory: newHistory));
  }

  void _onPopRoute(
    PopRoute event,
    Emitter<NavigationState> emit,
  ) {
    if (state.routeHistory.isNotEmpty) {
      final newHistory = List<String>.from(state.routeHistory)..removeLast();
      emit(state.copyWith(routeHistory: newHistory));
    }
  }

  void _onSetBottomNavVisible(
    SetBottomNavVisible event,
    Emitter<NavigationState> emit,
  ) {
    emit(state.copyWith(isBottomNavVisible: event.visible));
  }
}
