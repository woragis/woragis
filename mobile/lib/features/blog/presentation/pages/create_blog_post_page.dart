import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/blog_bloc.dart';

class CreateBlogPostPage extends StatefulWidget {
  final String? postId; // If provided, we're editing an existing post

  const CreateBlogPostPage({
    super.key,
    this.postId,
  });

  @override
  State<CreateBlogPostPage> createState() => _CreateBlogPostPageState();
}

class _CreateBlogPostPageState extends State<CreateBlogPostPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _slugController = TextEditingController();
  final _excerptController = TextEditingController();
  final _contentController = TextEditingController();
  final _featuredImageController = TextEditingController();
  final _readingTimeController = TextEditingController();
  
  bool _featured = false;
  bool _published = false;
  bool _visible = true;
  bool _public = true;
  int _order = 0;
  String _featuredImageUrl = '';
  List<String> _selectedTagIds = [];

  @override
  void initState() {
    super.initState();
    
    // If editing an existing post, load its data
    if (widget.postId != null) {
      context.read<BlogBloc>().add(GetBlogPostByIdRequested(widget.postId!));
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _slugController.dispose();
    _excerptController.dispose();
    _contentController.dispose();
    _featuredImageController.dispose();
    _readingTimeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.postId == null ? 'Create Blog Post' : 'Edit Blog Post'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (widget.postId != null)
            IconButton(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.close),
            ),
        ],
      ),
      body: BlocConsumer<BlogBloc, BlogState>(
        listener: (context, state) {
          if (state is BlogError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is BlogPostCreated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Blog post created successfully'),
                backgroundColor: Colors.green,
              ),
            );
            context.push('/blog');
          } else if (state is BlogPostLoaded && widget.postId != null) {
            // Populate form with existing post data
            _populateForm(state.post);
          }
        },
        builder: (context, state) {
          if (state is BlogLoading && widget.postId != null) {
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
                              hintText: 'Enter your blog post title',
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
                              if (widget.postId == null) {
                                _slugController.text = _generateSlug(value);
                              }
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _slugController,
                            decoration: const InputDecoration(
                              labelText: 'Slug *',
                              hintText: 'blog-post-slug-url',
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
                            controller: _excerptController,
                            decoration: const InputDecoration(
                              labelText: 'Excerpt *',
                              hintText: 'Brief description of your blog post',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 3,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Excerpt is required';
                              }
                              if (value.trim().length < 10) {
                                return 'Excerpt must be at least 10 characters';
                              }
                              return null;
                            },
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
                            'Content',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _contentController,
                            decoration: const InputDecoration(
                              labelText: 'Content *',
                              hintText: 'Write your blog post content here...',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 15,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Content is required';
                              }
                              if (value.trim().length < 50) {
                                return 'Content must be at least 50 characters';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _readingTimeController,
                            decoration: const InputDecoration(
                              labelText: 'Reading Time (minutes)',
                              hintText: '5',
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.number,
                            onChanged: (value) {
                              // Auto-calculate reading time based on content
                              if (value.isEmpty && _contentController.text.isNotEmpty) {
                                final wordCount = _contentController.text.split(' ').length;
                                final estimatedTime = (wordCount / 200).ceil(); // 200 words per minute
                                _readingTimeController.text = estimatedTime.toString();
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Featured Image Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Featured Image',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _featuredImageController,
                            decoration: const InputDecoration(
                              labelText: 'Featured Image URL',
                              hintText: 'https://example.com/image.jpg',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (value) => _featuredImageUrl = value,
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 12),
                          if (_featuredImageUrl.isNotEmpty)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                _featuredImageUrl,
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

                  // Tags Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Tags',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Select tags for your blog post',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 16),
                          // TODO: Add tag selection chips
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: const Text(
                              'Tag selection will be implemented soon',
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
                            subtitle: const Text('Mark this post as featured'),
                            value: _featured,
                            onChanged: (value) {
                              setState(() {
                                _featured = value;
                              });
                            },
                            activeColor: Colors.amber,
                          ),
                          SwitchListTile(
                            title: const Text('Published'),
                            subtitle: const Text('Publish this post immediately'),
                            value: _published,
                            onChanged: (value) {
                              setState(() {
                                _published = value;
                              });
                            },
                            activeColor: Colors.green,
                          ),
                          SwitchListTile(
                            title: const Text('Visible'),
                            subtitle: const Text('Make this post visible in lists'),
                            value: _visible,
                            onChanged: (value) {
                              setState(() {
                                _visible = value;
                              });
                            },
                            activeColor: Colors.blue,
                          ),
                          SwitchListTile(
                            title: const Text('Public'),
                            subtitle: const Text('Make this post publicly accessible'),
                            value: _public,
                            onChanged: (value) {
                              setState(() {
                                _public = value;
                              });
                            },
                            activeColor: Colors.purple,
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

                  // Preview Section
                  if (_titleController.text.isNotEmpty || _excerptController.text.isNotEmpty)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Preview',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            if (_featuredImageUrl.isNotEmpty) ...[
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.network(
                                  _featuredImageUrl,
                                  height: 150,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(
                                      height: 150,
                                      color: Colors.grey.shade200,
                                      child: const Center(
                                        child: Text('Invalid image URL'),
                                      ),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: 16),
                            ],
                            Text(
                              _titleController.text.isEmpty
                                  ? 'Your Blog Post Title'
                                  : _titleController.text,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _excerptController.text.isEmpty
                                  ? 'Your blog post excerpt will appear here...'
                                  : _excerptController.text,
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                if (_featured)
                                  Container(
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
                                        fontSize: 10,
                                        color: Colors.amber.shade800,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                if (_featured && !_published)
                                  const SizedBox(width: 8),
                                if (!_published)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.orange.shade100,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      'Draft',
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: Colors.orange.shade800,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                              ],
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
                          onPressed: state is BlogLoading
                              ? null
                              : () => _savePost(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: state is BlogLoading
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
                              : Text(widget.postId == null ? 'Create Post' : 'Update Post'),
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

  void _populateForm(post) {
    _titleController.text = post.title;
    _slugController.text = post.slug;
    _excerptController.text = post.excerpt;
    _contentController.text = post.content;
    _featuredImageController.text = post.featuredImage ?? '';
    _featuredImageUrl = post.featuredImage ?? '';
    _readingTimeController.text = post.readingTime?.toString() ?? '';
    _featured = post.featured;
    _published = post.published;
    _visible = post.visible;
    _public = post.public;
    _order = post.order;
    _selectedTagIds = post.tags?.map((t) => t.id).toList() ?? [];
  }

  void _savePost() {
    if (_formKey.currentState!.validate()) {
      if (widget.postId == null) {
        // Create new post
        context.read<BlogBloc>().add(CreateBlogPostRequested(
          title: _titleController.text.trim(),
          slug: _slugController.text.trim(),
          excerpt: _excerptController.text.trim(),
          content: _contentController.text.trim(),
          featuredImage: _featuredImageController.text.trim().isEmpty
              ? null
              : _featuredImageController.text.trim(),
          readingTime: _readingTimeController.text.trim().isEmpty
              ? null
              : int.tryParse(_readingTimeController.text.trim()),
          featured: _featured,
          published: _published,
          visible: _visible,
          public: _public,
          order: _order,
        ));
      } else {
        // Update existing post
        context.read<BlogBloc>().add(UpdateBlogPostRequested(
          id: widget.postId!,
          title: _titleController.text.trim(),
          slug: _slugController.text.trim(),
          excerpt: _excerptController.text.trim(),
          content: _contentController.text.trim(),
          featuredImage: _featuredImageController.text.trim().isEmpty
              ? null
              : _featuredImageController.text.trim(),
          readingTime: _readingTimeController.text.trim().isEmpty
              ? null
              : int.tryParse(_readingTimeController.text.trim()),
          featured: _featured,
          published: _published,
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
