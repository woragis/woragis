import { getAllProjectsWithRelations } from '$lib/server/repositories/project';

export async function GET() {
  const projects = await getAllProjectsWithRelations();

  return new Response(JSON.stringify(projects), {
    headers: { 'Content-Type': 'application/json' }
  });
}
