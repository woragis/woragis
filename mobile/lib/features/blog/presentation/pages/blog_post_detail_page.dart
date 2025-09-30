import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/blog_bloc.dart';

class BlogPostDetailPage extends StatefulWidget {
  final String postId;

  const BlogPostDetailPage({
    super.key,
    required this.postId,
  });

  @override
  State<BlogPostDetailPage> createState() => _BlogPostDetailPageState();
}

class _BlogPostDetailPageState extends State<BlogPostDetailPage> {
  bool _isEditing = false;
  late TextEditingController _titleController;
  late TextEditingController _excerptController;
  late TextEditingController _contentController;
  late TextEditingController _featuredImageController;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _excerptController = TextEditingController();
    _contentController = TextEditingController();
    _featuredImageController = TextEditingController();

    // Load the specific blog post
    context.read<BlogBloc>().add(GetBlogPostByIdRequested(widget.postId));
  }

  @override
  void dispose() {
    _titleController.dispose();
    _excerptController.dispose();
    _contentController.dispose();
    _featuredImageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blog Post'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              onPressed: () => context.go('/blog/${widget.postId}/edit'),
              icon: const Icon(Icons.edit),
            )
          else
            TextButton(
              onPressed: () {
                setState(() {
                  _isEditing = false;
                });
                // Reset form to original values
                context.read<BlogBloc>().add(GetBlogPostByIdRequested(widget.postId));
              },
              child: const Text('Cancel'),
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
          } else if (state is BlogPostUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Blog post updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _isEditing = false;
            });
          } else if (state is ViewCountIncremented) {
            // Silently handle view count increment
          }
        },
        builder: (context, state) {
          if (state is BlogLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is BlogError) {
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
                    'Error loading blog post',
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
                      context.read<BlogBloc>().add(GetBlogPostByIdRequested(widget.postId));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is BlogPostLoaded) {
            final post = state.post;
            
            // Increment view count when post is loaded
            if (!_isEditing) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                context.read<BlogBloc>().add(IncrementViewCountRequested(widget.postId));
              });
            }
            
            // Populate controllers if not already done
            if (_titleController.text.isEmpty) {
              _titleController.text = post.title;
              _excerptController.text = post.excerpt;
              _contentController.text = post.content;
              _featuredImageController.text = post.featuredImage ?? '';
            }

            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Featured image
                  if (post.featuredImage != null || _isEditing)
                    Container(
                      height: 250,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        image: post.featuredImage != null
                            ? DecorationImage(
                                image: NetworkImage(post.featuredImage!),
                                fit: BoxFit.cover,
                              )
                            : null,
                        color: post.featuredImage == null ? Colors.grey.shade200 : null,
                      ),
                      child: post.featuredImage == null && _isEditing
                          ? const Center(
                              child: Icon(
                                Icons.image,
                                size: 48,
                                color: Colors.grey,
                              ),
                            )
                          : Stack(
                              children: [
                                if (post.featured)
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
                                if (!post.published)
                                  Positioned(
                                    top: 16,
                                    left: 16,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.orange.shade100,
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Text(
                                        'Draft',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.orange.shade800,
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
                                      backgroundColor: Colors.green.shade600,
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
                                      style: const TextStyle(
                                        fontSize: 28,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    )
                                  : Text(
                                      post.title,
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
                              color: post.visible ? Colors.green : Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              post.visible ? 'Visible' : 'Hidden',
                              style: TextStyle(
                                fontSize: 12,
                                color: post.visible ? Colors.green : Colors.grey,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Icon(
                              Icons.public,
                              size: 16,
                              color: post.public ? Colors.blue : Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              post.public ? 'Public' : 'Private',
                              style: TextStyle(
                                fontSize: 12,
                                color: post.public ? Colors.blue : Colors.grey,
                              ),
                            ),
                            const Spacer(),
                            if (post.readingTime != null) ...[
                              Icon(
                                Icons.schedule,
                                size: 16,
                                color: Colors.blue.shade600,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${post.readingTime} min read',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.blue.shade600,
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Excerpt Section
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Excerpt',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                _isEditing
                                    ? TextField(
                                        controller: _excerptController,
                                        decoration: const InputDecoration(
                                          labelText: 'Excerpt',
                                          border: OutlineInputBorder(),
                                        ),
                                        maxLines: 3,
                                      )
                                    : Text(
                                        post.excerpt,
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

                        // Tags Section
                        if (post.tags != null && post.tags!.isNotEmpty) ...[
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
                                  const SizedBox(height: 12),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: post.tags!.map((tag) {
                                      return Chip(
                                        label: Text(tag.name),
                                        backgroundColor: Colors.green.shade50,
                                        labelStyle: TextStyle(
                                          color: Colors.green.shade700,
                                          fontWeight: FontWeight.w500,
                                        ),
                                        onDeleted: _isEditing ? () {
                                          // TODO: Remove tag from post
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(
                                              content: Text('Tag removal not implemented yet'),
                                            ),
                                          );
                                        } : null,
                                      );
                                    }).toList(),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

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
                                const SizedBox(height: 8),
                                _isEditing
                                    ? TextField(
                                        controller: _contentController,
                                        decoration: const InputDecoration(
                                          labelText: 'Content',
                                          border: OutlineInputBorder(),
                                        ),
                                        maxLines: 20,
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
                                          post.content,
                                          style: TextStyle(
                                            color: Colors.grey.shade700,
                                            fontSize: 14,
                                            height: 1.6,
                                          ),
                                        ),
                                      ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Featured Image Section
                        if (_isEditing) ...[
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
                                  TextField(
                                    controller: _featuredImageController,
                                    decoration: const InputDecoration(
                                      labelText: 'Featured Image URL',
                                      hintText: 'https://example.com/image.jpg',
                                      border: OutlineInputBorder(),
                                    ),
                                    onChanged: (value) {
                                      setState(() {});
                                    },
                                  ),
                                  if (_featuredImageController.text.isNotEmpty) ...[
                                    const SizedBox(height: 12),
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        _featuredImageController.text,
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
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

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
                                _buildMetadataRow('Slug', post.slug),
                                _buildMetadataRow('Order', post.order.toString()),
                                _buildMetadataRow('Created', _formatFullDate(post.createdAt)),
                                _buildMetadataRow('Updated', _formatFullDate(post.updatedAt)),
                                if (post.publishedAt != null)
                                  _buildMetadataRow('Published', _formatFullDate(post.publishedAt!)),
                                if (post.viewCount != null)
                                  _buildMetadataRow('Views', post.viewCount.toString()),
                                if (post.likeCount != null)
                                  _buildMetadataRow('Likes', post.likeCount.toString()),
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
                                  onPressed: () => _savePost(),
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

  void _savePost() {
    context.read<BlogBloc>().add(UpdateBlogPostRequested(
      id: widget.postId,
      title: _titleController.text.trim(),
      excerpt: _excerptController.text.trim(),
      content: _contentController.text.trim(),
      featuredImage: _featuredImageController.text.trim().isEmpty
          ? null
          : _featuredImageController.text.trim(),
    ));
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Blog Post'),
        content: const Text(
          'Are you sure you want to delete this blog post? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<BlogBloc>().add(DeleteBlogPostRequested(widget.postId));
              context.pop(); // Go back to blog posts list
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
