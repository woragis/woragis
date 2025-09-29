"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  maxHeight?: string;
  scrollable?: boolean;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  headerClassName = "",
  contentClassName = "",
  maxHeight = "90vh",
  scrollable = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle modal open/close with animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    "3xl": "max-w-6xl",
    "4xl": "max-w-7xl",
    "5xl": "max-w-8xl",
    "6xl": "max-w-9xl",
    "7xl": "max-w-full",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          } ${className}`}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-all duration-200 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            } ${headerClassName}`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div
            className={`px-6 py-4 transition-all duration-200 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            } ${contentClassName} ${
              scrollable ? "overflow-y-auto" : ""
            }`}
            style={{ 
              maxHeight: scrollable ? `calc(${maxHeight} - 80px)` : "auto"
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Form Modal with built-in form actions
interface FormModalWithActionsProps extends Omit<FormModalProps, 'children'> {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  submitVariant?: "primary" | "secondary" | "danger" | "success";
  showActions?: boolean;
  actionsClassName?: string;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
}

export const FormModalWithActions: React.FC<FormModalWithActionsProps> = ({
  children,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  submitVariant = "primary",
  showActions = true,
  actionsClassName = "",
  submitDisabled = false,
  cancelDisabled = false,
  onClose,
  ...modalProps
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const getSubmitButtonStyles = () => {
    switch (submitVariant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <FormModal {...modalProps} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Form Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Actions */}
        {showActions && (
          <div className={`flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 ${actionsClassName}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading || cancelDisabled}
            >
              {cancelLabel}
            </Button>
            {onSubmit && (
              <Button
                type="submit"
                disabled={isLoading || submitDisabled}
                className={getSubmitButtonStyles()}
              >
                {isLoading ? "Saving..." : submitLabel}
              </Button>
            )}
          </div>
        )}
      </form>
    </FormModal>
  );
};

// Specialized modal for create/edit operations
interface CreateEditModalProps<T> extends Omit<FormModalProps, 'title' | 'children'> {
  isEdit: boolean;
  itemName: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitVariant?: "primary" | "secondary" | "danger" | "success";
  showActions?: boolean;
}

export const CreateEditModal = <T,>({
  isEdit,
  itemName,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  cancelLabel,
  submitVariant = "primary",
  showActions = true,
  ...modalProps
}: CreateEditModalProps<T>) => {
  const title = isEdit ? `Edit ${itemName}` : `Create New ${itemName}`;
  const defaultSubmitLabel = isEdit ? `Update ${itemName}` : `Create ${itemName}`;

  return (
    <FormModalWithActions
      {...modalProps}
      title={title}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={submitLabel || defaultSubmitLabel}
      cancelLabel={cancelLabel}
      isLoading={isLoading}
      submitVariant={submitVariant}
      showActions={showActions}
    >
      {children}
    </FormModalWithActions>
  );
};
