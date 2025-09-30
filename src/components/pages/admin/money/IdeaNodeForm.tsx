"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IdeaNode, IdeaNodeFormData } from "@/types/money";
import { Button, Input, Textarea, Label } from "@/components/ui";

interface IdeaNodeFormProps {
  node?: IdeaNode | null;
  onSubmit: (data: IdeaNodeFormData) => Promise<void>;
  onCancel: () => void;
}

export function IdeaNodeForm({ node, onSubmit, onCancel }: IdeaNodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdeaNodeFormData>({
    defaultValues: node
      ? {
          title: node.title,
          content: node.content || "",
          type: node.type || "default",
          positionX: node.positionX,
          positionY: node.positionY,
          width: node.width || 200,
          height: node.height || 100,
          color: node.color || "",
          connections: node.connections as string[] || [],
          visible: node.visible ?? true,
        }
      : {
          title: "",
          content: "",
          type: "default",
          positionX: 0,
          positionY: 0,
          width: 200,
          height: 100,
          color: "",
          connections: [],
          visible: true,
        },
  });

  const handleFormSubmit = async (data: IdeaNodeFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          placeholder="Enter node title"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Node description or notes"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            {...register("type")}
            placeholder="default"
          />
        </div>

        <div>
          <Label htmlFor="color">Color (hex or name)</Label>
          <Input
            id="color"
            {...register("color")}
            placeholder="#ffffff or white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            {...register("width", { valueAsNumber: true })}
            placeholder="200"
          />
        </div>

        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            {...register("height", { valueAsNumber: true })}
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="positionX">Position X</Label>
          <Input
            id="positionX"
            type="number"
            {...register("positionX", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div>
          <Label htmlFor="positionY">Position Y</Label>
          <Input
            id="positionY"
            type="number"
            {...register("positionY", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : node ? "Update Node" : "Create Node"}
        </Button>
      </div>
    </form>
  );
}
