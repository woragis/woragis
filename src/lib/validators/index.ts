// Validation schemas and utilities
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format');
export const urlSchema = z.string().url('Invalid URL format');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Project schemas
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  githubUrl: urlSchema.optional(),
  liveUrl: urlSchema.optional(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Language schemas
export const languageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: slugSchema,
  description: z.string().optional(),
  icon: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Framework schemas
export const frameworkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: slugSchema,
  description: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Blog schemas
export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: slugSchema,
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export const blogTagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: slugSchema,
  description: z.string().optional(),
  color: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Experience schemas
export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  current: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Testimonial schemas
export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  rating: z.number().int().min(1).max(5).optional(),
  avatar: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Settings schemas
export const settingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
  description: z.string().optional(),
});

// Validation utility functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

export const validateSlug = (slug: string): boolean => {
  return slugSchema.safeParse(slug).success;
};

export const validateUrl = (url: string): boolean => {
  return urlSchema.safeParse(url).success;
};
