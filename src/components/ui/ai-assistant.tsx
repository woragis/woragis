'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/layout/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/Card';
import { Textarea } from '@/components/ui/forms/textarea';
import { Input } from '@/components/ui/forms/input';
import { Label } from '@/components/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { Badge } from '@/components/ui';
import { Loader2, Sparkles, MessageSquare, Image as ImageIcon, FileText, Settings } from 'lucide-react';

interface AIAssistantProps {
  type: 'content' | 'image' | 'chat' | 'admin';
  onResult?: (result: any) => void;
  className?: string;
}

export function AIAssistant({ type, onResult, className }: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Content generation state
  const [contentType, setContentType] = useState<'blog' | 'project' | 'about'>('blog');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('web developers');
  const [tone, setTone] = useState('professional and engaging');
  const [length, setLength] = useState('800-1200 words');

  // Image generation state
  const [imageType, setImageType] = useState<'instrument' | 'martial_arts' | 'project' | 'blog' | 'hobby'>('project');
  const [imageSubject, setImageSubject] = useState('');
  const [imageStyle, setImageStyle] = useState('');

  // Chat state
  const [message, setMessage] = useState('');
  const [visitorType, setVisitorType] = useState<'potential_client' | 'developer' | 'student' | 'general'>('general');

  // Admin state
  const [adminAction, setAdminAction] = useState<'form_assistance' | 'content_optimization' | 'content_analysis'>('form_assistance');
  const [adminContent, setAdminContent] = useState('');

  const handleContentGeneration = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let endpoint = '';
      let payload: any = {};

      switch (contentType) {
        case 'blog':
          endpoint = '/api/ai/generate/blog';
          payload = { topic, audience, tone, length };
          break;
        case 'project':
          endpoint = '/api/ai/generate/project';
          payload = { 
            projectName: topic,
            technologies: ['React', 'TypeScript', 'Next.js'],
            projectType: 'web application',
            features: ['Responsive design', 'Modern UI'],
            challenges: ['Performance optimization']
          };
          break;
        case 'about':
          endpoint = '/api/ai/generate/about';
          payload = { 
            category: topic,
            currentInfo: 'Current information about the topic',
            goals: 'Continue learning and growing',
            experienceLevel: 'intermediate'
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        onResult?.(data);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        type: imageType,
        params: {
          [imageType === 'instrument' ? 'instrument' : 
           imageType === 'martial_arts' ? 'martialArt' :
           imageType === 'project' ? 'projectName' :
           imageType === 'blog' ? 'blogTitle' : 'hobby']: imageSubject,
          style: imageStyle || undefined
        }
      };

      const response = await fetch('/api/ai/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        onResult?.(data);
      } else {
        setError(data.error || 'Image generation failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          visitorType,
          context: 'General inquiry'
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        onResult?.(data);
      } else {
        setError(data.error || 'Chat failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/admin/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: adminAction,
          params: {
            content: adminContent,
            contentType: 'general',
            goals: ['improve quality']
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        onResult?.(data);
      } else {
        setError(data.error || 'Admin action failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentGeneration = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content-type">Content Type</Label>
        <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blog">Blog Post</SelectItem>
            <SelectItem value="project">Project Description</SelectItem>
            <SelectItem value="about">About Content</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="topic">Topic/Subject</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic or subject"
        />
      </div>

      <div>
        <Label htmlFor="audience">Target Audience</Label>
        <Input
          id="audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g., web developers, students, general audience"
        />
      </div>

      <div>
        <Label htmlFor="tone">Tone</Label>
        <Input
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="e.g., professional, casual, technical"
        />
      </div>

      <div>
        <Label htmlFor="length">Length</Label>
        <Input
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          placeholder="e.g., 500 words, 800-1200 words"
        />
      </div>

      <Button onClick={handleContentGeneration} disabled={isLoading || !topic}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Generate Content
      </Button>
    </div>
  );

  const renderImageGeneration = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-type">Image Type</Label>
        <Select value={imageType} onValueChange={(value: any) => setImageType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instrument">Instrument</SelectItem>
            <SelectItem value="martial_arts">Martial Arts</SelectItem>
            <SelectItem value="project">Project Thumbnail</SelectItem>
            <SelectItem value="blog">Blog Featured Image</SelectItem>
            <SelectItem value="hobby">Hobby Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="image-subject">Subject</Label>
        <Input
          id="image-subject"
          value={imageSubject}
          onChange={(e) => setImageSubject(e.target.value)}
          placeholder="e.g., guitar, karate, portfolio website"
        />
      </div>

      <div>
        <Label htmlFor="image-style">Style (Optional)</Label>
        <Input
          id="image-style"
          value={imageStyle}
          onChange={(e) => setImageStyle(e.target.value)}
          placeholder="e.g., modern, vintage, minimalist"
        />
      </div>

      <Button onClick={handleImageGeneration} disabled={isLoading || !imageSubject}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" aria-label="Generate image" />}
        Generate Image
      </Button>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="visitor-type">Visitor Type</Label>
        <Select value={visitorType} onValueChange={(value: any) => setVisitorType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="potential_client">Potential Client</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="general">General Visitor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          rows={4}
        />
      </div>

      <Button onClick={handleChat} disabled={isLoading || !message}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
        Send Message
      </Button>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="admin-action">Admin Action</Label>
        <Select value={adminAction} onValueChange={(value: any) => setAdminAction(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="form_assistance">Form Assistance</SelectItem>
            <SelectItem value="content_optimization">Content Optimization</SelectItem>
            <SelectItem value="content_analysis">Content Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="admin-content">Content</Label>
        <Textarea
          id="admin-content"
          value={adminContent}
          onChange={(e) => setAdminContent(e.target.value)}
          placeholder="Enter content to analyze or optimize..."
          rows={4}
        />
      </div>

      <Button onClick={handleAdminAction} disabled={isLoading || !adminContent}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
        Process
      </Button>
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'content': return 'Content Generation';
      case 'image': return 'Image Generation';
      case 'chat': return 'Chat Assistant';
      case 'admin': return 'Admin Assistant';
      default: return 'AI Assistant';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'content': return 'Generate high-quality content for your portfolio';
      case 'image': return 'Create custom images for your projects and content';
      case 'chat': return 'Test the chat functionality for visitors';
      case 'admin': return 'Get AI assistance with admin tasks';
      default: return 'AI-powered assistance for your portfolio';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'content': return <FileText className="h-5 w-5" />;
      case 'image': return <ImageIcon className="h-5 w-5" aria-label="Image generation" />;
      case 'chat': return <MessageSquare className="h-5 w-5" />;
      case 'admin': return <Settings className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {type === 'content' && renderContentGeneration()}
        {type === 'image' && renderImageGeneration()}
        {type === 'chat' && renderChat()}
        {type === 'admin' && renderAdmin()}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Success
            </Badge>
            
            {type === 'content' && result.content && (
              <div className="p-3 bg-gray-50 border rounded-md">
                <h4 className="font-medium mb-2">Generated Content:</h4>
                <div className="text-sm whitespace-pre-wrap">{result.content}</div>
              </div>
            )}

            {type === 'image' && result.imageUrl && (
              <div className="p-3 bg-gray-50 border rounded-md">
                <h4 className="font-medium mb-2">Generated Image:</h4>
                <Image 
                  src={result.imageUrl} 
                  alt="Generated" 
                  width={400}
                  height={300}
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}

            {type === 'chat' && result.response && (
              <div className="p-3 bg-gray-50 border rounded-md">
                <h4 className="font-medium mb-2">AI Response:</h4>
                <div className="text-sm">{result.response}</div>
              </div>
            )}

            {type === 'admin' && result.result && (
              <div className="p-3 bg-gray-50 border rounded-md">
                <h4 className="font-medium mb-2">Result:</h4>
                <div className="text-sm whitespace-pre-wrap">
                  {typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
