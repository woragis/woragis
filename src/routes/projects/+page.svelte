<script lang="ts">
  export let data;
  async function createProjects() {
    const res = await fetch('/projects/seed', {
      method: 'POST'
    });

    if (res.ok) {
      alert('Project seeded successfully!');
    } else {
      alert('Failed to create project');
    }
  }
</script>

<h1>Projects</h1>

<button on:click={createProjects}>
  Create
</button>

<a href="/projects/create">Create a new project</a>

{#each data.projects as project}
  <div class="project">
    <h2>{project.name}</h2>
    <p>{project.description}</p>

    <p><strong>Categories:</strong> {project.categories.map(c => c.name).join(', ')}</p>
    <p><strong>Niches:</strong> {project.niches.map(n => n.name).join(', ')}</p>
    <p><strong>Places:</strong> {project.places.map(p => p.name).join(', ')}</p>
  </div>
{/each}

<style>
  .project {
    border: 1px solid #ddd;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }
</style>
