import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:math' as math;
import '../bloc/money_bloc.dart';
import '../../domain/entities/idea_entity.dart';

class AdvancedIdeaCanvasPage extends StatefulWidget {
  final String ideaId;

  const AdvancedIdeaCanvasPage({
    super.key,
    required this.ideaId,
  });

  @override
  State<AdvancedIdeaCanvasPage> createState() => _AdvancedIdeaCanvasPageState();
}

class _AdvancedIdeaCanvasPageState extends State<AdvancedIdeaCanvasPage> {
  final TransformationController _transformationController = TransformationController();
  String? _selectedNodeId;
  bool _isConnecting = false;
  String? _connectionStartNodeId;

  // Sample node data
  final List<Map<String, dynamic>> _nodes = [
    {
      'id': 'node1',
      'title': 'Market Research',
      'content': 'Identify target audience and market size',
      'type': 'Research',
      'color': Colors.green,
      'position': const Offset(100, 100),
      'size': const Size(200, 120),
    },
    {
      'id': 'node2',
      'title': 'Product Development',
      'content': 'Build MVP and core features',
      'type': 'Development',
      'color': Colors.blue,
      'position': const Offset(400, 150),
      'size': const Size(200, 120),
    },
    {
      'id': 'node3',
      'title': 'Marketing Strategy',
      'content': 'Define go-to-market approach',
      'type': 'Marketing',
      'color': Colors.orange,
      'position': const Offset(700, 100),
      'size': const Size(200, 120),
    },
    {
      'id': 'node4',
      'title': 'Revenue Model',
      'content': 'Subscription, one-time, or freemium',
      'type': 'Business',
      'color': Colors.purple,
      'position': const Offset(250, 350),
      'size': const Size(200, 120),
    },
  ];

  final List<Map<String, dynamic>> _connections = [
    {
      'id': 'conn1',
      'from': 'node1',
      'to': 'node2',
    },
    {
      'id': 'conn2',
      'from': 'node2',
      'to': 'node3',
    },
    {
      'id': 'conn3',
      'from': 'node1',
      'to': 'node4',
    },
  ];

