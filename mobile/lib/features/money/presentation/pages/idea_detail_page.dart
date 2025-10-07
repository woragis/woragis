import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/money_bloc.dart';
import '../../domain/entities/idea_entity.dart';

class IdeaDetailPage extends StatefulWidget {
  final String ideaId;

  const IdeaDetailPage({
    super.key,
    required this.ideaId,
  });

  @override
  State<IdeaDetailPage> createState() => _IdeaDetailPageState();
}

class _IdeaDetailPageState extends State<IdeaDetailPage> {
  bool _isEditing = false;
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _documentController;
  late TextEditingController _slugController;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _descriptionController = TextEditingController();
    _documentController = TextEditingController();
    _slugController = TextEditingController();

    // Load the specific idea
    context.read<MoneyBloc>().add(GetIdeaByIdRequested(widget.ideaId));
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _documentController.dispose();
    _slugController.dispose();
    super.dispose();
  }

  Widget _buildIdeaDetailContent(IdeaEntity idea) {
    // Populate controllers if not already done
    if (_titleController.text.isEmpty) {
      _titleController.text = idea.title;
      _descriptionController.text = idea.description ?? '';
      _documentController.text = idea.document;
      _slugController.text = idea.slug;
    }

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
                        child: _isEditing
                            ? TextField(
                                controller: _titleController,
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
                        child: _isEditing
                            ? TextField(
                                controller: _slugController,
                                decoration: const InputDecoration(
                                  labelText: 'Slug',
                                  border: OutlineInputBorder(),
                                ),
                              )
                            : Text(
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
                    _isEditing
                        ? TextField(
                            controller: _descriptionController,
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
                  _isEditing
                      ? TextField(
                          controller: _documentController,
                          decoration: const InputDecoration(
                            labelText: 'Document',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 10,
                        )
                      : Container(
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
          const SizedBox(height: 80), // Space for FAB
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Idea Details'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              onPressed: () => context.push('/money/ideas/${widget.ideaId}/edit'),
              icon: const Icon(Icons.edit),
            )
          else
            TextButton(
              onPressed: () {
                setState(() {
                  _isEditing = false;
                });
              },
              child: const Text('Cancel'),
            ),
        ],
      ),
      body: BlocConsumer<MoneyBloc, MoneyState>(
        listener: (context, state) {
          if (state is MoneyError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is IdeaUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Idea updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _isEditing = false;
            });
          }
        },
        builder: (context, state) {
          // Handle composite state
          if (state is MoneyDataState) {
            final dataState = state;
            
            // Show loading indicator if loading and no cached data
            if (dataState.isLoading && dataState.currentIdea == null) {
              return const Center(child: CircularProgressIndicator());
            }
            
            // Show error if there's an error and no cached data
            if (dataState.error != null && dataState.currentIdea == null) {
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
                      'Error loading idea',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.red.shade700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      dataState.error!,
                      style: TextStyle(color: Colors.red.shade600),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        context.read<MoneyBloc>().add(GetIdeaByIdRequested(widget.ideaId));
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }
            
            // Show cached data if available
            if (dataState.currentIdea != null) {
              final idea = dataState.currentIdea!;
              
              // Show loading overlay if still loading
              if (dataState.isLoading) {
                return Stack(
                  children: [
                    _buildIdeaDetailContent(idea),
                    Container(
                      color: Colors.black.withValues(alpha: 0.3),
                      child: const Center(
                        child: CircularProgressIndicator(),
                      ),
                    ),
                  ],
                );
              }
              
              return _buildIdeaDetailContent(idea);
            }
          }
          
          // Legacy state handling
          if (state is MoneyLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is MoneyError) {
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
                    'Error loading idea',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.red.shade700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    state.message,
                    style: TextStyle(color: Colors.red.shade600),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<MoneyBloc>().add(GetIdeaByIdRequested(widget.ideaId));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is IdeaLoaded) {
            final idea = state.idea;
            
            // Populate controllers if not already done
            if (_titleController.text.isEmpty) {
              _titleController.text = idea.title;
              _descriptionController.text = idea.description ?? '';
              _documentController.text = idea.document;
              _slugController.text = idea.slug;
            }

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
                                child: _isEditing
                                    ? TextField(
                                        controller: _titleController,
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
                                  child: Text(
                                    'Featured',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.amber.shade800,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(
                                Icons.visibility,
                                size: 16,
                                color: idea.visible ? Colors.green : Colors.grey,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                idea.visible ? 'Visible' : 'Hidden',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: idea.visible ? Colors.green : Colors.grey,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Icon(
                                Icons.public,
                                size: 16,
                                color: idea.public ? Colors.blue : Colors.grey,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                idea.public ? 'Public' : 'Private',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: idea.public ? Colors.blue : Colors.grey,
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
                  const SizedBox(height: 16),

                  // Description Section
                  if (idea.description != null || _isEditing) ...[
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
                            _isEditing
                                ? TextField(
                                    controller: _descriptionController,
                                    decoration: const InputDecoration(
                                      labelText: 'Description',
                                      border: OutlineInputBorder(),
                                      hintText: 'Brief description of your idea...',
                                    ),
                                    maxLines: 3,
                                  )
                                : Text(
                                    idea.description ?? '',
                                    style: TextStyle(
                                      color: Colors.grey.shade700,
                                      fontSize: 16,
                                    ),
                                  ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Document Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Document',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Spacer(),
                              if (!_isEditing)
                                TextButton.icon(
                                  onPressed: () => context.push('/money/ai-chats/create?ideaId=${idea.id}'),
                                  icon: const Icon(Icons.chat),
                                  label: const Text('AI Chat'),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          _isEditing
                              ? TextField(
                                  controller: _documentController,
                                  decoration: const InputDecoration(
                                    labelText: 'Document',
                                    border: OutlineInputBorder(),
                                    hintText: 'Detailed description of your idea...',
                                  ),
                                  maxLines: 10,
                                )
                              : Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: Colors.grey.shade300),
                                  ),
                                  child: Text(
                                    idea.document,
                                    style: TextStyle(
                                      color: Colors.grey.shade700,
                                      fontSize: 14,
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
                            'Details',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          _buildMetadataRow('Slug', idea.slug),
                          _buildMetadataRow('Order', idea.order.toString()),
                          _buildMetadataRow('Created', _formatFullDate(idea.createdAt)),
                          _buildMetadataRow('Updated', _formatFullDate(idea.updatedAt)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Action Buttons
                  if (_isEditing)
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () => _saveIdea(),
                            icon: const Icon(Icons.save),
                            label: const Text('Save Changes'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green.shade600,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: !_isEditing
          ? FloatingActionButton.extended(
              onPressed: () => _showDeleteDialog(context),
              backgroundColor: Colors.red.shade600,
              icon: const Icon(Icons.delete, color: Colors.white),
              label: const Text('Delete', style: TextStyle(color: Colors.white)),
            )
          : null,
    );
  }

  void _saveIdea() {
    context.read<MoneyBloc>().add(UpdateIdeaRequested(
      id: widget.ideaId,
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
      document: _documentController.text.trim(),
      slug: _slugController.text.trim(),
    ));
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Idea'),
        content: const Text(
          'Are you sure you want to delete this idea? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<MoneyBloc>().add(DeleteIdeaRequested(widget.ideaId));
              context.pop(); // Go back to ideas list
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  String _formatFullDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} at ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
