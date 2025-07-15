import { db } from '$lib/server/db/client';
import { categories, niches, projects, projectCategory, nicheProject, places } from '$lib/server/db/schema';

export async function POST() {
  const [{ id: projectId }] = await db.insert(projects).values({ name: 'Project A', description: 'AI for doctors' }).returning({ id: projects.id });

  const [{ id: catId }] = await db.insert(categories).values({ name: 'AI' }).returning({ id: categories.id });
  const [{ id: nicheId }] = await db.insert(niches).values({ name: 'Healthcare' }).returning({ id: niches.id });

  await db.insert(projectCategory).values({ projectId, categoryId: catId });
  await db.insert(nicheProject).values({ projectId, nicheId });
  await db.insert(places).values({ projectId, name: 'São Paulo' });

  return new Response(JSON.stringify({ success: true }));
}
