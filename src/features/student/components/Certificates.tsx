import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, ExternalLink } from 'lucide-react';

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  credential: string;
}

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Certificates</h2>
          <p className="text-muted-foreground">
            View and download your earned certificates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">{certificates.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardHeader>
              <CardTitle className="line-clamp-2">{certificate.courseTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Issued on {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="font-medium">Credential ID:</span>{' '}
                  <code className="rounded bg-muted px-1 py-0.5">
                    {certificate.credential}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Award className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Certificates Yet</h3>
            <p className="text-muted-foreground">
              Complete courses to earn certificates
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 