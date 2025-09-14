import { db } from "../src/server/db";
import {
  projects,
  settings,
  users,
  testimonials,
  blogPosts,
} from "../src/server/db/schema";

async function seed() {
  console.log("Seeding database...");

  try {
    // Get the first user ID
    const userResults = await db.select({ id: users.id }).from(users).limit(1);
    if (userResults.length === 0) {
      throw new Error("No users found. Please create a user first.");
    }
    const userId = userResults[0].id;

    // Insert sample projects
    const sampleProjects = [
      {
        userId,
        title: "E-Commerce Platform",
        slug: "ecommerce-platform",
        description:
          "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
        longDescription:
          "This comprehensive e-commerce platform was built from scratch using modern web technologies. It includes a complete shopping cart system, user authentication with JWT tokens, payment processing integration with Stripe, and a comprehensive admin dashboard for managing products, orders, and customers. The frontend is built with React and TypeScript for type safety, while the backend uses Node.js with Express and PostgreSQL for data persistence.",
        technologies: JSON.stringify([
          "React",
          "TypeScript",
          "Node.js",
          "PostgreSQL",
          "Stripe",
          "Tailwind CSS",
        ]),
        image: "🛒",
        githubUrl: "https://github.com/yourusername/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.vercel.app",
        featured: true,
        order: 0,
        visible: true,
        public: true,
      },
      {
        userId,
        title: "Task Management App",
        slug: "task-management-app",
        description:
          "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        longDescription:
          "A modern task management application that allows teams to collaborate effectively. Built with Vue.js and Socket.io for real-time updates, it features drag-and-drop task organization, team member assignment, deadline tracking, and progress visualization. The app uses MongoDB for flexible data storage and includes features like file attachments, comments, and notification systems.",
        technologies: JSON.stringify([
          "Vue.js",
          "Socket.io",
          "MongoDB",
          "Express",
          "Node.js",
          "Bootstrap",
        ]),
        image: "📋",
        githubUrl: "https://github.com/yourusername/task-manager",
        liveUrl: "https://taskmanager-demo.netlify.app",
        featured: true,
        order: 1,
        visible: true,
        public: true,
      },
      {
        userId,
        title: "Weather Dashboard",
        slug: "weather-dashboard",
        description:
          "A responsive weather dashboard that provides current weather conditions, forecasts, and location-based weather alerts.",
        longDescription:
          "A comprehensive weather application that provides detailed weather information for any location worldwide. Built with React and TypeScript, it integrates with the OpenWeather API to fetch real-time weather data, 7-day forecasts, and weather alerts. The dashboard includes interactive charts using Chart.js, location search functionality, and responsive design for mobile and desktop users.",
        technologies: JSON.stringify([
          "React",
          "TypeScript",
          "OpenWeather API",
          "Chart.js",
          "CSS3",
          "Axios",
        ]),
        image: "🌤️",
        githubUrl: "https://github.com/yourusername/weather-dashboard",
        liveUrl: "https://weather-dashboard-demo.vercel.app",
        featured: true,
        order: 2,
        visible: true,
        public: true,
      },
      {
        userId,
        title: "Blog CMS",
        slug: "blog-cms",
        description:
          "A headless CMS for managing blog content with a modern admin interface and API endpoints.",
        longDescription:
          "A custom-built headless CMS specifically designed for blog management. Built with Next.js and Prisma, it provides a clean admin interface for content creators to manage blog posts, categories, and media. The system includes markdown support, image optimization, SEO features, and a RESTful API for content delivery to any frontend application.",
        technologies: JSON.stringify([
          "Next.js",
          "Prisma",
          "PostgreSQL",
          "Tailwind CSS",
          "Markdown",
          "NextAuth",
        ]),
        image: "📝",
        githubUrl: "https://github.com/yourusername/blog-cms",
        liveUrl: "https://blog-cms-demo.vercel.app",
        featured: false,
        order: 3,
        visible: true,
        public: true,
      },
      {
        userId,
        title: "Portfolio Website",
        slug: "portfolio-website",
        description:
          "A responsive portfolio website built with modern web technologies and best practices.",
        longDescription:
          "A personal portfolio website showcasing my skills and projects. Built with Next.js and TypeScript, it features a responsive design, dark/light theme toggle, multi-language support, and smooth animations. The site includes sections for about, skills, projects, experience, and contact, all managed through a custom admin panel.",
        technologies: JSON.stringify([
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "i18n",
        ]),
        image: "💼",
        githubUrl: "https://github.com/yourusername/portfolio",
        liveUrl: "https://yourportfolio.com",
        featured: false,
        order: 4,
        visible: true,
        public: true,
      },
      {
        userId,
        title: "API Gateway",
        slug: "api-gateway",
        description:
          "A microservices API gateway with authentication, rate limiting, and request routing.",
        longDescription:
          "A robust API gateway built with Node.js and Express that serves as the entry point for multiple microservices. It includes JWT-based authentication, rate limiting, request logging, error handling, and load balancing. The gateway is containerized with Docker and deployed on AWS with auto-scaling capabilities.",
        technologies: JSON.stringify([
          "Node.js",
          "Express",
          "Docker",
          "AWS",
          "Redis",
          "JWT",
          "Rate Limiting",
        ]),
        image: "🌐",
        githubUrl: "https://github.com/yourusername/api-gateway",
        liveUrl: "https://api-gateway-demo.herokuapp.com",
        featured: false,
        order: 5,
        visible: true,
        public: true,
      },
    ];

    await db.insert(projects).values(sampleProjects);

    // Insert sample testimonials
    const sampleTestimonials = [
      {
        userId,
        name: "Sarah Johnson",
        position: "Product Manager",
        company: "TechStart Inc",
        content:
          "Working with this developer was an absolute pleasure. The code quality was exceptional and the communication throughout the project was outstanding. Highly recommended!",
        rating: 5,
        featured: true,
        order: 1,
        visible: true,
        public: true,
      },
      {
        userId,
        name: "Michael Chen",
        position: "CTO",
        company: "InnovateLab",
        content:
          "Outstanding technical skills and attention to detail. The project was delivered on time and exceeded our expectations. Will definitely work together again!",
        rating: 5,
        featured: true,
        order: 2,
        visible: true,
        public: true,
      },
      {
        userId,
        name: "Emily Rodriguez",
        position: "Design Director",
        company: "Creative Studio",
        content:
          "A true professional who understands both technical requirements and user experience. The collaboration was seamless and the final product was exactly what we envisioned.",
        rating: 4,
        featured: true,
        order: 3,
        visible: true,
        public: true,
      },
      {
        userId,
        name: "David Kim",
        position: "Startup Founder",
        company: "NextGen Solutions",
        content:
          "Exceptional problem-solving skills and ability to work under pressure. The MVP was delivered ahead of schedule and the code quality was impressive.",
        rating: 5,
        featured: false,
        order: 4,
        visible: true,
        public: true,
      },
      {
        userId,
        name: "Lisa Thompson",
        position: "Senior Developer",
        company: "CodeCraft",
        content:
          "Great communication and technical expertise. The code was clean, well-documented, and easy to maintain. A pleasure to work with!",
        rating: 4,
        featured: false,
        order: 5,
        visible: true,
        public: true,
      },
    ];

    await db.insert(testimonials).values(sampleTestimonials);

    // Insert sample blog posts
    const sampleBlogPosts = [
      {
        userId,
        title: "Building Modern Web Applications with Next.js",
        slug: "building-modern-web-applications-nextjs",
        excerpt:
          "Learn how to build scalable and performant web applications using Next.js, React, and modern development practices.",
        content:
          "Next.js has revolutionized the way we build web applications. In this comprehensive guide, we'll explore the key features that make Next.js the go-to framework for modern web development...",
        featuredImage:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
        tags: JSON.stringify([
          "Next.js",
          "React",
          "JavaScript",
          "Web Development",
        ]),
        category: "Web Development",
        readingTime: 8,
        featured: true,
        published: true,
        publishedAt: new Date("2024-01-15"),
        order: 1,
        visible: true,
        public: true,
        viewCount: 1250,
        likeCount: 45,
      },
      {
        userId,
        title: "The Complete Guide to TypeScript for Beginners",
        slug: "complete-guide-typescript-beginners",
        excerpt:
          "Master TypeScript from the ground up with this comprehensive beginner's guide covering types, interfaces, and advanced features.",
        content:
          "TypeScript brings static typing to JavaScript, making your code more robust and maintainable. This guide will take you from TypeScript basics to advanced concepts...",
        featuredImage:
          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
        tags: JSON.stringify([
          "TypeScript",
          "JavaScript",
          "Programming",
          "Tutorial",
        ]),
        category: "Programming",
        readingTime: 12,
        featured: true,
        published: true,
        publishedAt: new Date("2024-01-10"),
        order: 2,
        visible: true,
        public: true,
        viewCount: 980,
        likeCount: 32,
      },
      {
        userId,
        title: "Database Design Best Practices",
        slug: "database-design-best-practices",
        excerpt:
          "Essential database design principles and patterns that every developer should know for building scalable applications.",
        content:
          "Good database design is crucial for application performance and maintainability. In this article, we'll cover the fundamental principles of database design...",
        featuredImage:
          "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
        tags: JSON.stringify(["Database", "SQL", "Design Patterns", "Backend"]),
        category: "Backend",
        readingTime: 10,
        featured: true,
        published: true,
        publishedAt: new Date("2024-01-05"),
        order: 3,
        visible: true,
        public: true,
        viewCount: 756,
        likeCount: 28,
      },
      {
        userId,
        title: "CSS Grid vs Flexbox: When to Use Each",
        slug: "css-grid-vs-flexbox-when-to-use",
        excerpt:
          "A detailed comparison of CSS Grid and Flexbox, helping you choose the right layout method for your projects.",
        content:
          "CSS Grid and Flexbox are powerful layout tools, but understanding when to use each can be challenging. Let's explore their strengths and use cases...",
        featuredImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        tags: JSON.stringify(["CSS", "Grid", "Flexbox", "Frontend", "Layout"]),
        category: "Frontend",
        readingTime: 6,
        featured: false,
        published: true,
        publishedAt: new Date("2024-01-01"),
        order: 4,
        visible: true,
        public: true,
        viewCount: 543,
        likeCount: 19,
      },
      {
        userId,
        title: "API Security Best Practices",
        slug: "api-security-best-practices",
        excerpt:
          "Learn essential security measures to protect your APIs from common vulnerabilities and attacks.",
        content:
          "API security is critical in today's connected world. This guide covers authentication, authorization, input validation, and other security best practices...",
        featuredImage:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
        tags: JSON.stringify(["API", "Security", "Authentication", "Backend"]),
        category: "Security",
        readingTime: 9,
        featured: false,
        published: true,
        publishedAt: new Date("2023-12-28"),
        order: 5,
        visible: true,
        public: true,
        viewCount: 432,
        likeCount: 15,
      },
    ];

    await db.insert(blogPosts).values(sampleBlogPosts);

    // Insert default settings (only if they don't exist)
    try {
      await db.insert(settings).values({
        key: "projects_per_page",
        value: "6",
      });
    } catch (error) {
      // Settings already exist, that's fine
      console.log("Settings already exist, skipping...");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
