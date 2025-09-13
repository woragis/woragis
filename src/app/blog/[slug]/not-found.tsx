import Link from "next/link";
import { Container, Card, Button } from "@/components/ui";
import { ArrowLeft, FileX } from "lucide-react";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-12">
            <div className="mb-8">
              <FileX className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Article Not Found
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                The article you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/blog">
                <Button className="inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Looking for something specific?</p>
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Browse all articles
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
