"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "./badge";

interface ProjectMarkdownRendererProps {
  content: string;
  className?: string;
}

export const ProjectMarkdownRenderer: React.FC<ProjectMarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for code blocks
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="relative">
                <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg">
                  <span className="text-sm font-medium">{match[1]}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));
                    }}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom styling for images with positioning support
          img: ({ src, alt, ...props }) => {
            // Check for positioning classes in alt text
            const altText = alt || "";
            const isLeft = altText.includes("left");
            const isRight = altText.includes("right");
            const isCenter = altText.includes("center");
            
            let alignmentClass = "";
            if (isLeft) alignmentClass = "float-left mr-4 mb-4";
            else if (isRight) alignmentClass = "float-right ml-4 mb-4";
            else if (isCenter) alignmentClass = "mx-auto block";
            
            return (
              <img
                src={src}
                alt={altText.replace(/\[(left|right|center)\]/g, "").trim()}
                className={`rounded-lg shadow-lg max-w-full h-auto ${alignmentClass}`}
                {...props}
              />
            );
          },
          // Custom styling for blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Custom styling for tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
              {...props}
            >
              {children}
            </td>
          ),
          // Custom styling for links
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          // Custom styling for lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-2" {...props}>
              {children}
            </ol>
          ),
          // Custom styling for headings
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4"
              {...props}
            >
              {children}
            </h3>
          ),
          // Custom styling for paragraphs
          p: ({ children, ...props }) => (
            <p
              className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
              {...props}
            >
              {children}
            </p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
