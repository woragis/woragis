import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { db } from "@/server/db";
import { projects, blogPosts, testimonials, users, youtubers, animeList, bookList, games } from "@/server/db/schemas";
import { eq, or, isNotNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads");
    
    // Get all files from uploads directory
    const allFiles = await getAllFiles(uploadsDir);
    
    // Get all URLs referenced in database
    const referencedUrls = await getAllReferencedUrls();
    
    // Categorize files
    const categorizedFiles = allFiles.map(file => {
      const isReferenced = referencedUrls.includes(file.url);
      const category = getFileCategory(file.relativePath);
      
      return {
        ...file,
        isReferenced,
        category,
        canDelete: !isReferenced
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        files: categorizedFiles,
        stats: {
          total: categorizedFiles.length,
          referenced: categorizedFiles.filter(f => f.isReferenced).length,
          orphaned: categorizedFiles.filter(f => !f.isReferenced).length,
          byCategory: getCategoryStats(categorizedFiles)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    
    if (!filePath) {
      return NextResponse.json(
        { success: false, error: "File path is required" },
        { status: 400 }
      );
    }

    // Security check - ensure the path is within the uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads");
    const fullPath = path.join(uploadsDir, filePath);
    const resolvedPath = path.resolve(fullPath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Check if file is referenced in database
    const fileUrl = `/uploads/${filePath}`;
    const referencedUrls = await getAllReferencedUrls();
    
    if (referencedUrls.includes(fileUrl)) {
      return NextResponse.json(
        { success: false, error: "Cannot delete file that is referenced in database" },
        { status: 400 }
      );
    }

    // Delete the file
    await fs.unlink(fullPath);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

async function getAllFiles(dir: string, baseDir: string = dir): Promise<any[]> {
  const files: any[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile() && !entry.name.startsWith('.')) {
        const stats = await fs.stat(fullPath);
        const url = `/uploads/${relativePath.replace(/\\/g, '/')}`;
        
        files.push({
          filename: entry.name,
          relativePath: relativePath.replace(/\\/g, '/'),
          fullPath: fullPath,
          url,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          extension: path.extname(entry.name).toLowerCase()
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

async function getAllReferencedUrls(): Promise<string[]> {
  const urls: string[] = [];
  
  try {
    // Get all URLs from different tables
    const [projectResults, blogResults, testimonialResults, userResults, youtuberResults, animeResults, bookResults, gameResults] = await Promise.all([
      db.select({ image: projects.image, videoUrl: projects.videoUrl }).from(projects),
      db.select({ featuredImage: blogPosts.featuredImage }).from(blogPosts),
      db.select({ avatar: testimonials.avatar }).from(testimonials),
      db.select({ avatar: users.avatar }).from(users),
      db.select({ profileImage: youtubers.profileImage }).from(youtubers),
      db.select({ coverImage: animeList.coverImage }).from(animeList),
      db.select({ coverImage: bookList.coverImage }).from(bookList),
      db.select({ coverImage: games.coverImage }).from(games)
    ]);

    // Extract URLs from results
    projectResults.forEach(row => {
      if (row.image) urls.push(row.image);
      if (row.videoUrl) urls.push(row.videoUrl);
    });

    blogResults.forEach(row => {
      if (row.featuredImage) urls.push(row.featuredImage);
    });

    testimonialResults.forEach(row => {
      if (row.avatar) urls.push(row.avatar);
    });

    userResults.forEach(row => {
      if (row.avatar) urls.push(row.avatar);
    });

    youtuberResults.forEach(row => {
      if (row.profileImage) urls.push(row.profileImage);
    });

    animeResults.forEach(row => {
      if (row.coverImage) urls.push(row.coverImage);
    });

    bookResults.forEach(row => {
      if (row.coverImage) urls.push(row.coverImage);
    });

    gameResults.forEach(row => {
      if (row.coverImage) urls.push(row.coverImage);
    });

  } catch (error) {
    console.error("Error fetching referenced URLs:", error);
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

function getFileCategory(relativePath: string): string {
  const pathParts = relativePath.split('/');
  if (pathParts.length >= 2) {
    return `${pathParts[0]}/${pathParts[1]}`;
  }
  return pathParts[0] || 'general';
}

function getCategoryStats(files: any[]): Record<string, { total: number; referenced: number; orphaned: number }> {
  const stats: Record<string, { total: number; referenced: number; orphaned: number }> = {};
  
  files.forEach(file => {
    if (!stats[file.category]) {
      stats[file.category] = { total: 0, referenced: 0, orphaned: 0 };
    }
    
    stats[file.category].total++;
    if (file.isReferenced) {
      stats[file.category].referenced++;
    } else {
      stats[file.category].orphaned++;
    }
  });
  
  return stats;
}
