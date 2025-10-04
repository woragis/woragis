# Money Domain - Visual Flow & Canvas Implementation

This document describes the visual flow and canvas implementation for the money domain, providing a node-based visual editor for business ideas similar to the web version using ReactFlow.

## Overview

The money domain includes two canvas implementations for visualizing and editing business ideas as interconnected nodes:

1. **Basic Idea Canvas** (`idea_canvas_page.dart`) - Simplified canvas with basic node visualization
2. **Advanced Idea Canvas** (`advanced_idea_canvas_page.dart`) - Full-featured canvas with custom painting and connections

## Features

### 🎨 **Visual Node Editor**

#### **Node Types**
- **Research Nodes** (Green) - Market research, user studies
- **Development Nodes** (Blue) - Product development, technical implementation
- **Marketing Nodes** (Orange) - Marketing strategy, promotion
- **Business Nodes** (Purple) - Revenue models, business strategy

#### **Node Properties**
- **Title** - Main node identifier
- **Content** - Detailed description
- **Type** - Node category with color coding
- **Position** - X,Y coordinates on canvas
- **Size** - Width and height dimensions
- **Connections** - Links to other nodes

### 🔗 **Connection System**

#### **Visual Connections**
- **Curved Lines** - Smooth bezier curves between nodes
- **Arrows** - Directional indicators showing relationships
- **Selection Highlighting** - Connected nodes highlight when selected
- **Connection Mode** - Interactive connection creation

#### **Connection Types**
- **Sequential** - Step-by-step process flow
- **Dependencies** - One node depends on another
- **Relationships** - Related concepts or ideas
- **Hierarchical** - Parent-child relationships

### 🎛️ **Canvas Controls**

#### **Navigation**
- **Pan** - Drag to move around the canvas
- **Zoom In/Out** - Scale the canvas view
- **Reset View** - Return to default zoom and position
- **Fit to Screen** - Auto-fit all nodes in view

#### **Grid System**
- **Background Grid** - Visual alignment guide
- **Snap to Grid** - Optional grid snapping
- **Custom Grid Size** - Adjustable grid spacing

### 🛠️ **Interactive Features**

#### **Node Interaction**
- **Single Tap** - Select node
- **Double Tap** - Edit node properties
- **Long Press** - Context menu (future)
- **Drag** - Move node position
- **Multi-select** - Select multiple nodes (future)

#### **Connection Interaction**
- **Connection Mode** - Toggle to create connections
- **Tap to Connect** - Select two nodes to connect
- **Visual Feedback** - Highlight connection start node
- **Connection Validation** - Prevent duplicate connections

## Implementation Details

### 🏗️ **Architecture**

#### **Custom Painters**
```dart
class GridPainter extends CustomPainter {
  // Draws the background grid pattern
}

class ConnectionPainter extends CustomPainter {
  // Draws curved connections between nodes
  // Handles arrow rendering
  // Manages connection highlighting
}
```

#### **InteractiveViewer Integration**
```dart
InteractiveViewer(
  transformationController: _transformationController,
  minScale: 0.3,
  maxScale: 3.0,
  child: CustomPaint(...),
)
```

#### **Gesture Detection**
```dart
GestureDetector(
  onTap: () => _handleNodeTap(nodeData),
  onPanUpdate: (details) => _handleNodeDrag(nodeData, details),
  child: NodeWidget(...),
)
```

### 📱 **Mobile Optimizations**

#### **Touch Interactions**
- **Responsive Touch Targets** - Minimum 44px touch areas
- **Gesture Recognition** - Distinguish between tap, drag, and long press
- **Multi-touch Support** - Pinch-to-zoom, two-finger pan
- **Haptic Feedback** - Touch feedback for interactions

#### **Performance**
- **Custom Painting** - Efficient rendering of connections
- **State Management** - Minimal rebuilds with targeted state updates
- **Memory Management** - Dispose controllers and listeners
- **Canvas Caching** - Cache complex drawings when possible

### 🎨 **Visual Design**

#### **Color System**
- **Node Colors** - Type-based color coding
- **Selection States** - Blue for selected, red for connecting
- **Connection Colors** - Blue for normal, darker for selected
- **Background** - Light grey with subtle grid

#### **Typography**
- **Node Titles** - Bold, 16px for readability
- **Node Content** - Regular, 12px with proper line height
- **Labels** - Small, 10px for type indicators

#### **Shadows & Depth**
- **Node Shadows** - Subtle elevation for depth
- **Connection Depth** - Layered rendering order
- **Selection Glow** - Highlighted border effects

