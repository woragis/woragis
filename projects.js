const tagColors = {
  react: 'bg-blue-100 text-blue-600',
  nextjs: 'bg-gray-900 text-gray-100',
  springboot: 'bg-green-300 text-green-600',
  java: 'bg-red-300 text-red-600',
  rust: 'bg-gray-400 text-gray-700',
  golang: 'bg-blue-300 text-blue-600',
  firebase: 'bg-yellow-300 text-yellow-600',
  postgresql: 'bg-blue-300 text-blue-600',
  mongodb: 'bg-green-300 text-green-600',
  tailwindcss: 'bg-cyan-300 text-cyan-600',
}

const projects = [
  {
    title: 'Reservatorio de Dopamina <Clone>',
    description:
      'Simple clone from a online video study plataform from Brazil.',
    img: 'rd-screenshot.jpg',
    tags: ['Nextjs', 'TailwindCSS'],
    updated: 'March 2025',
  },
  {
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with user authentication and payments.',
    img: 'e-commerce-screenshot.jpg',
    tags: ['Nextjs', 'TailwindCSS', 'Java', 'SpringBoot', 'PostgreSQL'],
    updated: 'February 2025',
  },
  {
    title: 'Task Manager App',
    description: 'Simple full-stack task manager app.',
    img: 'task-manager-screenshot.jpg',
    tags: ['React', 'Firebase'],
    updated: 'January 2025',
  },
]

function renderProjects() {
  const projectList = document.querySelector('#project-list')
  if (!projectList) {
    console.error('Element with class project-list not found')
    return
  }
  projectList.innerHTML = ''

  projects.forEach((project) => {
    const projectItem = document.createElement('div')
    projectItem.className = 'flex bg-gray-100 my-12 p-4 rounded-lg shadow-md'

    projectItem.innerHTML = `
        <img src="${project.img}" alt="${
      project.title
    }" class="w-24 h-24 rounded-lg object-cover">
        <div class="ml-4 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-semibold text-black">${project.title}</h3>
            <p class="text-sm text-gray-600">${project.description}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${project.tags
              .map((tag) => {
                const colorClass =
                  tagColors[tag.toLowerCase()] || 'bg-gray-300 text-black'
                return `<div class="px-4 py-2 p-12 text-xs font-semibold rounded ${colorClass}">${tag}</div>`
              })
              .join('')}
          </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Last updated: ${
            project.updated
          }</p>
        </div>
      `

    projectList.appendChild(projectItem)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  renderProjects()
})
