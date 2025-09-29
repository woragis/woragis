"use client";

import React, { useState, useMemo } from "react";
import { useUploads, useDeleteUpload, useUploadStats } from "@/hooks/useUploads";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { 
  Trash2, 
  Eye, 
  Download, 
  FileImage, 
  FileVideo, 
  FileText, 
  File,
  HardDrive,
  Database,
  AlertTriangle
} from "lucide-react";
import Image from "next/image";

export const UploadsManagement: React.FC = () => {
  const { data, isLoading, error, refetch } = useUploads();
  const { stats } = useUploadStats();
  const deleteUpload = useDeleteUpload();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter and search files
  const filteredFiles = useMemo(() => {
    if (!data?.files) return [];
    
    let filtered = data.files;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [data?.files, selectedCategory, searchTerm]);

  // Get unique categories for filter tabs
  const categories = useMemo(() => {
    if (!data?.files) return [];
    const uniqueCategories = [...new Set(data.files.map(file => file.category))];
    return ["all", ...uniqueCategories];
  }, [data?.files]);

  const handleDeleteFile = async (file: any) => {
    if (!file.canDelete) return;
    
    try {
      await deleteUpload.mutateAsync(file.relativePath);
      setShowDeleteConfirm(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (extension: string) => {
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(extension)) {
      return <FileImage className="h-4 w-4 text-green-500" />;
    }
    if ([".mp4", ".webm", ".mov", ".avi"].includes(extension)) {
      return <FileVideo className="h-4 w-4 text-blue-500" />;
    }
    if ([".pdf", ".txt", ".md", ".doc", ".docx"].includes(extension)) {
      return <FileText className="h-4 w-4 text-orange-500" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const columns = [
    {
      key: "filename",
      label: "File",
      render: (file: any) => (
        <div className="flex items-center space-x-3">
          {getFileIcon(file.extension)}
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {file.filename}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {file.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "size",
      label: "Size",
      render: (file: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatFileSize(file.size)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (file: any) => (
        <StatusBadge
          variant={file.isReferenced ? "success" : "warning"}
          status={file.isReferenced ? "Referenced" : "Orphaned"}
        />
      ),
    },
    {
      key: "modifiedAt",
      label: "Modified",
      render: (file: any) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(file.modifiedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (file: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFile(file);
              setShowPreview(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(file.url, "_blank")}
          >
            <Download className="h-4 w-4" />
          </Button>
          {file.canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(file);
                setShowDeleteConfirm(true);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Uploads Management"
          description="Manage uploaded files and check their usage"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Uploads Management"
          description="Manage uploaded files and check their usage"
        />
        <Card className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Uploads
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Failed to load uploads data. Please try again.
            </p>
            <Button onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Uploads Management"
        description="Manage uploaded files and check their usage"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Files
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.total || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Referenced
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.referenced || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Orphaned
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.orphaned || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <File className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(stats?.byCategory || {}).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search files..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <FilterTabs
          options={categories.map(cat => ({
            value: cat,
            label: cat === "all" ? "All" : cat.replace("/", " / ")
          }))}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />
      </div>

      {/* Files Table */}
      <Card className="p-6">
        {filteredFiles.length === 0 ? (
          <EmptyState
            icon={File}
            title="No files found"
            description="No files match your current filters"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFiles.map((file, index) => (
                  <tr
                    key={file.relativePath}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {column.render(file)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* File Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="File Preview"
        size="lg"
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile.extension)}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedFile.filename}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFile.category} • {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <StatusBadge
                variant={selectedFile.isReferenced ? "success" : "warning"}
                status={selectedFile.isReferenced ? "Referenced in database" : "Not referenced"}
              />
            </div>

            {/* File Preview */}
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              {selectedFile.extension.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <div className="relative h-64">
                  <Image
                    src={selectedFile.url}
                    alt={selectedFile.filename}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              ) : selectedFile.extension.match(/\.(mp4|webm|mov|avi)$/i) ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="w-full h-64 rounded"
                />
              ) : (
                <div className="text-center py-8">
                  <File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Preview not available for this file type
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => window.open(selectedFile.url, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete File"
        size="sm"
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Delete {selectedFile.filename}?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteFile(selectedFile)}
                disabled={deleteUpload.isPending}
                className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
              >
                {deleteUpload.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
