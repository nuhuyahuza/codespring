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
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (certificates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Award className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Complete courses to earn certificates
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <Card key={certificate.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {certificate.courseTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Issued on {formatDate(certificate.issueDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Credential ID: {certificate.credential}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(`/certificates/${certificate.id}/download`, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(`/certificates/${certificate.id}/verify`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 