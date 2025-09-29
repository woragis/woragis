"use client";

import React from "react";
import Image from "next/image";
import { ProjectWithRelations } from "@/types";
import { Card, Container, Button, Badge } from "@/components/ui";
import { ProjectMarkdownRenderer } from "@/components/ui/ProjectMarkdownRenderer";
import {
  ExternalLink,
  Github,
  Calendar,
  Code,
  Play,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ProjectDetailPageProps {
  project: ProjectWithRelations;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Container className="py-8 lg:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <Card className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Project Image */}
              <div className="lg:w-1/3">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Project Info */}
              <div className="lg:w-2/3 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {project.title}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Frameworks & Languages */}
                {project.frameworks && project.frameworks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.frameworks.map((framework) => (
                        <Badge 
                          key={framework.id} 
                          variant="secondary"
                          className="flex items-center gap-1"
                          style={{ backgroundColor: framework.color || undefined }}
                        >
                          {framework.icon && (
                            <span className="text-xs">{framework.icon}</span>
                          )}
                          {framework.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}



                {/* Project Links */}
                <div className="flex flex-wrap gap-4">
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Github className="w-4 h-4" />
                        <span>View Code</span>
                      </Button>
                    </Link>
                  )}
                  {project.liveUrl && (
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Project Meta */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  {project.updatedAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Project Video */}
        {project.videoUrl && (
          <div className="mb-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Play className="w-6 h-6 mr-2 text-blue-600" />
                Project Demo
              </h2>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  controls
                  className="w-full h-full"
                  poster={project.image}
                >
                  <source src={project.videoUrl} type="video/mp4" />
                  <source src={project.videoUrl} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </Card>
          </div>
        )}

        {/* Long Description */}
        {project.longDescription && (
          <div className="mb-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Project Overview
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 leading-relaxed">
                  {project.longDescription}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Rich Content */}
        {project.content && (
          <div className="mb-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Project Details
              </h2>
              <ProjectMarkdownRenderer content={project.content} />
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
};
