import 'package:flutter/material.dart';
import 'package:flutter_query/flutter_query.dart';

class QueryClientProvider extends StatelessWidget {
  final Widget child;

  const QueryClientProvider({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return QueryScope(
      child: child,
    );
  }
}
