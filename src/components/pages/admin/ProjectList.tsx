"use client";

import React, { useState } from "react";
import { Project } from "@/types/projects";
import { Button, Card } from "@/components/ui";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onToggleFeatured: (id: number) => void;
  onReorder: (projectOrders: { id: number; order: number }[]) => void;
  isLoading?: boolean;
}

interface SortableProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onToggleFeatured: (id: number) => void;
}

const SortableProjectItem: React.FC<SortableProjectItemProps> = ({
  project,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`p-4 ${isDragging ? "shadow-lg" : ""}`}>
        <div className="flex items-start space-x-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2">
                {project.featured && (
                  <Star className="w-4 h-4 text-yellow-500" />
                )}
                {!project.visible && (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.frameworks?.slice(0, 3).map((framework) => (
                <span
                  key={framework.id}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full flex items-center gap-1"
                  style={{ backgroundColor: framework.color ? `${framework.color}20` : undefined }}
                >
                  {framework.icon && (
                    <span className="text-xs">{framework.icon}</span>
                  )}
                  {framework.name}
                </span>
              ))}
              {project.frameworks && project.frameworks.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{project.frameworks.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Order: {project.order}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleFeatured(Number(project.id))}
                  className="p-1"
                >
                  {project.featured ? (
                    <Star className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <StarOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleVisibility(Number(project.id))}
                  className="p-1"
                >
                  {project.visible ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(project)}
                  className="p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(Number(project.id))}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
  onReorder,
  isLoading = false,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex(
        (project) => project.id === active.id
      );
      const newIndex = projects.findIndex((project) => project.id === over.id);

      const reorderedProjects = arrayMove(projects, oldIndex, newIndex);
      const projectOrders = reorderedProjects.map((project, index) => ({
        id: Number(project.id),
        order: index,
      }));

      onReorder(projectOrders);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={projects.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {projects.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No projects found. Create your first project to get started.
              </p>
            </Card>
          ) : (
            projects.map((project) => (
              <SortableProjectItem
                key={project.id}
                project={project}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleVisibility={onToggleVisibility}
                onToggleFeatured={onToggleFeatured}
              />
            ))
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};
