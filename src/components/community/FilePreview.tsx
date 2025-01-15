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
    url: string;
    name: string;
    type: string;
  };
  onRemove?: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-muted rounded">
        <FileIcon className="h-4 w-4" />
        <span className="text-sm truncate flex-1">{file.name}</span>
        <div className="flex gap-1">
          {(isImage || isPDF) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(file.url, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isImage && (
              <img
                src={file.url}
                alt={file.name}
                className="max-h-[70vh] object-contain mx-auto"
              />
            )}
            {isPDF && (
              <iframe
                src={`${file.url}#view=FitH`}
                className="w-full h-[70vh]"
                title={file.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 