<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';
  export let data;

  let name = '';
  let description = '';
  let categoryInput = '';
  let selectedCategories: string[] = [];
  let filteredCategories = data.categories;

  function selectCategory(cat: string) {
    if (!selectedCategories.includes(cat)) {
      selectedCategories = [...selectedCategories, cat];
    }
    categoryInput = '';
  }

  function removeCategory(cat: string) {
    selectedCategories = selectedCategories.filter(c => c !== cat);
  }

  $: filteredCategories = data.categories
    .map(c => c.name)
    .filter(c => c.toLowerCase().includes(categoryInput.toLowerCase()) && !selectedCategories.includes(c));

  async function submit() {
    const res = await fetch('/projects/create', {
      method: 'POST',
      body: JSON.stringify({ name, description, categories: selectedCategories }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      await invalidate('/projects');
      window.location.href = '/projects';
    }
  }
</script>

<h1>Create Project</h1>

<form on:submit|preventDefault={submit}>
  <label>
    Name
    <input bind:value={name} required />
  </label>

  <label>
    Description
    <textarea bind:value={description}></textarea>
  </label>

  <label>
    Categories
    <input bind:value={categoryInput} placeholder="Type to search or create" />

    {#if categoryInput}
      <ul>
        {#each filteredCategories as cat}
          <li on:click={() => selectCategory(cat)}>{cat}</li>
        {/each}
        {#if !filteredCategories.length}
          <li on:click={() => selectCategory(categoryInput)}>
            ➕ Create "{categoryInput}"
          </li>
        {/if}
      </ul>
    {/if}
  </label>

  <div>
    {#each selectedCategories as cat}
      <span on:click={() => removeCategory(cat)} style="margin-right: 8px; cursor: pointer">
        {cat} ✖
      </span>
    {/each}
  </div>

  <button type="submit">Create</button>
</form>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow: auto;
  }
  li {
    padding: 6px 8px;
    cursor: pointer;
  }
  li:hover {
    background-color: #eee;
  }
</style>
