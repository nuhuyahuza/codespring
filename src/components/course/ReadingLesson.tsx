import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ComponentProps } from 'react';

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

interface ReadingLessonProps {
  content: string;
  className?: string;
}

export function ReadingLesson({ content, className }: ReadingLessonProps) {
  return (
    <Card className={cn("p-6 bg-muted/30", className)}>
      <ScrollArea className="h-full">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </Card>
  );
} 