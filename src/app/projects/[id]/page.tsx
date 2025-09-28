import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/components/pages/projects/ProjectDetailPage";
import { projectService } from "@/server/services";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  
  const result = await projectService.getPublicProjectWithRelations(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  return <ProjectDetailPage project={result.data} />;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params;
  
  const result = await projectService.getPublicProjectById(id);
  
  if (!result.success || !result.data) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: result.data.title,
    description: result.data.description,
  };
}
