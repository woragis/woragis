import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/experience_bloc.dart';

class ExperienceOrderingPage extends StatefulWidget {
  const ExperienceOrderingPage({super.key});

  @override
  State<ExperienceOrderingPage> createState() => _ExperienceOrderingPageState();
}

class _ExperienceOrderingPageState extends State<ExperienceOrderingPage> {
  List<dynamic> _experiences = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Load experience list for ordering
    context.read<ExperienceBloc>().add(GetExperienceListRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reorder Experiences'),
        backgroundColor: Colors.indigo.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (_experiences.isNotEmpty)
            TextButton(
              onPressed: _isLoading ? null : _saveOrder,
              child: Text(
                'Save Order',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: BlocConsumer<ExperienceBloc, ExperienceState>(
        listener: (context, state) {
          if (state is ExperienceError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
            setState(() {
              _isLoading = false;
            });
          } else if (state is ExperienceListLoaded) {
            setState(() {
              _experiences = List.from(state.experiences);
              // Sort by order
              _experiences.sort((a, b) => a.order.compareTo(b.order));
            });
          } else if (state is ExperienceOrderUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Experience order updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _isLoading = false;
            });
            context.push('/experience');
          }
        },
        builder: (context, state) {
          if (state is ExperienceLoading && !_isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (_experiences.isEmpty) {
            return _buildEmptyState();
          }

          return Column(
            children: [
              // Instructions
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                color: Colors.blue.shade50,
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.blue.shade600),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Drag and drop to reorder your experiences. The order will be displayed on your portfolio.',
                        style: TextStyle(
                          color: Colors.blue.shade700,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              // Reorderable List
              Expanded(
                child: ReorderableListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _experiences.length,
                  onReorder: _onReorder,
                  itemBuilder: (context, index) {
                    final experience = _experiences[index];
                    return Card(
                      key: ValueKey(experience.id),
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.indigo.shade100,
                          child: Text(
                            '${index + 1}',
                            style: TextStyle(
                              color: Colors.indigo.shade600,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        title: Text(
                          experience.title,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        subtitle: Text(
                          '${experience.company} • ${experience.period}',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                          ),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (!experience.visible)
                              Icon(
                                Icons.visibility_off,
                                color: Colors.grey.shade400,
                                size: 16,
                              ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.drag_handle,
                              color: Colors.grey.shade400,
                            ),
                          ],
                        ),
                        isThreeLine: false,
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: _experiences.isNotEmpty
          ? FloatingActionButton(
              onPressed: _isLoading ? null : _saveOrder,
              backgroundColor: Colors.indigo.shade600,
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Icon(Icons.save, color: Colors.white),
            )
          : null,
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.work_outline,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'No experiences to reorder',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Add some experiences first to reorder them',
            style: TextStyle(
              color: Colors.grey.shade500,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.push('/experience/create'),
            icon: const Icon(Icons.add),
            label: const Text('Add Experience'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo.shade600,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  void _onReorder(int oldIndex, int newIndex) {
    setState(() {
      if (oldIndex < newIndex) {
        newIndex -= 1;
      }
      final item = _experiences.removeAt(oldIndex);
      _experiences.insert(newIndex, item);
      
      // Update the order field for each experience
      for (int i = 0; i < _experiences.length; i++) {
        _experiences[i] = _experiences[i].copyWith(order: i + 1);
      }
    });
  }

  void _saveOrder() {
    setState(() {
      _isLoading = true;
    });

    // Create the order update data
    final experienceOrders = _experiences.map((exp) => {
      'id': exp.id,
      'order': exp.order,
    }).toList();

    context.read<ExperienceBloc>().add(UpdateExperienceOrderRequested(experienceOrders));
  }
}
