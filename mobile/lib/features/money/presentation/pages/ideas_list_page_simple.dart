import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/money_simple_bloc.dart';

class IdeasListPageSimple extends StatefulWidget {
  const IdeasListPageSimple({super.key});

  @override
  State<IdeasListPageSimple> createState() => _IdeasListPageSimpleState();
}

class _IdeasListPageSimpleState extends State<IdeasListPageSimple> {
  final TextEditingController _searchController = TextEditingController();
  bool _showFeaturedOnly = false;
  bool _showPublicOnly = false;

  @override
  void initState() {
    super.initState();
    _loadIdeas();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _loadIdeas() {
    context.read<MoneySimpleBloc>().add(LoadIdeas(
      featured: _showFeaturedOnly ? true : null,
      public: _showPublicOnly ? true : null,
      search: _searchController.text.trim().isEmpty ? null : _searchController.text.trim(),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Money Ideas - Simple'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadIdeas,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey.shade50,
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search ideas...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              _loadIdeas();
                            },
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  onChanged: (value) {
                    setState(() {});
                    // Debounce search - reload after user stops typing
                    Future.delayed(const Duration(milliseconds: 500), () {
                      if (_searchController.text == value) {
                        _loadIdeas();
                      }
                    });
                  },
                ),
                const SizedBox(height: 12),
                // Filter Chips
                Row(
                  children: [
                    FilterChip(
                      label: const Text('Featured Only'),
                      selected: _showFeaturedOnly,
                      onSelected: (selected) {
                        setState(() {
                          _showFeaturedOnly = selected;
                        });
                        _loadIdeas();
                      },
                    ),
                    const SizedBox(width: 8),
                    FilterChip(
                      label: const Text('Public Only'),
                      selected: _showPublicOnly,
                      onSelected: (selected) {
                        setState(() {
                          _showPublicOnly = selected;
                        });
                        _loadIdeas();
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Ideas List
          Expanded(
            child: BlocBuilder<MoneySimpleBloc, MoneySimpleState>(
              builder: (context, state) {
                if (state is MoneySimpleLoading) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                } else if (state is MoneySimpleError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red.shade300,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Error: ${state.message}',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.red.shade700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadIdeas,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  );
                } else if (state is MoneySimpleLoaded && state.ideas != null) {
                  final ideas = state.ideas!;
                  
                  if (ideas.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.lightbulb_outline,
                            size: 64,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No ideas found',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.grey.shade600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Try adjusting your search or filters',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey.shade500,
                            ),
                          ),
                        ],
                      ),
                    );
                  }
                  
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: ideas.length,
                    itemBuilder: (context, index) {
                      final idea = ideas[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          title: Text(
                            idea.title,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (idea.description != null) ...[
                                const SizedBox(height: 4),
                                Text(
                                  idea.description!,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  if (idea.featured)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.amber.shade100,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        'Featured',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.amber.shade800,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  if (idea.featured) const SizedBox(width: 8),
                                  if (idea.public)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.green.shade100,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        'Public',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.green.shade800,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  if (!idea.public)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.red.shade100,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        'Private',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.red.shade800,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios),
                          onTap: () {
                            context.push('/money/ideas/simple/${idea.id}');
                          },
                        ),
                      );
                    },
                  );
                } else {
                  return const Center(
                    child: Text('No data available'),
                  );
                }
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.push('/money/ideas/create');
        },
        backgroundColor: Colors.green.shade600,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
