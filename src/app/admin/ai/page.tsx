'use client';

import { AIAssistant } from '@/components/ui/ai-assistant';

export default function AIAdminPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-gray-600">
          Use AI to generate content, create images, and get assistance with your portfolio management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Generation */}
        <AIAssistant 
          type="content" 
          onResult={(result) => {
            console.log('Content generated:', result);
          }}
        />

        {/* Image Generation */}
        <AIAssistant 
          type="image" 
          onResult={(result) => {
            console.log('Image generated:', result);
          }}
        />

        {/* Chat Testing */}
        <AIAssistant 
          type="chat" 
          onResult={(result) => {
            console.log('Chat response:', result);
          }}
        />

        {/* Admin Assistance */}
        <AIAssistant 
          type="admin" 
          onResult={(result) => {
            console.log('Admin result:', result);
          }}
        />
      </div>

      {/* AI Features Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">AI Features Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Content Generation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate blog posts, project descriptions, and about page content with AI assistance.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Blog post creation</li>
              <li>• Project descriptions</li>
              <li>• About page content</li>
              <li>• SEO optimization</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Image Generation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create custom images for instruments, martial arts, projects, and blog posts.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Instrument images</li>
              <li>• Martial arts photos</li>
              <li>• Project thumbnails</li>
              <li>• Blog featured images</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Chat Assistant</h3>
            <p className="text-sm text-gray-600 mb-4">
              AI-powered chat for visitors to learn about your work and get recommendations.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Project recommendations</li>
              <li>• Skill inquiries</li>
              <li>• Contact assistance</li>
              <li>• FAQ responses</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Admin Tools</h3>
            <p className="text-sm text-gray-600 mb-4">
              AI assistance for content management, optimization, and workflow improvement.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Form assistance</li>
              <li>• Content optimization</li>
              <li>• Quality analysis</li>
              <li>• Tag suggestions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Getting Started</h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. <strong>Set up OpenAI API Key:</strong> Add your OpenAI API key to the environment variables</li>
            <li>2. <strong>Choose AI Feature:</strong> Select the type of AI assistance you need</li>
            <li>3. <strong>Provide Input:</strong> Fill in the required parameters for your request</li>
            <li>4. <strong>Generate:</strong> Click the generate button and wait for the AI response</li>
            <li>5. <strong>Review & Use:</strong> Review the generated content and integrate it into your portfolio</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-4">
          <h3 className="font-semibold text-yellow-900 mb-3">Best Practices</h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>• <strong>Be Specific:</strong> Provide detailed information for better AI results</li>
            <li>• <strong>Review Content:</strong> Always review and edit AI-generated content before publishing</li>
            <li>• <strong>Monitor Costs:</strong> Keep track of API usage to manage costs</li>
            <li>• <strong>Iterate:</strong> Use AI suggestions as a starting point and refine as needed</li>
            <li>• <strong>Maintain Quality:</strong> Ensure all content aligns with your brand and standards</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4">
          <h3 className="font-semibold text-green-900 mb-3">Tips for Better Results</h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• <strong>Content Generation:</strong> Provide clear topics, target audience, and desired tone</li>
            <li>• <strong>Image Generation:</strong> Be specific about style, context, and subject matter</li>
            <li>• <strong>Chat Testing:</strong> Test different visitor types and scenarios</li>
            <li>• <strong>Admin Assistance:</strong> Use for content optimization and workflow improvement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
