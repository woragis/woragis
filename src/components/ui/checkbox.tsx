"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700",
            "peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-500",
            "peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-gray-800",
            "cursor-pointer transition-colors",
            "flex items-center justify-center",
            props.disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <Check
            className={cn(
              "h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            )}
          />
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
