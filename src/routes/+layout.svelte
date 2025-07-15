<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav>
  <a href="/projects">View Projects</a>
</nav>

{@render children()}
