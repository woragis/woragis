import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_query/flutter_query.dart';
import '../../domain/entities/idea_entity.dart';
import '../queries/money_queries.dart';

class IdeaDetailPageQuery extends HookWidget {
  final String ideaId;

  const IdeaDetailPageQuery({
    super.key,
    required this.ideaId,
  });

  @override
  Widget build(BuildContext context) {
    final _isEditing = useState(false);
    final _titleController = useTextEditingController();
    final _descriptionController = useTextEditingController();

    // Create query for the specific entity
    final queryOptions = MoneyQueries.getIdeaById(ideaId);

    final query = useQuery<IdeaEntity, List<dynamic>>(
      queryOptions.key,
      queryOptions.fetcher,
      staleDuration: const Duration(minutes: 10), // Cache for 10 minutes
      gcDuration: const Duration(hours: 2), // Keep in memory for 2 hours
      refetchOnInit: RefetchBehavior.stale, // Only refetch if stale
      refetchOnResumed: RefetchBehavior.stale, // Only refetch if stale
    );

    // Populate controllers when data loads
    useEffect(() {
      if (query.state.data != null) {
        final idea = query.state.data!;
        _titleController.text = idea.title;
        _descriptionController.text = idea.description ?? '';
      }
      return null;
    }, [query.state.data]);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Idea Details'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        actions: [
          if (!_isEditing.value)
            IconButton(
              onPressed: () => _isEditing.value = true,
              icon: const Icon(Icons.edit),
            ),
          if (_isEditing.value) ...[
            TextButton(
              onPressed: () => _isEditing.value = false,
              child: const Text('Cancel', style: TextStyle(color: Colors.white)),
            ),
            TextButton(
              onPressed: () => _saveIdea(context, query),
              child: const Text('Save', style: TextStyle(color: Colors.white)),
            ),
          ],
        ],
      ),
      body: _buildIdeaDetail(query, _isEditing.value, _titleController, _descriptionController),
    );
  }

  Widget _buildIdeaDetail(
    QueryResult<IdeaEntity> query,
    bool isEditing,
    TextEditingController titleController,
    TextEditingController descriptionController,
  ) {
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
            Icon(Icons.error_outline, size: 64, color: Colors.red.shade300),
            const SizedBox(height: 16),
            Text('Error loading idea', 
                 style: TextStyle(fontSize: 18, color: Colors.red.shade700)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => query.refetch(),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    final idea = query.state.data;
    if (idea == null) {
      return const Center(child: Text('No data available'));
    }

    // Show loading overlay if still loading with cached data
    if (query.state.status.isFetching && query.state.data != null) {
      return Stack(
        children: [
          _buildIdeaContent(idea, isEditing, titleController, descriptionController),
          Container(
            color: Colors.black.withValues(alpha: 0.3),
            child: const Center(child: CircularProgressIndicator()),
          ),
        ],
      );
    }

    return _buildIdeaContent(idea, isEditing, titleController, descriptionController);
  }

  Widget _buildIdeaContent(
    IdeaEntity idea,
    bool isEditing,
    TextEditingController titleController,
    TextEditingController descriptionController,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title Section
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: isEditing
                            ? TextField(
                                controller: titleController,
                                decoration: const InputDecoration(
                                  labelText: 'Title',
                                  border: OutlineInputBorder(),
                                ),
                              )
                            : Text(
                                idea.title,
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                      if (idea.featured)
                        Container(
                          margin: const EdgeInsets.only(left: 12),
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
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        Icons.link,
                        size: 16,
                        color: Colors.grey.shade600,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          idea.slug,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontFamily: 'monospace',
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Description Section
          if (idea.description != null && idea.description!.isNotEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Description',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    isEditing
                        ? TextField(
                            controller: descriptionController,
                            decoration: const InputDecoration(
                              labelText: 'Description',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 3,
                          )
                        : Text(
                            idea.description!,
                            style: const TextStyle(fontSize: 16),
                          ),
                  ],
                ),
              ),
            ),

          if (idea.description != null && idea.description!.isNotEmpty)
            const SizedBox(height: 16),

          // Document Section
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Document',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Text(
                      idea.document,
                      style: const TextStyle(
                        fontSize: 14,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Metadata Section
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Metadata',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildMetadataRow('ID', idea.id),
                  _buildMetadataRow('Created', _formatDate(idea.createdAt)),
                  _buildMetadataRow('Updated', _formatDate(idea.updatedAt)),
                  _buildMetadataRow('Order', idea.order.toString()),
                  _buildMetadataRow('Visible', idea.visible ? 'Yes' : 'No'),
                  _buildMetadataRow('Public', idea.public ? 'Yes' : 'No'),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Flutter Query Info
          Card(
            color: Colors.blue.shade50,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.auto_awesome,
                        color: Colors.blue.shade600,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Flutter Query Caching',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade800,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'This data is automatically cached and will persist when you navigate back to the list. The cache will be refreshed in the background when it becomes stale.',
                    style: TextStyle(
                      color: Colors.blue.shade700,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetadataRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey.shade700,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  void _saveIdea(BuildContext context, QueryResult<IdeaEntity> query) {
    // For now, just show a success message
    // In a real implementation, you would use useMutation here
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Idea updated successfully (Flutter Query mutation coming soon)'),
        backgroundColor: Colors.green,
      ),
    );
  }
}