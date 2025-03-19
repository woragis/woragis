const tagColors = {
  react: 'react',
  nextjs: 'nextjs',
  springboot: 'springboot',
  java: 'java',
  rust: 'rust',
  golang: 'golang',
  firebase: 'firebase',
  postgresql: 'postgresql',
  mongodb: 'mongodb',
  tailwindcss: 'tailwindcss',
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
    console.error('Element with id project-list not found')
    return
  }
  projectList.innerHTML = ''

  projects.forEach((project) => {
    const projectItem = document.createElement('div')
    projectItem.className = 'project-card'

    projectItem.innerHTML = `
        <img src="${project.img}" alt="${project.title}" class="project-image">
        <div class="project-content">
          <div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
          <div class="project-tags">
            ${project.tags
              .map((tag) => {
                return `<div class="project-tag ${tag.toLowerCase()}">${tag}</div>`
              })
              .join('')}
          </div>
          </div>
          <p class="project-updated">Last updated: ${project.updated}</p>
        </div>
      `

    projectList.appendChild(projectItem)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  renderProjects()
})
