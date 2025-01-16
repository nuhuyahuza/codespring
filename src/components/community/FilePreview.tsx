import { useState } from 'react';
import { FileIcon, X, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FilePreviewProps {
  file: {
    name: string;
    url: string;
    type: string;
  };
}

export function FilePreview({ file }: FilePreviewProps) {
  return (
    <div className="p-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">{file.name}</h3>
        {file.type.startsWith('image/') ? (
          <img src={file.url} alt={file.name} className="max-w-full h-auto" />
        ) : (
          <div className="text-muted-foreground">
            File preview not available
          </div>
        )}
      </div>
    </div>
  );
} 