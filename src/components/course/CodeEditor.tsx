import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Play, Loader2, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORTED_LANGUAGES = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
} as const;

type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  className?: string;
}

const SAMPLE_CODE: Record<SupportedLanguage, string> = {
  javascript: `// JavaScript code...`,
  typescript: `// TypeScript code...`,
  python: `# Python code...`,
  java: `// Java code...`,
  cpp: `// C++ code...`,
  csharp: `// C# code...`,
  php: `<?php\n// PHP code...\n?>`,
  ruby: `# Ruby code...`,
  go: `// Go code...`,
  rust: `// Rust code...`
};

export function CodeEditor({ 
  defaultLanguage = 'javascript',
  defaultValue = SAMPLE_CODE.javascript,
  className 
}: CodeEditorProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage as SupportedLanguage);
  const [code, setCode] = useState(defaultValue);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    setCode(SAMPLE_CODE[language] || SAMPLE_CODE.javascript);
  }, [language]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      if (language === 'javascript') {
        const logs: string[] = [];
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        try {
          const fn = new Function(code);
          await fn();
          setOutput(logs.join('\n'));
        } finally {
          console.log = originalConsoleLog;
        }
      } else {
        setOutput(
          `Note: ${SUPPORTED_LANGUAGES[language]} code execution is not supported in the browser.\n\n` +
          `To run this code, you would need:\n` +
          `1. A ${SUPPORTED_LANGUAGES[language]} interpreter/compiler\n` +
          `2. Proper backend setup for code execution\n` +
          `3. Security measures for safe code execution\n\n` +
          `This is your ${SUPPORTED_LANGUAGES[language]} code:\n` +
          `----------------------------------------\n` +
          code
        );
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            <span className="font-medium">Code Editor</span>
          </div>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as SupportedLanguage)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          size="sm"
          onClick={handleRunCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="min-h-[300px] border rounded-lg overflow-hidden">
          <Editor
            height="300px"
            language={language}
            defaultValue={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="min-h-[300px] bg-zinc-900 rounded-lg p-4 font-mono text-sm text-white overflow-auto">
          {output || '// Output will appear here...'}
        </div>
      </div>
    </Card>
  );
} 