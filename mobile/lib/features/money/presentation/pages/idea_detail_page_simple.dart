import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/idea_entity.dart';
import '../bloc/money_simple_bloc.dart';

class IdeaDetailPageSimple extends StatefulWidget {
  final String ideaId;

  const IdeaDetailPageSimple({
    super.key,
    required this.ideaId,
  });

  @override
  State<IdeaDetailPageSimple> createState() => _IdeaDetailPageSimpleState();
}

class _IdeaDetailPageSimpleState extends State<IdeaDetailPageSimple> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _loadIdea();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _loadIdea() {
    context.read<MoneySimpleBloc>().add(LoadIdeaById(widget.ideaId));
  }

  void _toggleEdit() {
    setState(() {
      _isEditing = !_isEditing;
    });
  }

  void _saveChanges() {
    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Title cannot be empty')),
      );
      return;
    }

    context.read<MoneySimpleBloc>().add(UpdateIdea(
      id: widget.ideaId,
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim().isEmpty 
          ? null 
          : _descriptionController.text.trim(),
    ));

    setState(() {
      _isEditing = false;
    });
  }

  void _cancelEdit() {
    setState(() {
      _isEditing = false;
    });
    _loadIdea(); // Reload to reset form
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Idea Details - Simple'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadIdea,
          ),
        ],
      ),
      body: BlocBuilder<MoneySimpleBloc, MoneySimpleState>(
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
                    onPressed: _loadIdea,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is MoneySimpleLoaded && state.idea != null) {
            final idea = state.idea!;
            
            // Update controllers when idea is loaded
            if (!_isEditing) {
              _titleController.text = idea.title;
              _descriptionController.text = idea.description ?? '';
            }
            
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Card
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _isEditing
                                    ? TextField(
                                        controller: _titleController,
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        decoration: const InputDecoration(
                                          border: OutlineInputBorder(),
                                          hintText: 'Idea title...',
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
                              const SizedBox(width: 12),
                              if (!_isEditing)
                                IconButton(
                                  icon: const Icon(Icons.edit),
                                  onPressed: _toggleEdit,
                                ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              if (idea.featured)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.amber.shade100,
                                    borderRadius: BorderRadius.circular(16),
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
                                    horizontal: 12,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.green.shade100,
                                    borderRadius: BorderRadius.circular(16),
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
                                    horizontal: 12,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.red.shade100,
                                    borderRadius: BorderRadius.circular(16),
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
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Description Section
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
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
                          const SizedBox(height: 12),
                          _isEditing
                              ? TextField(
                                  controller: _descriptionController,
                                  maxLines: 4,
                                  decoration: const InputDecoration(
                                    border: OutlineInputBorder(),
                                    hintText: 'Describe your idea...',
                                  ),
                                )
                              : Text(
                                  idea.description ?? 'No description provided',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Document Section
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
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
                          const SizedBox(height: 12),
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
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey.shade700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Metadata Section
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
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
                          _buildDetailRow('ID', idea.id),
                          _buildDetailRow('Slug', idea.slug),
                          _buildDetailRow('Order', idea.order.toString()),
                          _buildDetailRow('Created', _formatDate(idea.createdAt)),
                          _buildDetailRow('Updated', _formatDate(idea.updatedAt)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Action Buttons
                  if (_isEditing) ...[
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _saveChanges,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green.shade600,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: const Text('Save Changes'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _cancelEdit,
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.grey.shade600,
                              side: BorderSide(color: Colors.grey.shade600),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: const Text('Cancel'),
                          ),
                        ),
                      ],
                    ),
                  ] else ...[
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _toggleEdit,
                            icon: const Icon(Icons.edit),
                            label: const Text('Edit Idea'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green.shade600,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              _showDeleteDialog(context, idea);
                            },
                            icon: const Icon(Icons.delete),
                            label: const Text('Delete'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.red.shade600,
                              side: BorderSide(color: Colors.red.shade600),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            );
          } else {
            return const Center(
              child: Text('No data available'),
            );
          }
        },
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey.shade600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  void _showDeleteDialog(BuildContext context, IdeaEntity idea) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Idea'),
          content: Text('Are you sure you want to delete "${idea.title}"? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<MoneySimpleBloc>().add(DeleteIdea(idea.id));
                context.pop(); // Go back to list
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}