  @override
  void initState() {
    super.initState();
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
        title: const Text('Advanced Idea Canvas'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => _toggleConnectionMode(),
            icon: Icon(
              _isConnecting ? Icons.link_off : Icons.link,
              color: _isConnecting ? Colors.red : Colors.white,
            ),
          ),
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

          return _buildCanvas(null);
        },
      ),
    );
  }

  Widget _buildCanvas(IdeaEntity? idea) {
    return Stack(
      children: [
        // Canvas background with grid
        Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
          ),
          child: CustomPaint(
            painter: GridPainter(),
            size: Size.infinite,
          ),
        ),

        // Interactive canvas
        InteractiveViewer(
          transformationController: _transformationController,
          minScale: 0.3,
          maxScale: 3.0,
          child: SizedBox(
            width: 2000,
            height: 2000,
            child: CustomPaint(
              painter: ConnectionPainter(
                nodes: _nodes,
                connections: _connections,
                selectedNodeId: _selectedNodeId,
                isConnecting: _isConnecting,
                connectionStartNodeId: _connectionStartNodeId,
              ),
              child: Stack(
                children: [
                  // Nodes
                  ..._nodes.map((node) => _buildNode(node)),
                ],
              ),
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
                  color: Colors.black.withValues(alpha: 0.1),
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
                  'Nodes: ${_nodes.length}',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade600,
                  ),
                ),
                Text(
                  'Connections: ${_connections.length}',
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
                if (_isConnecting)
                  Text(
                    'Connection Mode: Active',
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.red.shade600,
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

  Widget _buildNode(Map<String, dynamic> nodeData) {
    final isSelected = _selectedNodeId == nodeData['id'];
    final isConnectingFrom = _connectionStartNodeId == nodeData['id'];
    
    return Positioned(
      left: nodeData['position'].dx,
      top: nodeData['position'].dy,
      child: GestureDetector(
        onTap: () => _handleNodeTap(nodeData),
        onPanUpdate: (details) => _handleNodeDrag(nodeData, details),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: nodeData['size'].width,
          height: nodeData['size'].height,
          decoration: BoxDecoration(
            color: isSelected 
                ? Colors.blue.shade50 
                : isConnectingFrom 
                    ? Colors.red.shade50 
                    : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected 
                  ? Colors.blue.shade300 
                  : isConnectingFrom 
                      ? Colors.red.shade300 
                      : Colors.grey.shade300,
              width: isSelected || isConnectingFrom ? 3 : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: nodeData['color'],
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        nodeData['type'],
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
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
                    if (isConnectingFrom)
                      Icon(
                        Icons.link,
                        size: 16,
                        color: Colors.red.shade600,
                      ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  nodeData['title'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: Text(
                    nodeData['content'],
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                      height: 1.3,
                    ),
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _handleNodeTap(Map<String, dynamic> nodeData) {
    if (_isConnecting) {
      if (_connectionStartNodeId == null) {
        setState(() {
          _connectionStartNodeId = nodeData['id'];
        });
      } else if (_connectionStartNodeId != nodeData['id']) {
        _createConnection(_connectionStartNodeId!, nodeData['id']);
        setState(() {
          _connectionStartNodeId = null;
          _isConnecting = false;
        });
      }
    } else {
      setState(() {
        _selectedNodeId = nodeData['id'];
      });
      _showEditNodeDialog(nodeData);
    }
  }

  void _handleNodeDrag(Map<String, dynamic> nodeData, DragUpdateDetails details) {
    setState(() {
      nodeData['position'] = Offset(
        (nodeData['position'].dx + details.delta.dx).clamp(0.0, 1800.0),
        (nodeData['position'].dy + details.delta.dy).clamp(0.0, 1800.0),
      );
    });
  }

  void _createConnection(String fromNodeId, String toNodeId) {
    // Check if connection already exists
    final existingConnection = _connections.any(
      (conn) => conn['from'] == fromNodeId && conn['to'] == toNodeId,
    );

    if (!existingConnection) {
      setState(() {
        _connections.add({
          'id': 'conn_${_connections.length + 1}',
          'from': fromNodeId,
          'to': toNodeId,
        });
      });
    }
  }

  void _toggleConnectionMode() {
    setState(() {
      _isConnecting = !_isConnecting;
      _connectionStartNodeId = null;
    });
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
            Text('Content: ${nodeData['content']}'),
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

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey.shade300
      ..strokeWidth = 0.5;

    const gridSize = 20.0;

    // Draw vertical lines
    for (double x = 0; x <= size.width; x += gridSize) {
      canvas.drawLine(
        Offset(x, 0),
        Offset(x, size.height),
        paint,
      );
    }

    // Draw horizontal lines
    for (double y = 0; y <= size.height; y += gridSize) {
      canvas.drawLine(
        Offset(0, y),
        Offset(size.width, y),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class ConnectionPainter extends CustomPainter {
  final List<Map<String, dynamic>> nodes;
  final List<Map<String, dynamic>> connections;
  final String? selectedNodeId;
  final bool isConnecting;
  final String? connectionStartNodeId;

  ConnectionPainter({
    required this.nodes,
    required this.connections,
    this.selectedNodeId,
    required this.isConnecting,
    this.connectionStartNodeId,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final connectionPaint = Paint()
      ..color = Colors.blue.shade400
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final selectedConnectionPaint = Paint()
      ..color = Colors.blue.shade600
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    // Draw connections
    for (final connection in connections) {
      final fromNode = nodes.firstWhere((node) => node['id'] == connection['from']);
      final toNode = nodes.firstWhere((node) => node['id'] == connection['to']);

      final fromCenter = Offset(
        fromNode['position'].dx + fromNode['size'].width / 2,
        fromNode['position'].dy + fromNode['size'].height / 2,
      );

      final toCenter = Offset(
        toNode['position'].dx + toNode['size'].width / 2,
        toNode['position'].dy + toNode['size'].height / 2,
      );

      final isSelected = selectedNodeId == connection['from'] || selectedNodeId == connection['to'];
      final paint = isSelected ? selectedConnectionPaint : connectionPaint;

      // Draw curved connection
      _drawCurvedConnection(canvas, fromCenter, toCenter, paint);
    }
  }

  void _drawCurvedConnection(Canvas canvas, Offset start, Offset end, Paint paint) {
    final path = Path();
    
    // Calculate control points for a smooth curve
    final distance = (end - start).distance;
    final controlPointOffset = distance * 0.3;
    
    final controlPoint1 = Offset(
      start.dx + controlPointOffset,
      start.dy,
    );
    
    final controlPoint2 = Offset(
      end.dx - controlPointOffset,
      end.dy,
    );

    path.moveTo(start.dx, start.dy);
    path.cubicTo(
      controlPoint1.dx, controlPoint1.dy,
      controlPoint2.dx, controlPoint2.dy,
      end.dx, end.dy,
    );

    canvas.drawPath(path, paint);

    // Draw arrow at the end
    _drawArrow(canvas, end, paint);
  }

  void _drawArrow(Canvas canvas, Offset point, Paint paint) {
    const arrowSize = 8.0;
    final angle = math.atan2(point.dy, point.dx);
    
    final arrowPath = Path();
    arrowPath.moveTo(point.dx, point.dy);
    arrowPath.lineTo(
      point.dx - arrowSize * math.cos(angle - math.pi / 6),
      point.dy - arrowSize * math.sin(angle - math.pi / 6),
    );
    arrowPath.moveTo(point.dx, point.dy);
    arrowPath.lineTo(
      point.dx - arrowSize * math.cos(angle + math.pi / 6),
      point.dy - arrowSize * math.sin(angle + math.pi / 6),
    );

    canvas.drawPath(arrowPath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
