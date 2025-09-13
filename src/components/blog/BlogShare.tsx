"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";

interface BlogShareProps {
  url: string;
  title: string;
  className?: string;
}

export const BlogShare: React.FC<BlogShareProps> = ({
  url,
  title,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: string) => {
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy URL:", err);
        }
        break;
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share this article:
      </span>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("twitter")}
          className="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("facebook")}
          className="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("linkedin")}
          className="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShare("copy")}
          className={`flex items-center ${
            copied
              ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          title="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="ml-1 text-xs">Copied!</span>
            </>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

