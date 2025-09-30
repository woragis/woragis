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

interface AIAboutGeneratorProps {
  category: 'instruments' | 'martial-arts' | 'languages' | 'hobbies' | 'music' | 'anime' | 'books' | 'games' | 'politics' | 'youtubers';
  onContentGenerated: (content: string, type: 'text' | 'image') => void;
  onImageGenerated?: (imageUrl: string) => void;
  currentInfo?: string;
  itemId?: string;
  className?: string;
}

export const AIAboutGenerator: React.FC<AIAboutGeneratorProps> = ({
  category,
  onContentGenerated,
  onImageGenerated,
  currentInfo = '',
  itemId,
  className = ""
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [goals, setGoals] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          currentInfo: prompt,
          goals,
          experienceLevel,
          itemId
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
          type: category,
          params: {
            prompt: prompt,
            style: 'professional'
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

  const getCategoryLabel = () => {
    const labels = {
      'instruments': 'Musical Instruments',
      'martial-arts': 'Martial Arts',
      'languages': 'Languages',
      'hobbies': 'Hobbies',
      'music': 'Music',
      'anime': 'Anime',
      'books': 'Books',
      'games': 'Games',
      'politics': 'Politics',
      'youtubers': 'YouTubers'
    };
    return labels[category] || category;
  };

  const getPlaceholder = () => {
    const placeholders = {
      'instruments': 'Describe your musical instruments, learning progress, or musical interests...',
      'martial-arts': 'Describe your martial arts training, techniques, or achievements...',
      'languages': 'Describe the languages you speak, your proficiency levels, or learning goals...',
      'hobbies': 'Describe your hobbies, interests, or activities you enjoy...',
      'music': 'Describe your music preferences, favorite genres, or musical experiences...',
      'anime': 'Describe your favorite anime, genres, or anime-related interests...',
      'books': 'Describe your favorite books, genres, or reading habits...',
      'games': 'Describe your favorite games, gaming preferences, or gaming achievements...',
      'politics': 'Describe your political views, interests, or opinions...',
      'youtubers': 'Describe your favorite YouTubers, channels, or content creators...'
    };
    return placeholders[category] || 'Describe your interests and experiences...';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI {getCategoryLabel()} Generator
        </CardTitle>
        <CardDescription>
          Generate {getCategoryLabel().toLowerCase()} content and images using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Info Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Current Information</Label>
          <Textarea
            id="prompt"
            placeholder={getPlaceholder()}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Goals Input */}
        <div className="space-y-2">
          <Label htmlFor="goals">Goals & Objectives</Label>
          <Input
            id="goals"
            placeholder="What are your goals or objectives in this area?"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
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
