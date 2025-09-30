"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Idea, IdeaFormData } from "@/types/money";
import { Button, Input, Textarea, Label, Checkbox } from "@/components/ui";

interface IdeaFormProps {
  idea?: Idea | null;
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onCancel: () => void;
}

export function IdeaForm({ idea, onSubmit, onCancel }: IdeaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IdeaFormData>({
    defaultValues: idea
      ? {
          title: idea.title,
          slug: idea.slug,
          document: idea.document,
          description: idea.description || "",
          featured: idea.featured || false,
          visible: idea.visible ?? true,
          public: idea.public || false,
          order: idea.order || 0,
        }
      : {
          title: "",
          slug: "",
          document: "",
          description: "",
          featured: false,
          visible: true,
          public: false,
          order: 0,
        },
  });

  // Auto-generate slug from title
  const title = watch("title");
  useEffect(() => {
    if (!idea && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  }, [title, idea, setValue]);

  const handleFormSubmit = async (data: IdeaFormData) => {
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
          placeholder="Enter idea title"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register("slug", { required: "Slug is required" })}
          placeholder="idea-slug"
        />
        {errors.slug && (
          <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Short description of the idea"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="document">Document (Markdown) *</Label>
        <Textarea
          id="document"
          {...register("document", { required: "Document is required" })}
          placeholder="Write your idea in markdown..."
          rows={15}
          className="font-mono"
        />
        {errors.document && (
          <p className="text-sm text-red-500 mt-1">{errors.document.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            {...register("order", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            {...register("featured")}
          />
          <Label htmlFor="featured" className="font-normal">
            Featured
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="visible"
            {...register("visible")}
          />
          <Label htmlFor="visible" className="font-normal">
            Visible
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="public"
            {...register("public")}
          />
          <Label htmlFor="public" className="font-normal">
            Public
          </Label>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : idea ? "Update Idea" : "Create Idea"}
        </Button>
      </div>
    </form>
  );
}
