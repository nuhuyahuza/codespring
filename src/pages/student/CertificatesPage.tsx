import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Award, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  issuedAt: string;
  course: {
    title: string;
    instructor: {
      name: string;
    };
  };
}

export function CertificatesPage() {
  const { token } = useAuth();

  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/certificates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch certificates');
      return response.json();
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Certificates</h1>
      </div>

      <div className="grid gap-6">
        {certificates?.map((cert) => (
          <div
            key={cert.id}
            className="border rounded-lg p-6 bg-card flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{cert.course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Instructor: {cert.course.instructor.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Issued: {format(new Date(cert.issuedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}

        {certificates?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">No Certificates Yet</h3>
            <p>Complete courses to earn certificates</p>
          </div>
        )}
      </div>
    </div>
  );
} 