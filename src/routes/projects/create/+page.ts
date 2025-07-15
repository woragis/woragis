import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/projects/create');
  const categories = await res.json();

  return {
    categories
  };
};
