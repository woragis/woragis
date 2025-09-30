"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/layout/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/Card';
import { Input } from '@/components/ui/forms/input';
import { Textarea } from '@/components/ui/forms/textarea';
import { Label } from '@/components/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { Badge } from '@/components/ui';
import { Loader2, Sparkles, Wand2, Image as ImageIcon, FileText, RefreshCw } from 'lucide-react';

interface AIContentGeneratorProps {
  contentType: 'blog' | 'about' | 'project';
  onContentGenerated: (content: string, type: 'text' | 'image') => void;
  onImageGenerated?: (imageUrl: string) => void;
  className?: string;
}

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  contentType,
  onContentGenerated,
  onImageGenerated,
  className = ""
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [audience, setAudience] = useState('general');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: prompt,
          tone,
          length: length === 'short' ? '300-500 words' : length === 'medium' ? '800-1200 words' : '1500-2000 words',
          audience
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      if (data.success && data.content) {
        setGeneratedContent(data.content);
        onContentGenerated(data.content, 'text');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/ai/image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: contentType === 'blog' ? 'blog' : 'custom',
          params: {
            prompt: contentType === 'blog' ? prompt : prompt,
            style: 'professional',
            ...(contentType === 'blog' && { blogTitle: prompt })
          },
          saveToUploads: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        onImageGenerated?.(data.imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUseContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent, 'text');
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated?.(generatedImage);
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'blog': return 'Blog Post';
      case 'about': return 'About Content';
      case 'project': return 'Project Description';
      default: return 'Content';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI {getContentTypeLabel()} Generator
        </CardTitle>
        <CardDescription>
          Generate {getContentTypeLabel().toLowerCase()} content and images using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Topic/Prompt</Label>
          <Textarea
            id="prompt"
            placeholder={`Describe what you want to write about...`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (300-500 words)</SelectItem>
                <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                <SelectItem value="long">Long (1500-2000 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="developers">Developers</SelectItem>
                <SelectItem value="beginners">Beginners</SelectItem>
                <SelectItem value="experts">Experts</SelectItem>
                <SelectItem value="students">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Content
          </Button>
          
          <Button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage || !prompt.trim()}
            variant="outline"
            className="flex-1"
          >
            {isGeneratingImage ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            Generate Image
          </Button>
        </div>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Generated Content</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleUseContent}
                  size="sm"
                  variant="outline"
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Use Content
                </Button>
                <Button
                  onClick={() => setGeneratedContent('')}
                  size="sm"
                  variant="ghost"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Generated Image</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleUseImage}
                  size="sm"
                  variant="outline"
                >
                  <ImageIcon className="mr-1 h-3 w-3" />
                  Use Image
                </Button>
                <Button
                  onClick={() => setGeneratedImage('')}
                  size="sm"
                  variant="ghost"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <img
                src={generatedImage}
                alt="Generated"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
