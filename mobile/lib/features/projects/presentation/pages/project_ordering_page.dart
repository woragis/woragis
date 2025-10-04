import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/projects_bloc.dart';

class ProjectOrderingPage extends StatefulWidget {
  const ProjectOrderingPage({super.key});

  @override
  State<ProjectOrderingPage> createState() => _ProjectOrderingPageState();
}

class _ProjectOrderingPageState extends State<ProjectOrderingPage> {
  List<Map<String, dynamic>> _projectOrders = [];
  bool _hasChanges = false;

  @override
  void initState() {
    super.initState();
    // Load projects when page initializes
    context.read<ProjectsBloc>().add(GetProjectsRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reorder Projects'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (_hasChanges)
            TextButton(
              onPressed: _saveOrder,
              child: const Text(
                'Save',
                style: TextStyle(color: Colors.white),
              ),
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
          } else if (state is ProjectsLoaded) {
            // Initialize project orders
            if (_projectOrders.isEmpty) {
              _projectOrders = state.projects.map((project) {
                return {
                  'id': project.id,
                  'order': project.order,
                  'title': project.title,
                  'image': project.image,
                };
              }).toList();
              _projectOrders.sort((a, b) => (a['order'] as int).compareTo(b['order'] as int));
            }
          } else if (state is ProjectOrderUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Project order updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _hasChanges = false;
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
                    'Error loading projects',
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
                      context.read<ProjectsBloc>().add(GetProjectsRequested());
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is ProjectsLoaded) {
            if (state.projects.isEmpty) {
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
                    const Text(
                      'No projects found',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Create some projects first to reorder them.',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => context.push('/projects/create'),
                      child: const Text('Create Project'),
                    ),
                  ],
                ),
              );
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
                      Icon(
                        Icons.info_outline,
                        color: Colors.blue.shade600,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Drag and drop to reorder your projects. The order will be saved automatically.',
                          style: TextStyle(
                            color: Colors.blue.shade700,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Projects list
                Expanded(
                  child: ReorderableListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _projectOrders.length,
                    onReorder: _onReorder,
                    itemBuilder: (context, index) {
                      final project = _projectOrders[index];
                      return _buildProjectItem(project, index);
                    },
                  ),
                ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildProjectItem(Map<String, dynamic> project, int index) {
    return Card(
      key: ValueKey(project['id']),
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          radius: 24,
          backgroundImage: NetworkImage(project['image']),
          backgroundColor: Colors.grey.shade300,
        ),
        title: Text(
          project['title'],
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text('Order: ${index + 1}'),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 8,
                vertical: 4,
              ),
              decoration: BoxDecoration(
                color: Colors.blue.shade100,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '#${index + 1}',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.blue.shade700,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              Icons.drag_handle,
              color: Colors.grey,
            ),
          ],
        ),
        onTap: () => context.push('/projects/${project['id']}'),
      ),
    );
  }

  void _onReorder(int oldIndex, int newIndex) {
    setState(() {
      if (oldIndex < newIndex) {
        newIndex -= 1;
      }
      final item = _projectOrders.removeAt(oldIndex);
      _projectOrders.insert(newIndex, item);
      
      // Update order values
      for (int i = 0; i < _projectOrders.length; i++) {
        _projectOrders[i]['order'] = i;
      }
      
      _hasChanges = true;
    });
  }

  void _saveOrder() {
    context.read<ProjectsBloc>().add(UpdateProjectOrderRequested(_projectOrders));
  }
}