## Usage Examples

### 1. **Basic Canvas Usage**

```dart
// Navigate to basic canvas
context.go('/money/ideas/${ideaId}/canvas');

// Features available:
// - View existing nodes
// - Pan and zoom
// - Select nodes
// - Basic node editing
```

### 2. **Advanced Canvas Usage**

```dart
// Navigate to advanced canvas
context.go('/money/ideas/${ideaId}/canvas/advanced');

// Features available:
// - All basic features plus:
// - Create connections between nodes
// - Drag nodes to reposition
// - Connection mode toggle
// - Visual connection feedback
```

### 3. **Node Creation Flow**

```dart
// 1. Tap "Add Node" button
// 2. Fill in node details (title, content, type)
// 3. Node appears on canvas
// 4. Drag to position
// 5. Connect to other nodes if needed
```

### 4. **Connection Creation Flow**

```dart
// 1. Tap connection mode button (link icon)
// 2. Tap first node (turns red)
// 3. Tap second node (creates connection)
// 4. Connection mode automatically turns off
```

## Future Enhancements

### 🚀 **Planned Features**

#### **Enhanced Node Editor**
- [ ] Rich text editing for node content
- [ ] Image attachments for nodes
- [ ] Custom node shapes and styles
- [ ] Node templates and presets

#### **Advanced Connections**
- [ ] Connection labels and descriptions
- [ ] Different connection types (dashed, dotted, etc.)
- [ ] Connection weights and priorities
- [ ] Automatic layout algorithms

#### **Collaboration Features**
- [ ] Real-time collaborative editing
- [ ] Node comments and annotations
- [ ] Version history and branching
- [ ] Export to various formats

#### **AI Integration**
- [ ] AI-powered node suggestions
- [ ] Automatic connection recommendations
- [ ] Content generation from prompts
- [ ] Smart layout optimization

#### **Mobile-Specific Features**
- [ ] Voice annotations for nodes
- [ ] Camera integration for quick node creation
- [ ] Offline mode with sync
- [ ] Handwriting recognition for notes

### 🔧 **Technical Improvements**

#### **Performance**
- [ ] Virtual scrolling for large canvases
- [ ] WebGL rendering for complex visuals
- [ ] Background processing for heavy operations
- [ ] Memory optimization for large node sets

#### **Accessibility**
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Keyboard navigation
- [ ] Voice control integration

## Integration with Backend

### 📡 **API Endpoints**

The canvas implementation will integrate with the following backend endpoints:

```typescript
// Node management
GET    /api/money/ideas/{ideaId}/nodes
POST   /api/money/ideas/{ideaId}/nodes
PUT    /api/money/ideas/{ideaId}/nodes/{nodeId}
DELETE /api/money/ideas/{ideaId}/nodes/{nodeId}

// Connection management
GET    /api/money/ideas/{ideaId}/connections
POST   /api/money/ideas/{ideaId}/connections
DELETE /api/money/ideas/{ideaId}/connections/{connectionId}

// Position updates
PUT    /api/money/ideas/{ideaId}/nodes/{nodeId}/position
```

### 💾 **Data Models**

```dart
class IdeaNode {
  String id;
  String ideaId;
  String title;
  String content;
  String type;
  Color color;
  Offset position;
  Size size;
  List<String> connections;
  bool visible;
  DateTime createdAt;
  DateTime updatedAt;
}

class NodeConnection {
  String id;
  String ideaId;
  String fromNodeId;
  String toNodeId;
  String? label;
  String? type;
  DateTime createdAt;
}
```

## Comparison with Web Version

### 🌐 **Web Implementation (ReactFlow)**
- **Library**: @xyflow/react
- **Features**: Full-featured node editor
- **Performance**: Excellent for desktop
- **Mobile**: Limited touch support

### 📱 **Mobile Implementation (Flutter)**
- **Library**: Custom CustomPainter
- **Features**: Mobile-optimized interactions
- **Performance**: Optimized for mobile devices
- **Touch**: Native touch gesture support

### 🔄 **Feature Parity**
- ✅ Node creation and editing
- ✅ Visual connections
- ✅ Pan and zoom
- ✅ Node selection
- 🔄 Real-time collaboration (planned)
- 🔄 Advanced layout algorithms (planned)
- 🔄 Export functionality (planned)

This implementation provides a solid foundation for visual idea management on mobile devices, with room for future enhancements and feature additions.
