import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Flag, Lightbulb } from 'lucide-react';

interface ReadingLessonProps {
  content: string;
  className?: string;
  title: string;
  estimatedTime?: number; // in minutes
  objectives?: string[];
}

type CodeBlockProps = ComponentProps<'code'> & {
  inline?: boolean;
};

const CodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      // @ts-ignore
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export function ReadingLesson({ 
  content, 
  className,
  title,
  estimatedTime = 5,
  objectives = []
}: ReadingLessonProps) {
  return (
    <Card className={cn("bg-background", className)}>
      {/* Reading Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-medium">Reading Lesson</span>
          <div className="flex items-center gap-1 ml-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{estimatedTime} min read</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        
        {objectives.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Learning Objectives</h2>
            </div>
            <ul className="grid gap-2 ml-6">
              {objectives.map((objective, index) => (
                <li key={index} className="list-disc text-muted-foreground">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <ScrollArea className="h-[calc(100vh-20rem)] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                // Enhance other markdown elements
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-4 border-b pb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
                ),
                blockquote: ({ children }) => (
                  <div className="bg-muted/30 border-l-4 border-primary p-4 my-4 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-primary mt-1" />
                      <blockquote className="m-0">{children}</blockquote>
                    </div>
                  </div>
                ),
                // Add more custom components as needed
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
} 