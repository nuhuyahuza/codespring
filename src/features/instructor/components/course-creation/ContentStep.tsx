import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, FileText, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
interface ContentFile {
  id: string;
  file: File;
  type: 'video' | 'document' | 'other';
  title: string;
  description: string;
}

interface ContentStepProps {
  initialData?: {
    content: ContentFile[];
  };
  onSave: (data: { content: ContentFile[] }) => void;
}

export function ContentStep({ initialData, onSave }: ContentStepProps) {
  const [files, setFiles] = useState<ContentFile[]>(initialData?.content || []);
  const [currentFile, setCurrentFile] = useState<ContentFile | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        type: file.type.startsWith('video/') ? 'video' : file.type.startsWith('application/') ? 'document' : 'other',
        title: file.name,
        description: '',
      })) as ContentFile[];
      setFiles([...files, ...newFiles]);
    },
  });

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const handleUpdateFile = (id: string, updates: Partial<ContentFile>) => {
    setFiles(files.map((file) => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  return (
    <div className="space-y-8">
      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-2">Drag & drop files here, or click to select files</p>
        <p className="text-sm text-gray-500">
          Support for video files and documents
        </p>
      </div>

      {/* Uploaded Files List */}
      <div className="space-y-4">
        {files.map((file) => (
          <Card key={file.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {file.type === 'video' ? (
                  <Video className="w-8 h-8 text-blue-500" />
                ) : (
                  <FileText className="w-8 h-8 text-green-500" />
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    value={file.title}
                    onChange={(e) => handleUpdateFile(file.id, { title: e.target.value })}
                    placeholder="Enter title"
                  />
                  <Textarea
                    value={file.description}
                    onChange={(e) => handleUpdateFile(file.id, { description: e.target.value })}
                    placeholder="Enter description"
                    rows={2}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={() => onSave({ content: files })}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Save Content
      </Button>
    </div>
  );
} 