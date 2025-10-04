import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/projects_bloc.dart';

class ProjectDetailPage extends StatefulWidget {
  final String projectId;

  const ProjectDetailPage({
    super.key,
    required this.projectId,
  });

  @override
  State<ProjectDetailPage> createState() => _ProjectDetailPageState();
}

class _ProjectDetailPageState extends State<ProjectDetailPage> {
  bool _isEditing = false;
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _longDescriptionController;
  late TextEditingController _contentController;
  late TextEditingController _githubUrlController;
  late TextEditingController _liveUrlController;
  late TextEditingController _videoUrlController;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _descriptionController = TextEditingController();
    _longDescriptionController = TextEditingController();
    _contentController = TextEditingController();
    _githubUrlController = TextEditingController();
    _liveUrlController = TextEditingController();
    _videoUrlController = TextEditingController();

    // Load the specific project
    context.read<ProjectsBloc>().add(GetProjectByIdRequested(widget.projectId));
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _longDescriptionController.dispose();
    _contentController.dispose();
    _githubUrlController.dispose();
    _liveUrlController.dispose();
    _videoUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Project Details'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              onPressed: () => context.push('/projects/${widget.projectId}/edit'),
              icon: const Icon(Icons.edit),
            )
          else
            TextButton(
              onPressed: () {
                setState(() {
                  _isEditing = false;
                });
                // Reset form to original values
                context.read<ProjectsBloc>().add(GetProjectByIdRequested(widget.projectId));
              },
              child: const Text('Cancel'),
            ),
        ],
      ),
      body: BlocConsumer<ProjectsBloc, ProjectsState>(
        listener: (context, state) {
          if (state is ProjectsError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is ProjectUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Project updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _isEditing = false;
            });
          }
        },
        builder: (context, state) {
          if (state is ProjectsLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ProjectsError) {
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
                    'Error loading project',
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
                      context.read<ProjectsBloc>().add(GetProjectByIdRequested(widget.projectId));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is ProjectLoaded) {
            final project = state.project;
            
            // Populate controllers if not already done
            if (_titleController.text.isEmpty) {
              _titleController.text = project.title;
              _descriptionController.text = project.description;
              _longDescriptionController.text = project.longDescription ?? '';
              _contentController.text = project.content ?? '';
              _githubUrlController.text = project.githubUrl ?? '';
              _liveUrlController.text = project.liveUrl ?? '';
              _videoUrlController.text = project.videoUrl ?? '';
            }

            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Project image
                  Container(
                    height: 250,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(project.image),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Stack(
                      children: [
                        if (project.featured)
                          Positioned(
                            top: 16,
                            right: 16,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
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
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),
                        if (_isEditing)
                          Positioned(
                            bottom: 16,
                            right: 16,
                            child: FloatingActionButton.small(
                              onPressed: () {
                                // TODO: Implement image picker
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Image picker not implemented yet'),
                                  ),
                                );
                              },
                              backgroundColor: Colors.blue.shade600,
                              child: const Icon(Icons.camera_alt, color: Colors.white),
                            ),
                          ),
                      ],
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title Section
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
                                      project.title,
                                      style: const TextStyle(
                                        fontSize: 28,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),

                        // Status indicators
                        Row(
                          children: [
                            Icon(
                              Icons.visibility,
                              size: 16,
                              color: project.visible ? Colors.green : Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              project.visible ? 'Visible' : 'Hidden',
                              style: TextStyle(
                                fontSize: 12,
                                color: project.visible ? Colors.green : Colors.grey,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Icon(
                              Icons.public,
                              size: 16,
                              color: project.public ? Colors.blue : Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              project.public ? 'Public' : 'Private',
                              style: TextStyle(
                                fontSize: 12,
                                color: project.public ? Colors.blue : Colors.grey,
                              ),
                            ),
                            const Spacer(),
                            Text(
                              _formatDate(project.createdAt),
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Description Section
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
                                        project.description,
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

                        // Long Description Section
                        if (project.longDescription != null || _isEditing) ...[
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Long Description',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  _isEditing
                                      ? TextField(
                                          controller: _longDescriptionController,
                                          decoration: const InputDecoration(
                                            labelText: 'Long Description',
                                            border: OutlineInputBorder(),
                                          ),
                                          maxLines: 5,
                                        )
                                      : Text(
                                          project.longDescription ?? '',
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

                        // Content Section
                        if (project.content != null || _isEditing) ...[
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Content',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  _isEditing
                                      ? TextField(
                                          controller: _contentController,
                                          decoration: const InputDecoration(
                                            labelText: 'Content',
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
                                            project.content ?? '',
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
                        ],

                        // Frameworks Section
                        if (project.frameworks != null && project.frameworks!.isNotEmpty) ...[
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Technologies',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: project.frameworks!.map((framework) {
                                      return Chip(
                                        label: Text(framework.name),
                                        backgroundColor: Colors.blue.shade50,
                                        labelStyle: TextStyle(
                                          color: Colors.blue.shade700,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Links Section
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Links',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                if (project.githubUrl != null || _isEditing) ...[
                                  _buildLinkField(
                                    'GitHub',
                                    _githubUrlController,
                                    Icons.code,
                                    project.githubUrl,
                                  ),
                                  const SizedBox(height: 12),
                                ],
                                if (project.liveUrl != null || _isEditing) ...[
                                  _buildLinkField(
                                    'Live Demo',
                                    _liveUrlController,
                                    Icons.launch,
                                    project.liveUrl,
                                  ),
                                  const SizedBox(height: 12),
                                ],
                                if (project.videoUrl != null || _isEditing) ...[
                                  _buildLinkField(
                                    'Video',
                                    _videoUrlController,
                                    Icons.play_circle,
                                    project.videoUrl,
                                  ),
                                ],
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
                                _buildMetadataRow('Slug', project.slug),
                                _buildMetadataRow('Order', project.order.toString()),
                                _buildMetadataRow('Created', _formatFullDate(project.createdAt)),
                                _buildMetadataRow('Updated', _formatFullDate(project.updatedAt)),
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
                                  onPressed: () => _saveProject(),
                                  icon: const Icon(Icons.save),
                                  label: const Text('Save Changes'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue.shade600,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
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

  Widget _buildLinkField(
    String label,
    TextEditingController controller,
    IconData icon,
    String? url,
  ) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.blue.shade600),
        const SizedBox(width: 8),
        Expanded(
          child: _isEditing
              ? TextField(
                  controller: controller,
                  decoration: InputDecoration(
                    labelText: label,
                    border: const OutlineInputBorder(),
                    hintText: 'https://...',
                  ),
                )
              : url != null
                  ? InkWell(
                      onTap: () => _launchUrl(url),
                      child: Text(
                        url,
                        style: TextStyle(
                          color: Colors.blue.shade600,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    )
                  : Text(
                      'No $label provided',
                      style: TextStyle(color: Colors.grey.shade500),
                    ),
        ),
      ],
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
                color: Colors.grey.shade600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _saveProject() {
    context.read<ProjectsBloc>().add(UpdateProjectRequested(
      id: widget.projectId,
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      longDescription: _longDescriptionController.text.trim().isEmpty
          ? null
          : _longDescriptionController.text.trim(),
      content: _contentController.text.trim().isEmpty
          ? null
          : _contentController.text.trim(),
      githubUrl: _githubUrlController.text.trim().isEmpty
          ? null
          : _githubUrlController.text.trim(),
      liveUrl: _liveUrlController.text.trim().isEmpty
          ? null
          : _liveUrlController.text.trim(),
      videoUrl: _videoUrlController.text.trim().isEmpty
          ? null
          : _videoUrlController.text.trim(),
    ));
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Project'),
        content: const Text(
          'Are you sure you want to delete this project? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<ProjectsBloc>().add(DeleteProjectRequested(widget.projectId));
              context.pop(); // Go back to projects list
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

  Future<void> _launchUrl(String url) async {
    // TODO: Implement URL launcher when url_launcher package is added
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('URL launcher not implemented yet: $url'),
        backgroundColor: Colors.orange,
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

  String _formatFullDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} at ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
