import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/money_bloc.dart';
import '../../domain/entities/idea_entity.dart';

class IdeaCanvasPage extends StatefulWidget {
  final String ideaId;

  const IdeaCanvasPage({
    super.key,
    required this.ideaId,
  });

  @override
  State<IdeaCanvasPage> createState() => _IdeaCanvasPageState();
}

class _IdeaCanvasPageState extends State<IdeaCanvasPage> {
  final TransformationController _transformationController = TransformationController();
  String? _selectedNodeId;

  @override
  void initState() {
    super.initState();
    // Load the specific idea
    context.read<MoneyBloc>().add(GetIdeaByIdRequested(widget.ideaId));
  }

  @override
  void dispose() {
    _transformationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Idea Canvas'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => _showAddNodeDialog(),
            icon: const Icon(Icons.add),
          ),
          IconButton(
            onPressed: () => _showCanvasSettings(),
            icon: const Icon(Icons.settings),
          ),
        ],
      ),
      body: BlocBuilder<MoneyBloc, MoneyState>(
        builder: (context, state) {
          if (state is MoneyLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is MoneyError) {
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
                    'Error loading canvas',
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
                      context.read<MoneyBloc>().add(GetIdeaByIdRequested(widget.ideaId));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is IdeaLoaded) {
            return _buildCanvas(state.idea);
          }

          return const Center(
            child: Text('No canvas data available'),
          );
        },
      ),
    );
  }

  Widget _buildCanvas(IdeaEntity idea) {
    return Stack(
      children: [
        // Canvas background
        Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            image: DecorationImage(
              image: NetworkImage('data:image/svg+xml;base64,${_getGridPattern()}'),
              repeat: ImageRepeat.repeat,
              opacity: 0.1,
            ),
          ),
        ),

        // Interactive canvas
        InteractiveViewer(
          transformationController: _transformationController,
          minScale: 0.5,
          maxScale: 3.0,
          child: Container(
            width: 2000,
            height: 2000,
            child: Stack(
              children: [
                // Sample nodes (in a real implementation, these would come from the backend)
                ..._buildSampleNodes(),
                
                // Connections between nodes
                ..._buildConnections(),
              ],
            ),
          ),
        ),

        // Canvas controls
        Positioned(
          bottom: 16,
          right: 16,
          child: Column(
            children: [
              FloatingActionButton.small(
                onPressed: _zoomIn,
                heroTag: 'zoom_in',
                child: const Icon(Icons.zoom_in),
              ),
              const SizedBox(height: 8),
              FloatingActionButton.small(
                onPressed: _zoomOut,
                heroTag: 'zoom_out',
                child: const Icon(Icons.zoom_out),
              ),
              const SizedBox(height: 8),
              FloatingActionButton.small(
                onPressed: _resetView,
                heroTag: 'reset',
                child: const Icon(Icons.center_focus_strong),
              ),
            ],
          ),
        ),

        // Canvas info
        Positioned(
          bottom: 16,
          left: 16,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Canvas Info',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Nodes: ${_getSampleNodes().length}',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade600,
                  ),
                ),
                Text(
                  'Connections: ${_getSampleConnections().length}',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade600,
                  ),
                ),
                if (_selectedNodeId != null)
                  Text(
                    'Selected: Node $_selectedNodeId',
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.blue.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  List<Widget> _buildSampleNodes() {
    final nodes = _getSampleNodes();
    return nodes.map((node) => _buildNode(node)).toList();
  }

  Widget _buildNode(Map<String, dynamic> nodeData) {
    final isSelected = _selectedNodeId == nodeData['id'];
    
    return Positioned(
      left: nodeData['x'],
      top: nodeData['y'],
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedNodeId = nodeData['id'];
          });
        },
        onDoubleTap: () => _showEditNodeDialog(nodeData),
        child: Container(
          width: nodeData['width'],
          height: nodeData['height'],
          decoration: BoxDecoration(
            color: isSelected ? Colors.blue.shade50 : Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? Colors.blue.shade300 : Colors.grey.shade300,
              width: isSelected ? 2 : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: nodeData['color'],
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        nodeData['type'],
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const Spacer(),
                    if (isSelected)
                      Icon(
                        Icons.edit,
                        size: 16,
                        color: Colors.blue.shade600,
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  nodeData['title'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (nodeData['content'] != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    nodeData['content'],
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _buildConnections() {
    final connections = _getSampleConnections();
    return connections.map((connection) => _buildConnection(connection)).toList();
  }

  Widget _buildConnection(Map<String, dynamic> connection) {
    // This is a simplified connection visualization
    // In a real implementation, you'd use CustomPainter for smooth curves
    return Positioned(
      left: connection['startX'],
      top: connection['startY'],
      child: Container(
        width: connection['width'],
        height: 2,
        decoration: BoxDecoration(
          color: Colors.blue.shade300,
          borderRadius: BorderRadius.circular(1),
        ),
      ),
    );
  }

  List<Map<String, dynamic>> _getSampleNodes() {
    return [
      {
        'id': 'node1',
        'title': 'Market Research',
        'content': 'Identify target audience and market size',
        'type': 'Research',
        'color': Colors.green,
        'x': 100.0,
        'y': 100.0,
        'width': 200.0,
        'height': 120.0,
      },
      {
        'id': 'node2',
        'title': 'Product Development',
        'content': 'Build MVP and core features',
        'type': 'Development',
        'color': Colors.blue,
        'x': 400.0,
        'y': 150.0,
        'width': 200.0,
        'height': 120.0,
      },
      {
        'id': 'node3',
        'title': 'Marketing Strategy',
        'content': 'Define go-to-market approach',
        'type': 'Marketing',
        'color': Colors.orange,
        'x': 700.0,
        'y': 100.0,
        'width': 200.0,
        'height': 120.0,
      },
      {
        'id': 'node4',
        'title': 'Revenue Model',
        'content': 'Subscription, one-time, or freemium',
        'type': 'Business',
        'color': Colors.purple,
        'x': 250.0,
        'y': 350.0,
        'width': 200.0,
        'height': 120.0,
      },
    ];
  }

  List<Map<String, dynamic>> _getSampleConnections() {
    return [
      {
        'startX': 300.0,
        'startY': 160.0,
        'endX': 400.0,
        'endY': 160.0,
        'width': 100.0,
      },
      {
        'startX': 600.0,
        'startY': 160.0,
        'endX': 700.0,
        'endY': 160.0,
        'width': 100.0,
      },
    ];
  }

  String _getGridPattern() {
    // Simple SVG grid pattern
    return Uri.encodeComponent('''
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cccccc" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    ''');
  }

  void _zoomIn() {
    final currentScale = _transformationController.value.getMaxScaleOnAxis();
    _transformationController.value = Matrix4.identity()
      ..scale(currentScale * 1.2);
  }

  void _zoomOut() {
    final currentScale = _transformationController.value.getMaxScaleOnAxis();
    _transformationController.value = Matrix4.identity()
      ..scale(currentScale / 1.2);
  }

  void _resetView() {
    _transformationController.value = Matrix4.identity();
  }

  void _showAddNodeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Node'),
        content: const Text('Node creation functionality will be implemented in a future update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showEditNodeDialog(Map<String, dynamic> nodeData) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Node'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Title: ${nodeData['title']}'),
            const SizedBox(height: 8),
            Text('Type: ${nodeData['type']}'),
            const SizedBox(height: 8),
            Text('Content: ${nodeData['content'] ?? 'No content'}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showCanvasSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Canvas Settings'),
        content: const Text('Canvas settings will be implemented in a future update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
