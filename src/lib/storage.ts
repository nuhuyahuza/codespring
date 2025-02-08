interface UploadOptions {
  fileName: string;
  contentType: string;
  folder: string;
}

export async function uploadToStorage(
  file: Blob | Buffer,
  options: UploadOptions
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file as Blob);
  formData.append('fileName', options.fileName);
  formData.append('contentType', options.contentType);
  formData.append('folder', options.folder);

  const response = await fetch('/api/storage/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  const data = await response.json();
  return data.url;
} 