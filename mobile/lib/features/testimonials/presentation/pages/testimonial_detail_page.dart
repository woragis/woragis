import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/testimonials_bloc.dart';

class TestimonialDetailPage extends StatefulWidget {
  final String testimonialId;

  const TestimonialDetailPage({
    super.key,
    required this.testimonialId,
  });

  @override
  State<TestimonialDetailPage> createState() => _TestimonialDetailPageState();
}

class _TestimonialDetailPageState extends State<TestimonialDetailPage> {
  bool _isEditing = false;
  late TextEditingController _nameController;
  late TextEditingController _positionController;
  late TextEditingController _companyController;
  late TextEditingController _contentController;
  late TextEditingController _avatarController;
  int _rating = 5;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _positionController = TextEditingController();
    _companyController = TextEditingController();
    _contentController = TextEditingController();
    _avatarController = TextEditingController();

    // Load the specific testimonial
    context.read<TestimonialsBloc>().add(GetTestimonialByIdRequested(widget.testimonialId));
  }

  @override
  void dispose() {
    _nameController.dispose();
    _positionController.dispose();
    _companyController.dispose();
    _contentController.dispose();
    _avatarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Testimonial'),
        backgroundColor: Colors.purple.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              onPressed: () => context.go('/testimonials/${widget.testimonialId}/edit'),
              icon: const Icon(Icons.edit),
            )
          else
            TextButton(
              onPressed: () {
                setState(() {
                  _isEditing = false;
                });
                // Reset form to original values
                context.read<TestimonialsBloc>().add(GetTestimonialByIdRequested(widget.testimonialId));
              },
              child: const Text('Cancel'),
            ),
        ],
      ),
      body: BlocConsumer<TestimonialsBloc, TestimonialsState>(
        listener: (context, state) {
          if (state is TestimonialsError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is TestimonialUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Testimonial updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _isEditing = false;
            });
          }
        },
        builder: (context, state) {
          if (state is TestimonialsLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is TestimonialsError) {
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
                    'Error loading testimonial',
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
                      context.read<TestimonialsBloc>().add(GetTestimonialByIdRequested(widget.testimonialId));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is TestimonialLoaded) {
            final testimonial = state.testimonial;
            
            // Populate controllers if not already done
            if (_nameController.text.isEmpty) {
              _nameController.text = testimonial.name;
              _positionController.text = testimonial.position;
              _companyController.text = testimonial.company;
              _contentController.text = testimonial.content;
              _avatarController.text = testimonial.avatar ?? '';
              _rating = testimonial.rating;
            }

            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Section with Avatar
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Colors.purple.shade600,
                          Colors.purple.shade800,
                        ],
                      ),
                    ),
                    child: Column(
                      children: [
                        // Avatar
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 50,
                              backgroundColor: Colors.white,
                              backgroundImage: testimonial.avatar != null
                                  ? NetworkImage(testimonial.avatar!)
                                  : null,
                              child: testimonial.avatar == null
                                  ? Text(
                                      testimonial.name.isNotEmpty
                                          ? testimonial.name[0].toUpperCase()
                                          : 'T',
                                      style: TextStyle(
                                        color: Colors.purple.shade700,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 32,
                                      ),
                                    )
                                  : null,
                            ),
                            if (_isEditing)
                              Positioned(
                                bottom: 0,
                                right: 0,
                                child: FloatingActionButton.small(
                                  onPressed: () {
                                    // TODO: Implement image picker
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Image picker not implemented yet'),
                                      ),
                                    );
                                  },
                                  backgroundColor: Colors.white,
                                  child: const Icon(Icons.camera_alt, color: Colors.purple),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        
                        // Name and Rating
                        Text(
                          testimonial.name,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        
                        if (!_isEditing)
                          _buildRatingStars(testimonial.rating, size: 24)
                        else
                          _buildRatingSelector(),
                        
                        // Status badges
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (testimonial.featured)
                              Container(
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
                          ],
                        ),
                      ],
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Position and Company
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Professional Information',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                _isEditing
                                    ? Column(
                                        children: [
                                          TextField(
                                            controller: _positionController,
                                            decoration: const InputDecoration(
                                              labelText: 'Position',
                                              border: OutlineInputBorder(),
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          TextField(
                                            controller: _companyController,
                                            decoration: const InputDecoration(
                                              labelText: 'Company',
                                              border: OutlineInputBorder(),
                                            ),
                                          ),
                                        ],
                                      )
                                    : Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            testimonial.position,
                                            style: TextStyle(
                                              fontSize: 16,
                                              color: Colors.grey.shade700,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            testimonial.company,
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: Colors.grey.shade600,
                                            ),
                                          ),
                                        ],
                                      ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Testimonial Content
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Testimonial',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                _isEditing
                                    ? TextField(
                                        controller: _contentController,
                                        decoration: const InputDecoration(
                                          labelText: 'Content',
                                          border: OutlineInputBorder(),
                                        ),
                                        maxLines: 6,
                                      )
                                    : Container(
                                        width: double.infinity,
                                        padding: const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          color: Colors.grey.shade50,
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: Colors.grey.shade300),
                                        ),
                                        child: Text(
                                          testimonial.content,
                                          style: TextStyle(
                                            color: Colors.grey.shade700,
                                            fontSize: 16,
                                            fontStyle: FontStyle.italic,
                                            height: 1.6,
                                          ),
                                        ),
                                      ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Avatar URL Section (Edit Mode)
                        if (_isEditing)
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Avatar',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  TextField(
                                    controller: _avatarController,
                                    decoration: const InputDecoration(
                                      labelText: 'Avatar URL',
                                      hintText: 'https://example.com/avatar.jpg',
                                      border: OutlineInputBorder(),
                                    ),
                                    onChanged: (value) {
                                      setState(() {});
                                    },
                                  ),
                                  if (_avatarController.text.isNotEmpty) ...[
                                    const SizedBox(height: 12),
                                    Center(
                                      child: CircleAvatar(
                                        radius: 40,
                                        backgroundColor: Colors.grey.shade300,
                                        backgroundImage: NetworkImage(_avatarController.text),
                                        onBackgroundImageError: (exception, stackTrace) {
                                          // Handle image error
                                        },
                                      ),
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
                                _buildMetadataRow('Order', testimonial.order.toString()),
                                _buildMetadataRow('Created', _formatFullDate(testimonial.createdAt)),
                                _buildMetadataRow('Updated', _formatFullDate(testimonial.updatedAt)),
                                _buildMetadataRow('Visible', testimonial.visible ? 'Yes' : 'No'),
                                _buildMetadataRow('Public', testimonial.public ? 'Yes' : 'No'),
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
                                  onPressed: () => _saveTestimonial(),
                                  icon: const Icon(Icons.save),
                                  label: const Text('Save Changes'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.purple.shade600,
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

  Widget _buildRatingStars(int rating, {double size = 16}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Icon(
          index < rating ? Icons.star : Icons.star_border,
          size: size,
          color: Colors.amber,
        );
      }),
    );
  }

  Widget _buildRatingSelector() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        final rating = index + 1;
        return IconButton(
          onPressed: () {
            setState(() {
              _rating = rating;
            });
          },
          icon: Icon(
            rating <= _rating ? Icons.star : Icons.star_border,
            color: Colors.amber,
            size: 32,
          ),
        );
      }),
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

  void _saveTestimonial() {
    context.read<TestimonialsBloc>().add(UpdateTestimonialRequested(
      id: widget.testimonialId,
      name: _nameController.text.trim(),
      position: _positionController.text.trim(),
      company: _companyController.text.trim(),
      content: _contentController.text.trim(),
      avatar: _avatarController.text.trim().isEmpty
          ? null
          : _avatarController.text.trim(),
      rating: _rating,
    ));
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Testimonial'),
        content: const Text(
          'Are you sure you want to delete this testimonial? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<TestimonialsBloc>().add(DeleteTestimonialRequested(widget.testimonialId));
              context.pop(); // Go back to testimonials list
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
