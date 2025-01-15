import { useQuery } from '@tanstack/react-query';
import { Download, Search, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface Certificate {
  id: string;
  courseTitle: string;
  issuedDate: string;
  grade: number;
  instructorName: string;
  certificateUrl: string;
  status: 'issued' | 'pending';
  completionDate: string;
}

export function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      const response = await api.get('/student/certificates');
      return response.data;
    },
  });

  const filteredCertificates = certificates?.filter(cert =>
    cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = async (certificateId: string) => {
    try {
      const response = await api.get(`/student/certificates/${certificateId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate. Please try again.');
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Certificates</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certificates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates?.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {certificate.courseTitle}
                  </CardTitle>
                  <Badge variant={certificate.status === 'issued' ? 'default' : 'secondary'}>
                    {certificate.status === 'issued' ? 'Issued' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Instructor: {certificate.instructorName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(certificate.completionDate), 'PPP')}
                    </div>
                    {certificate.grade && (
                      <div className="text-sm font-medium">
                        Grade: {certificate.grade}%
                      </div>
                    )}
                  </div>
                  {certificate.status === 'issued' && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleDownload(certificate.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCertificates?.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No certificates found.
            </div>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
} 