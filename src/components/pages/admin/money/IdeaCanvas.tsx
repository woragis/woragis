"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  useIdeaNodes,
  useCreateIdeaNode,
  useUpdateIdeaNode,
  useUpdateNodePosition,
  useUpdateNodeConnections,
  useDeleteIdeaNode,
} from "@/hooks/money";
import type { IdeaNode } from "@/types/money";
import { IdeaNodeForm } from "./IdeaNodeForm";
import { FormModal } from "@/components/common/FormModal";
import { Button } from "@/components/ui";
import { Plus, Trash2, Edit } from "lucide-react";

interface IdeaCanvasProps {
  ideaId: string;
}

// Custom node component
function CustomNode({ data }: { data: any }) {
  // Determine if using a custom color or default
  const hasCustomColor = data.color && data.color !== "white";
  
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-md border-2 min-w-[200px] ${
        !hasCustomColor ? "bg-white dark:bg-gray-800" : ""
      }`}
      style={{
        backgroundColor: hasCustomColor ? data.color : undefined,
        borderColor: data.selected 
          ? "#3b82f6" 
          : hasCustomColor 
            ? "#e5e7eb" 
            : undefined,
      }}
    >
      <div className={`font-semibold text-sm mb-1 ${!hasCustomColor ? "text-gray-900 dark:text-white" : ""}`}>
        {data.label}
      </div>
      {data.content && (
        <div className={`text-xs line-clamp-3 ${!hasCustomColor ? "text-gray-600 dark:text-gray-400" : "text-gray-700"}`}>
          {data.content}
        </div>
      )}
      <div className="mt-2 flex gap-1">
        <span className={`text-xs px-2 py-1 rounded ${!hasCustomColor ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" : "bg-gray-100 text-gray-800"}`}>
          {data.type}
        </span>
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export function IdeaCanvas({ ideaId }: IdeaCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<IdeaNode | null>(null);

  const { data: ideaNodes } = useIdeaNodes(ideaId);
  const createNode = useCreateIdeaNode();
  const updateNode = useUpdateIdeaNode();
  const updatePosition = useUpdateNodePosition();
  const updateConnections = useUpdateNodeConnections();
  const deleteNode = useDeleteIdeaNode();

  // Convert idea nodes to React Flow nodes
  const nodes: Node[] = useMemo(() => {
    if (!ideaNodes) return [];
    return ideaNodes.map((node) => ({
      id: node.id,
      type: "custom",
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.title,
        content: node.content,
        type: node.type,
        color: node.color,
        selected: selectedNode === node.id,
        nodeId: node.id,
      },
      style: {
        width: node.width || 200,
        height: node.height || 100,
      },
    }));
  }, [ideaNodes, selectedNode]);

  // Convert connections to React Flow edges
  const edges: Edge[] = useMemo(() => {
    if (!ideaNodes) return [];
    const allEdges: Edge[] = [];
    
    ideaNodes.forEach((node) => {
      if (node.connections && Array.isArray(node.connections)) {
        node.connections.forEach((targetId: string) => {
          allEdges.push({
            id: `${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            type: "smoothstep",
            animated: true,
          });
        });
      }
    });

    return allEdges;
  }, [ideaNodes]);

  const [internalNodes, setInternalNodes] = useNodesState(nodes);
  const [internalEdges, setInternalEdges] = useEdgesState(edges);

  // Update internal state when data changes
  useMemo(() => {
    setInternalNodes(nodes);
  }, [nodes, setInternalNodes]);

  useMemo(() => {
    setInternalEdges(edges);
  }, [edges, setInternalEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, internalNodes);
      setInternalNodes(updatedNodes);

      // Handle position changes
      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          const node = ideaNodes?.find((n) => n.id === change.id);
          if (node) {
            updatePosition.mutate({
              id: change.id,
              ideaId,
              positionX: change.position.x,
              positionY: change.position.y,
            });
          }
        }
      });
    },
    [internalNodes, ideaNodes, ideaId, updatePosition, setInternalNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setInternalEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setInternalEdges]
  );

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      setInternalEdges((eds) => addEdge(connection, eds));

      // Update connections in database
      const sourceNode = ideaNodes?.find((n) => n.id === connection.source);
      if (sourceNode) {
        const currentConnections = (sourceNode.connections as string[]) || [];
        const newConnections = [...currentConnections, connection.target];
        
        await updateConnections.mutateAsync({
          id: connection.source,
          ideaId,
          connections: newConnections,
        });
      }
    },
    [ideaNodes, ideaId, updateConnections, setInternalEdges]
  );

  const handleAddNode = async () => {
    const newNode = {
      ideaId,
      title: "New Node",
      content: "",
      type: "default",
      positionX: 100 + Math.random() * 200,
      positionY: 100 + Math.random() * 200,
      width: 200,
      height: 100,
      visible: true,
      connections: [],
    };

    await createNode.mutateAsync(newNode);
  };

  const handleEditNode = () => {
    if (!selectedNode) return;
    const node = ideaNodes?.find((n) => n.id === selectedNode);
    if (node) {
      setEditingNode(node);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteNode = async () => {
    if (!selectedNode) return;
    
    if (confirm("Are you sure you want to delete this node?")) {
      await deleteNode.mutateAsync({ id: selectedNode, ideaId });
      setSelectedNode(null);
    }
  };

  const handleNodeSubmit = async (data: any) => {
    if (editingNode) {
      await updateNode.mutateAsync({
        id: editingNode.id,
        node: data,
      });
    } else {
      await createNode.mutateAsync({
        ideaId,
        ...data,
      });
    }
    setIsEditModalOpen(false);
    setEditingNode(null);
  };

  const handleNodeCancel = () => {
    setIsEditModalOpen(false);
    setEditingNode(null);
  };

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const ideaNode = ideaNodes?.find((n) => n.id === node.id);
    if (ideaNode) {
      setEditingNode(ideaNode);
      setIsEditModalOpen(true);
    }
  }, [ideaNodes]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="relative w-full h-[700px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={internalNodes}
        edges={internalEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as any;
            return data.color || "#e5e7eb";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        
        <Panel position="top-right" className="flex flex-col gap-2">
          <Button onClick={handleAddNode} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
          {selectedNode && (
            <>
              <Button
                onClick={handleEditNode}
                size="sm"
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Node
              </Button>
              <Button
                onClick={handleDeleteNode}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Node
              </Button>
            </>
          )}
        </Panel>

        <Panel position="bottom-left" className="bg-white dark:bg-gray-800 px-3 py-2 rounded shadow text-xs text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
          Nodes: {ideaNodes?.length || 0} | Connections: {edges.length}
          {selectedNode && <span className="ml-2 text-blue-600 dark:text-blue-400">• Node Selected (Double-click to edit)</span>}
        </Panel>
      </ReactFlow>

      {/* Edit Node Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={handleNodeCancel}
        title={editingNode ? "Edit Node" : "Create Node"}
        size="lg"
        scrollable={true}
      >
        <IdeaNodeForm
          node={editingNode}
          onSubmit={handleNodeSubmit}
          onCancel={handleNodeCancel}
        />
      </FormModal>
    </div>
  );
}