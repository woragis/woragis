"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils/utils";

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  headerActions,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-6 animate-fade-in-up", className)}>
      <PageHeader title={title} description={description}>
        {headerActions}
      </PageHeader>
      <div
        className="animate-fade-in"
        style={{ animationDelay: "200ms", animationFillMode: "both" }}
      >
        {children}
      </div>
    </div>
  );
};
