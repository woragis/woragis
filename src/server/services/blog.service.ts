import { blogRepository } from "@/server/repositories";
import type {
  BlogPost,
  NewBlogPost,
  BlogPostFilters,
  BlogPostOrderUpdate,
  ApiResponse,
} from "@/types";
import { BaseService } from "./base.service";

export class BlogService extends BaseService {
  async getAllBlogPosts(userId?: string): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.findAll(userId);
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "getAllBlogPosts");
    }
  }

  async getVisibleBlogPosts(userId?: string): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.findVisible(userId);
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "getVisibleBlogPosts");
    }
  }

  async getPublishedBlogPosts(): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.findPublished();
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "getPublishedBlogPosts");
    }
  }

  async getFeaturedBlogPosts(
    limit: number = 3,
    userId?: string
  ): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.findFeatured(limit, userId);
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "getFeaturedBlogPosts");
    }
  }

  async getPublicFeaturedBlogPosts(
    limit: number = 3
  ): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.findPublicFeatured(limit);
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "getPublicFeaturedBlogPosts");
    }
  }

  async getPublicRecentBlogPosts(
    limit: number = 6
  ): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.findPublicRecent(limit);
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "getPublicRecentBlogPosts");
    }
  }

  async getBlogPostById(
    id: string,
    userId?: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      const blogPost = await blogRepository.findById(id, userId);
      return this.success(blogPost);
    } catch (error) {
      return this.handleError(error, "getBlogPostById");
    }
  }

  async getBlogPostBySlug(
    slug: string,
    userId?: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!slug || slug.trim().length === 0) {
        return {
          success: false,
          error: "Invalid blog post slug",
        };
      }

      const blogPost = await blogRepository.findBySlug(slug, userId);
      return this.success(blogPost);
    } catch (error) {
      return this.handleError(error, "getBlogPostBySlug");
    }
  }

  async getPublicBlogPostBySlug(
    slug: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!slug || slug.trim().length === 0) {
        return {
          success: false,
          error: "Invalid blog post slug",
        };
      }

      const blogPost = await blogRepository.findPublicBySlug(slug);
      return this.success(blogPost);
    } catch (error) {
      return this.handleError(error, "getPublicBlogPostBySlug");
    }
  }

  async createBlogPost(
    blogPostData: NewBlogPost,
    userId: string
  ): Promise<ApiResponse<BlogPost>> {
    try {
      const requiredFields: (keyof NewBlogPost)[] = [
        "title",
        "slug",
        "excerpt",
        "content",
      ];
      const validationErrors = this.validateRequired(
        blogPostData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Validate slug format (alphanumeric, hyphens, underscores)
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(blogPostData.slug)) {
        return {
          success: false,
          error:
            "Slug must contain only lowercase letters, numbers, and hyphens",
        };
      }

      // Check if slug already exists
      const existingPost = await blogRepository.findBySlug(blogPostData.slug);
      if (existingPost) {
        return {
          success: false,
          error: "A blog post with this slug already exists",
        };
      }

      // Set published date if publishing
      if (blogPostData.published && !blogPostData.publishedAt) {
        blogPostData.publishedAt = new Date();
      }

      // Add userId to blog post data
      const blogPostWithUser = { ...blogPostData, userId };
      const blogPost = await blogRepository.create(blogPostWithUser);
      return this.success(blogPost, "Blog post created successfully");
    } catch (error) {
      return this.handleError(error, "createBlogPost");
    }
  }

  async updateBlogPost(
    id: string,
    blogPostData: Partial<NewBlogPost>,
    userId?: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      // Validate slug format if provided
      if (blogPostData.slug) {
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(blogPostData.slug)) {
          return {
            success: false,
            error:
              "Slug must contain only lowercase letters, numbers, and hyphens",
          };
        }

        // Check if slug already exists (excluding current post)
        const existingPost = await blogRepository.findBySlug(blogPostData.slug);
        if (existingPost && existingPost.id !== id) {
          return {
            success: false,
            error: "A blog post with this slug already exists",
          };
        }
      }

      // Set published date if publishing for the first time
      if (blogPostData.published && !blogPostData.publishedAt) {
        const currentPost = await blogRepository.findById(id, userId);
        if (!currentPost?.published) {
          blogPostData.publishedAt = new Date();
        }
      }

      const blogPost = await blogRepository.update(id, blogPostData, userId);
      if (!blogPost) {
        return {
          success: false,
          error: "Blog post not found",
        };
      }

      return this.success(blogPost, "Blog post updated successfully");
    } catch (error) {
      return this.handleError(error, "updateBlogPost");
    }
  }

  async deleteBlogPost(
    id: string,
    userId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      await blogRepository.delete(id, userId);
      return this.success(undefined, "Blog post deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteBlogPost");
    }
  }

  async searchBlogPosts(
    filters: BlogPostFilters,
    userId?: string
  ): Promise<ApiResponse<BlogPost[]>> {
    try {
      const blogPosts = await blogRepository.search(filters, userId);
      return this.success(blogPosts);
    } catch (error) {
      return this.handleError(error, "searchBlogPosts");
    }
  }

  async updateBlogPostOrder(
    blogPostOrders: BlogPostOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    try {
      if (!blogPostOrders || blogPostOrders.length === 0) {
        return {
          success: false,
          error: "No blog post orders provided",
        };
      }

      await blogRepository.updateOrder(blogPostOrders);
      return this.success(undefined, "Blog post order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateBlogPostOrder");
    }
  }

  async toggleBlogPostVisibility(
    id: string,
    userId?: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      const blogPost = await blogRepository.toggleVisibility(id, userId);
      if (!blogPost) {
        return {
          success: false,
          error: "Blog post not found",
        };
      }

      return this.success(
        blogPost,
        "Blog post visibility toggled successfully"
      );
    } catch (error) {
      return this.handleError(error, "toggleBlogPostVisibility");
    }
  }

  async toggleBlogPostFeatured(
    id: string,
    userId?: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      const blogPost = await blogRepository.toggleFeatured(id, userId);
      if (!blogPost) {
        return {
          success: false,
          error: "Blog post not found",
        };
      }

      return this.success(
        blogPost,
        "Blog post featured status toggled successfully"
      );
    } catch (error) {
      return this.handleError(error, "toggleBlogPostFeatured");
    }
  }

  async toggleBlogPostPublished(
    id: string,
    userId?: string
  ): Promise<ApiResponse<BlogPost | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      const blogPost = await blogRepository.togglePublished(id, userId);
      if (!blogPost) {
        return {
          success: false,
          error: "Blog post not found",
        };
      }

      return this.success(
        blogPost,
        "Blog post published status toggled successfully"
      );
    } catch (error) {
      return this.handleError(error, "toggleBlogPostPublished");
    }
  }

  async incrementBlogPostViewCount(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      await blogRepository.incrementViewCount(id);
      return this.success(undefined, "View count incremented successfully");
    } catch (error) {
      return this.handleError(error, "incrementBlogPostViewCount");
    }
  }

  async incrementBlogPostLikeCount(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid blog post ID",
        };
      }

      await blogRepository.incrementLikeCount(id);
      return this.success(undefined, "Like count incremented successfully");
    } catch (error) {
      return this.handleError(error, "incrementBlogPostLikeCount");
    }
  }

  async getBlogStats(userId?: string): Promise<
    ApiResponse<{
      total: number;
      published: number;
      totalViews: number;
    }>
  > {
    try {
      const [total, published, totalViews] = await Promise.all([
        blogRepository.getTotalCount(userId),
        blogRepository.getPublishedCount(userId),
        blogRepository.getTotalViews(userId),
      ]);

      return this.success({
        total,
        published,
        totalViews,
      });
    } catch (error) {
      return this.handleError(error, "getBlogStats");
    }
  }

  async getBlogCategories(
    userId?: string
  ): Promise<ApiResponse<{ name: string; count: number }[]>> {
    try {
      const categories = await blogRepository.getCategories(userId);
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getBlogCategories");
    }
  }

  async getBlogTags(
    userId?: string
  ): Promise<ApiResponse<{ name: string; count: number }[]>> {
    try {
      const tags = await blogRepository.getTags(userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getBlogTags");
    }
  }

  async getPublicBlogStats(): Promise<
    ApiResponse<{
      totalPublished: number;
      totalViews: number;
      totalLikes: number;
      featuredCount: number;
    }>
  > {
    try {
      const [totalPublished, totalViews, totalLikes, featuredCount] =
        await Promise.all([
          blogRepository.getPublishedCount(),
          blogRepository.getTotalViews(),
          blogRepository.getTotalLikes(),
          blogRepository.getFeaturedCount(),
        ]);

      return this.success({
        totalPublished,
        totalViews,
        totalLikes,
        featuredCount,
      });
    } catch (error) {
      return this.handleError(error, "getPublicBlogStats");
    }
  }
}
