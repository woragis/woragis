import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { projects, categories, projectCategory } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const all = await db.select().from(categories);
  return json(all);
}


export async function POST({ request }) {
  const body = await request.json();
  const { name, description, categories: catNames } = body;

  if (!name || !catNames?.length) {
    return json({ error: 'Name and at least one category required' }, { status: 400 });
  }

  // Create project
  const [{ id: projectId }] = await db.insert(projects).values({ name, description }).returning({ id: projects.id });

  for (const name of catNames) {
    // Check if category exists
    const existing = await db.select().from(categories).where(eq(categories.name, name)).get();
    let categoryId: number;

    if (existing) {
      categoryId = existing.id;
    } else {
      const [{ id }] = await db.insert(categories).values({ name }).returning({ id: categories.id });
      categoryId = id;
    }

    await db.insert(projectCategory).values({ projectId, categoryId });
  }

  return json({ success: true });
}
