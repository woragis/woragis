import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/testimonials_bloc.dart';

class CreateTestimonialPage extends StatefulWidget {
  final String? testimonialId; // If provided, we're editing an existing testimonial

  const CreateTestimonialPage({
    super.key,
    this.testimonialId,
  });

  @override
  State<CreateTestimonialPage> createState() => _CreateTestimonialPageState();
}

class _CreateTestimonialPageState extends State<CreateTestimonialPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _positionController = TextEditingController();
  final _companyController = TextEditingController();
  final _contentController = TextEditingController();
  final _avatarController = TextEditingController();
  
  bool _featured = false;
  bool _visible = true;
  bool _public = true;
  int _order = 0;
  int _rating = 5;
  String _avatarUrl = '';

  @override
  void initState() {
    super.initState();
    
    // If editing an existing testimonial, load its data
    if (widget.testimonialId != null) {
      context.read<TestimonialsBloc>().add(GetTestimonialByIdRequested(widget.testimonialId!));
    }
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
        title: Text(widget.testimonialId == null ? 'Create Testimonial' : 'Edit Testimonial'),
        backgroundColor: Colors.purple.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (widget.testimonialId != null)
            IconButton(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.close),
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
          } else if (state is TestimonialCreated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Testimonial created successfully'),
                backgroundColor: Colors.green,
              ),
            );
            context.go('/testimonials');
          } else if (state is TestimonialLoaded && widget.testimonialId != null) {
            // Populate form with existing testimonial data
            _populateForm(state.testimonial);
          }
        },
        builder: (context, state) {
          if (state is TestimonialsLoading && widget.testimonialId != null) {
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
                            'Client Information',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              labelText: 'Name *',
                              hintText: 'Enter client name',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Name is required';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _positionController,
                            decoration: const InputDecoration(
                              labelText: 'Position *',
                              hintText: 'e.g., CEO, Marketing Manager',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Position is required';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _companyController,
                            decoration: const InputDecoration(
                              labelText: 'Company *',
                              hintText: 'Enter company name',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Company is required';
                              }
                              return null;
                            },
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
                            'Testimonial Content',
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
                              hintText: 'Enter the testimonial content...',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 6,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Content is required';
                              }
                              if (value.trim().length < 10) {
                                return 'Content must be at least 10 characters';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Rating Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Rating',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Center(
                            child: Column(
                              children: [
                                Row(
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
                                        size: 40,
                                      ),
                                    );
                                  }),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  '$_rating out of 5 stars',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Avatar Section
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
                          TextFormField(
                            controller: _avatarController,
                            decoration: const InputDecoration(
                              labelText: 'Avatar URL',
                              hintText: 'https://example.com/avatar.jpg',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (value) => _avatarUrl = value,
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
                          if (_avatarUrl.isNotEmpty)
                            Center(
                              child: CircleAvatar(
                                radius: 50,
                                backgroundColor: Colors.grey.shade300,
                                backgroundImage: NetworkImage(_avatarUrl),
                                onBackgroundImageError: (exception, stackTrace) {
                                  // Handle image error
                                },
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
                            subtitle: const Text('Mark this testimonial as featured'),
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
                            subtitle: const Text('Make this testimonial visible in lists'),
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
                            subtitle: const Text('Make this testimonial publicly accessible'),
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

                  // Preview Section
                  if (_nameController.text.isNotEmpty || _contentController.text.isNotEmpty)
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
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.purple.shade50,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.purple.shade200),
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 25,
                                        backgroundColor: Colors.purple.shade100,
                                        backgroundImage: _avatarUrl.isNotEmpty
                                            ? NetworkImage(_avatarUrl)
                                            : null,
                                        child: _avatarUrl.isEmpty
                                            ? Text(
                                                _nameController.text.isNotEmpty
                                                    ? _nameController.text[0].toUpperCase()
                                                    : 'T',
                                                style: TextStyle(
                                                  color: Colors.purple.shade700,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              )
                                            : null,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              _nameController.text.isEmpty
                                                  ? 'Client Name'
                                                  : _nameController.text,
                                              style: const TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            Text(
                                              _positionController.text.isEmpty
                                                  ? 'Position'
                                                  : _positionController.text,
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Colors.grey.shade600,
                                              ),
                                            ),
                                            Text(
                                              _companyController.text.isEmpty
                                                  ? 'Company'
                                                  : _companyController.text,
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Colors.grey.shade500,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      _buildRatingStars(_rating),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    _contentController.text.isEmpty
                                        ? 'Testimonial content will appear here...'
                                        : _contentController.text,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey.shade700,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                  if (_featured) ...[
                                    const SizedBox(height: 12),
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: Container(
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
                                    ),
                                  ],
                                ],
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
                          onPressed: state is TestimonialsLoading
                              ? null
                              : () => _saveTestimonial(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.purple.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: state is TestimonialsLoading
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
                              : Text(widget.testimonialId == null ? 'Create Testimonial' : 'Update Testimonial'),
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

  Widget _buildRatingStars(int rating) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Icon(
          index < rating ? Icons.star : Icons.star_border,
          size: 16,
          color: Colors.amber,
        );
      }),
    );
  }

  void _populateForm(testimonial) {
    _nameController.text = testimonial.name;
    _positionController.text = testimonial.position;
    _companyController.text = testimonial.company;
    _contentController.text = testimonial.content;
    _avatarController.text = testimonial.avatar ?? '';
    _avatarUrl = testimonial.avatar ?? '';
    _featured = testimonial.featured;
    _visible = testimonial.visible;
    _public = testimonial.public;
    _order = testimonial.order;
    _rating = testimonial.rating;
  }

  void _saveTestimonial() {
    if (_formKey.currentState!.validate()) {
      if (widget.testimonialId == null) {
        // Create new testimonial
        context.read<TestimonialsBloc>().add(CreateTestimonialRequested(
          name: _nameController.text.trim(),
          position: _positionController.text.trim(),
          company: _companyController.text.trim(),
          content: _contentController.text.trim(),
          avatar: _avatarController.text.trim().isEmpty
              ? null
              : _avatarController.text.trim(),
          rating: _rating,
          featured: _featured,
          visible: _visible,
          public: _public,
          order: _order,
        ));
      } else {
        // Update existing testimonial
        context.read<TestimonialsBloc>().add(UpdateTestimonialRequested(
          id: widget.testimonialId!,
          name: _nameController.text.trim(),
          position: _positionController.text.trim(),
          company: _companyController.text.trim(),
          content: _contentController.text.trim(),
          avatar: _avatarController.text.trim().isEmpty
              ? null
              : _avatarController.text.trim(),
          rating: _rating,
          featured: _featured,
          visible: _visible,
          public: _public,
          order: _order,
        ));
      }
    }
  }
}
