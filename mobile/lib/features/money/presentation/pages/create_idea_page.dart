import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/money_bloc.dart';

class CreateIdeaPage extends StatefulWidget {
  final String? ideaId; // If provided, we're editing an existing idea

  const CreateIdeaPage({
    super.key,
    this.ideaId,
  });

  @override
  State<CreateIdeaPage> createState() => _CreateIdeaPageState();
}

class _CreateIdeaPageState extends State<CreateIdeaPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _slugController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _documentController = TextEditingController();
  
  bool _featured = false;
  bool _visible = true;
  bool _public = false;
  int _order = 0;

  @override
  void initState() {
    super.initState();
    
    // If editing an existing idea, load its data
    if (widget.ideaId != null) {
      context.read<MoneyBloc>().add(GetIdeaByIdRequested(widget.ideaId!));
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _slugController.dispose();
    _descriptionController.dispose();
    _documentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.ideaId == null ? 'Create Idea' : 'Edit Idea'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (widget.ideaId != null)
            IconButton(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.close),
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
          } else if (state is IdeaCreated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Idea created successfully'),
                backgroundColor: Colors.green,
              ),
            );
            context.go('/money/ideas');
          } else if (state is IdeaLoaded && widget.ideaId != null) {
            // Populate form with existing idea data
            _populateForm(state.idea);
          }
        },
        builder: (context, state) {
          if (state is MoneyLoading && widget.ideaId != null) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Title Section
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
                              hintText: 'Enter your idea title',
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
                              if (widget.ideaId == null) {
                                _slugController.text = _generateSlug(value);
                              }
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _slugController,
                            decoration: const InputDecoration(
                              labelText: 'Slug *',
                              hintText: 'idea-slug-url',
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
                              labelText: 'Description',
                              hintText: 'Brief description of your idea (optional)',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 3,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Document Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Idea Details',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _documentController,
                            decoration: const InputDecoration(
                              labelText: 'Document *',
                              hintText: 'Detailed description of your idea...',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 10,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Document is required';
                              }
                              if (value.trim().length < 10) {
                                return 'Document must be at least 10 characters';
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
                            subtitle: const Text('Mark this idea as featured'),
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
                            subtitle: const Text('Make this idea visible in lists'),
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
                            subtitle: const Text('Make this idea publicly accessible'),
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
                          onPressed: state is MoneyLoading
                              ? null
                              : () => _saveIdea(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: state is MoneyLoading
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
                              : Text(widget.ideaId == null ? 'Create Idea' : 'Update Idea'),
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

  void _populateForm(idea) {
    _titleController.text = idea.title;
    _slugController.text = idea.slug;
    _descriptionController.text = idea.description ?? '';
    _documentController.text = idea.document;
    _featured = idea.featured;
    _visible = idea.visible;
    _public = idea.public;
    _order = idea.order;
  }

  void _saveIdea() {
    if (_formKey.currentState!.validate()) {
      if (widget.ideaId == null) {
        // Create new idea
        context.read<MoneyBloc>().add(CreateIdeaRequested(
          title: _titleController.text.trim(),
          slug: _slugController.text.trim(),
          description: _descriptionController.text.trim().isEmpty
              ? null
              : _descriptionController.text.trim(),
          document: _documentController.text.trim(),
          featured: _featured,
          visible: _visible,
          public: _public,
          order: _order,
        ));
      } else {
        // Update existing idea
        context.read<MoneyBloc>().add(UpdateIdeaRequested(
          id: widget.ideaId!,
          title: _titleController.text.trim(),
          slug: _slugController.text.trim(),
          description: _descriptionController.text.trim().isEmpty
              ? null
              : _descriptionController.text.trim(),
          document: _documentController.text.trim(),
          featured: _featured,
          visible: _visible,
          public: _public,
          order: _order,
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
