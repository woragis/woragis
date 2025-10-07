import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_query/flutter_query.dart';
import '../../domain/entities/idea_entity.dart';
import '../queries/money_queries.dart';

class IdeasListPageQuery extends HookWidget {
  const IdeasListPageQuery({super.key});

  @override
  Widget build(BuildContext context) {
    final searchController = useTextEditingController();
    final showFeaturedOnly = useState(false);
    final showPublicOnly = useState(false);
    final searchText = useState('');

    // Memoize query options to prevent infinite requests
    final queryOptions = useMemoized(() {
      return MoneyQueries.getIdeas(
        featured: showFeaturedOnly.value ? true : null,
        public: showPublicOnly.value ? true : null,
        search: searchText.value.trim().isEmpty ? null : searchText.value.trim(),
      );
    }, [showFeaturedOnly.value, showPublicOnly.value, searchText.value]);

    final query = useQuery<List<IdeaEntity>, List<dynamic>>(
      queryOptions.key,
      queryOptions.fetcher,
      staleDuration: const Duration(minutes: 5), // Cache for 5 minutes
      gcDuration: const Duration(hours: 1), // Keep in memory for 1 hour
      refetchOnInit: RefetchBehavior.stale, // Only refetch if stale
      refetchOnResumed: RefetchBehavior.stale, // Only refetch if stale
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Money Ideas'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => _showFilterDialog(context, showFeaturedOnly, showPublicOnly),
            icon: const Icon(Icons.filter_list),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: searchController,
              decoration: InputDecoration(
                hintText: 'Search ideas...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey.shade100,
              ),
              onChanged: (value) {
                searchText.value = value;
              },
            ),
          ),

          // Active filters
          if (showFeaturedOnly.value || showPublicOnly.value)
            Container(
              height: 50,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  if (showFeaturedOnly.value)
                    Chip(
                      label: const Text('Featured'),
                      onDeleted: () => showFeaturedOnly.value = false,
                      deleteIcon: const Icon(Icons.close, size: 18),
                    ),
                  if (showPublicOnly.value)
                    Chip(
                      label: const Text('Public'),
                      onDeleted: () => showPublicOnly.value = false,
                      deleteIcon: const Icon(Icons.close, size: 18),
                    ),
                ],
              ),
            ),

          // Ideas list using Flutter Query
          Expanded(
            child: _buildIdeasList(query),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/money/ideas/create'),
        backgroundColor: Colors.green.shade600,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildIdeasList(QueryResult<List<IdeaEntity>> query) {
    // Show loading indicator
    if (query.state.status.isFetching && query.state.data == null) {
      return const Center(child: CircularProgressIndicator());
    }

    // Show error if there's an error and no cached data
    if (query.state.status.isFailure && query.state.data == null) {
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
              'Error loading ideas',
              style: TextStyle(
                fontSize: 18,
                color: Colors.red.shade700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              query.state.error?.toString() ?? 'Unknown error',
              style: TextStyle(color: Colors.red.shade600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => query.refetch(),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    // Show cached data if available
    final ideas = query.state.data ?? [];
    
    // Show loading overlay if still loading with cached data
    if (query.state.status.isFetching && query.state.data != null) {
      return Stack(
        children: [
          _buildIdeasListView(ideas, query),
          Container(
            color: Colors.black.withValues(alpha: 0.3),
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          ),
        ],
      );
    }

    return _buildIdeasListView(ideas, query);
  }

  Widget _buildIdeasListView(List<IdeaEntity> ideas, QueryResult<List<IdeaEntity>> query) {
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
            const Text(
              'No ideas found',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create your first money-making idea!',
              style: TextStyle(
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        await query.refetch();
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: ideas.length,
        itemBuilder: (context, index) {
          final idea = ideas[index];
          return _buildIdeaCard(context, idea);
        },
      ),
    );
  }

  Widget _buildIdeaCard(BuildContext context, IdeaEntity idea) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => context.push('/money/ideas/${idea.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      idea.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (idea.featured)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.star,
                            size: 16,
                            color: Colors.amber.shade700,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Featured',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: Colors.amber.shade700,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              if (idea.description != null && idea.description!.isNotEmpty)
                Text(
                  idea.description!,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 14,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    Icons.link,
                    size: 16,
                    color: Colors.grey.shade500,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      idea.slug,
                      style: TextStyle(
                        color: Colors.grey.shade500,
                        fontSize: 12,
                        fontFamily: 'monospace',
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    _formatDate(idea.createdAt),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showFilterDialog(BuildContext context, ValueNotifier<bool> showFeaturedOnly, ValueNotifier<bool> showPublicOnly) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Ideas'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CheckboxListTile(
              title: const Text('Featured Only'),
              value: showFeaturedOnly.value,
              onChanged: (value) {
                showFeaturedOnly.value = value ?? false;
                Navigator.pop(context);
              },
            ),
            CheckboxListTile(
              title: const Text('Public Only'),
              value: showPublicOnly.value,
              onChanged: (value) {
                showPublicOnly.value = value ?? false;
                Navigator.pop(context);
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}