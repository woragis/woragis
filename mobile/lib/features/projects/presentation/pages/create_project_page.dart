import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/projects_bloc.dart';

class CreateProjectPage extends StatefulWidget {
  final String? projectId; // If provided, we're editing an existing project

  const CreateProjectPage({
    super.key,
    this.projectId,
  });

  @override
  State<CreateProjectPage> createState() => _CreateProjectPageState();
}

class _CreateProjectPageState extends State<CreateProjectPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _slugController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _longDescriptionController = TextEditingController();
  final _contentController = TextEditingController();
  final _githubUrlController = TextEditingController();
  final _liveUrlController = TextEditingController();
  final _videoUrlController = TextEditingController();
  
  bool _featured = false;
  bool _visible = true;
  bool _public = false;
  int _order = 0;
  String _imageUrl = '';
  List<String> _selectedFrameworkIds = [];

  @override
  void initState() {
    super.initState();
    
    // If editing an existing project, load its data
    if (widget.projectId != null) {
      context.read<ProjectsBloc>().add(GetProjectByIdRequested(widget.projectId!));
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _slugController.dispose();
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
        title: Text(widget.projectId == null ? 'Create Project' : 'Edit Project'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (widget.projectId != null)
            IconButton(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.close),
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
          } else if (state is ProjectCreated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Project created successfully'),
                backgroundColor: Colors.green,
              ),
            );
            context.go('/projects');
          } else if (state is ProjectLoaded && widget.projectId != null) {
            // Populate form with existing project data
            _populateForm(state.project);
          }
        },
        builder: (context, state) {
          if (state is ProjectsLoading && widget.projectId != null) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Basic Information
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Basic Information',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _titleController,
                            decoration: const InputDecoration(
                              labelText: 'Title *',
                              hintText: 'Enter your project title',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Title is required';
                              }
                              if (value.trim().length < 3) {
                                return 'Title must be at least 3 characters';
                              }
                              return null;
                            },
                            onChanged: (value) {
                              // Auto-generate slug from title
                              if (widget.projectId == null) {
                                _slugController.text = _generateSlug(value);
                              }
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _slugController,
                            decoration: const InputDecoration(
                              labelText: 'Slug *',
                              hintText: 'project-slug-url',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Slug is required';
                              }
                              if (!RegExp(r'^[a-z0-9-]+$').hasMatch(value.trim())) {
                                return 'Slug can only contain lowercase letters, numbers, and hyphens';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _descriptionController,
                            decoration: const InputDecoration(
                              labelText: 'Description *',
                              hintText: 'Brief description of your project',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 3,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Description is required';
                              }
                              if (value.trim().length < 10) {
                                return 'Description must be at least 10 characters';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Project Image
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Project Image',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            initialValue: _imageUrl,
                            decoration: const InputDecoration(
                              labelText: 'Image URL *',
                              hintText: 'https://example.com/image.jpg',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (value) => _imageUrl = value,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Image URL is required';
                              }
                              if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                return 'Please enter a valid URL';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 12),
                          if (_imageUrl.isNotEmpty)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                _imageUrl,
                                height: 200,
                                width: double.infinity,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Container(
                                    height: 200,
                                    color: Colors.grey.shade200,
                                    child: const Center(
                                      child: Text('Invalid image URL'),
                                    ),
                                  );
                                },
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Content Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Project Content',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _longDescriptionController,
                            decoration: const InputDecoration(
                              labelText: 'Long Description',
                              hintText: 'Detailed description of your project (optional)',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 4,
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _contentController,
                            decoration: const InputDecoration(
                              labelText: 'Content',
                              hintText: 'Additional content, features, or details (optional)',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 6,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Links Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Project Links',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _githubUrlController,
                            decoration: const InputDecoration(
                              labelText: 'GitHub URL',
                              hintText: 'https://github.com/username/repo',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.code),
                            ),
                            keyboardType: TextInputType.url,
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _liveUrlController,
                            decoration: const InputDecoration(
                              labelText: 'Live Demo URL',
                              hintText: 'https://your-project.com',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.launch),
                            ),
                            keyboardType: TextInputType.url,
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _videoUrlController,
                            decoration: const InputDecoration(
                              labelText: 'Video URL',
                              hintText: 'https://youtube.com/watch?v=...',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.play_circle),
                            ),
                            keyboardType: TextInputType.url,
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Settings Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Settings',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SwitchListTile(
                            title: const Text('Featured'),
                            subtitle: const Text('Mark this project as featured'),
                            value: _featured,
                            onChanged: (value) {
                              setState(() {
                                _featured = value;
                              });
                            },
                            activeColor: Colors.amber,
                          ),
                          SwitchListTile(
                            title: const Text('Visible'),
                            subtitle: const Text('Make this project visible in lists'),
                            value: _visible,
                            onChanged: (value) {
                              setState(() {
                                _visible = value;
                              });
                            },
                            activeColor: Colors.green,
                          ),
                          SwitchListTile(
                            title: const Text('Public'),
                            subtitle: const Text('Make this project publicly accessible'),
                            value: _public,
                            onChanged: (value) {
                              setState(() {
                                _public = value;
                              });
                            },
                            activeColor: Colors.blue,
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            initialValue: _order.toString(),
                            decoration: const InputDecoration(
                              labelText: 'Order',
                              hintText: 'Display order (0 = first)',
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.number,
                            onChanged: (value) {
                              _order = int.tryParse(value) ?? 0;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Technologies Section
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
                          const SizedBox(height: 8),
                          Text(
                            'Select the technologies used in this project',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 16),
                          // TODO: Add framework selection chips
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: const Text(
                              'Framework selection will be implemented soon',
                              style: TextStyle(
                                color: Colors.grey,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => context.pop(),
                          child: const Text('Cancel'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: state is ProjectsLoading
                              ? null
                              : () => _saveProject(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: state is ProjectsLoading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white,
                                    ),
                                  ),
                                )
                              : Text(widget.projectId == null ? 'Create Project' : 'Update Project'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _populateForm(project) {
    _titleController.text = project.title;
    _slugController.text = project.slug;
    _descriptionController.text = project.description;
    _longDescriptionController.text = project.longDescription ?? '';
    _contentController.text = project.content ?? '';
    _githubUrlController.text = project.githubUrl ?? '';
    _liveUrlController.text = project.liveUrl ?? '';
    _videoUrlController.text = project.videoUrl ?? '';
    _imageUrl = project.image;
    _featured = project.featured;
    _visible = project.visible;
    _public = project.public;
    _order = project.order;
    _selectedFrameworkIds = project.frameworks?.map((f) => f.id).toList() ?? [];
  }

  void _saveProject() {
    if (_formKey.currentState!.validate()) {
      if (widget.projectId == null) {
        // Create new project
        context.read<ProjectsBloc>().add(CreateProjectRequested(
          title: _titleController.text.trim(),
          slug: _slugController.text.trim(),
          description: _descriptionController.text.trim(),
          longDescription: _longDescriptionController.text.trim().isEmpty
              ? null
              : _longDescriptionController.text.trim(),
          content: _contentController.text.trim().isEmpty
              ? null
              : _contentController.text.trim(),
          image: _imageUrl.trim(),
          githubUrl: _githubUrlController.text.trim().isEmpty
              ? null
              : _githubUrlController.text.trim(),
          liveUrl: _liveUrlController.text.trim().isEmpty
              ? null
              : _liveUrlController.text.trim(),
          videoUrl: _videoUrlController.text.trim().isEmpty
              ? null
              : _videoUrlController.text.trim(),
          featured: _featured,
          visible: _visible,
          public: _public,
          order: _order,
          frameworkIds: _selectedFrameworkIds.isEmpty ? null : _selectedFrameworkIds,
        ));
      } else {
        // Update existing project
        context.read<ProjectsBloc>().add(UpdateProjectRequested(
          id: widget.projectId!,
          title: _titleController.text.trim(),
          slug: _slugController.text.trim(),
          description: _descriptionController.text.trim(),
          longDescription: _longDescriptionController.text.trim().isEmpty
              ? null
              : _longDescriptionController.text.trim(),
          content: _contentController.text.trim().isEmpty
              ? null
              : _contentController.text.trim(),
          image: _imageUrl.trim(),
          githubUrl: _githubUrlController.text.trim().isEmpty
              ? null
              : _githubUrlController.text.trim(),
          liveUrl: _liveUrlController.text.trim().isEmpty
              ? null
              : _liveUrlController.text.trim(),
          videoUrl: _videoUrlController.text.trim().isEmpty
              ? null
              : _videoUrlController.text.trim(),
          featured: _featured,
          visible: _visible,
          public: _public,
          order: _order,
          frameworkIds: _selectedFrameworkIds.isEmpty ? null : _selectedFrameworkIds,
        ));
      }
    }
  }

  String _generateSlug(String title) {
    return title
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\s-]'), '')
        .replaceAll(RegExp(r'\s+'), '-')
        .replaceAll(RegExp(r'-+'), '-')
        .trim();
  }
}
