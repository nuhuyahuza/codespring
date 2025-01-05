import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  FileSpreadsheet,
  FilePdf,
  Loader2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Report {
  id: string;
  name: string;
  type: string;
  format: 'PDF' | 'EXCEL';
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

const reportTypes = [
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Detailed revenue breakdown and analysis',
  },
  {
    id: 'user-activity',
    name: 'User Activity Report',
    description: 'User engagement and activity metrics',
  },
  {
    id: 'course-performance',
    name: 'Course Performance Report',
    description: 'Course completion and rating analytics',
  },
  {
    id: 'instructor-performance',
    name: 'Instructor Performance Report',
    description: 'Instructor ratings and student feedback',
  },
];

const recentReports: Report[] = [
  {
    id: '1',
    name: 'Revenue Report - June 2023',
    type: 'Revenue Report',
    format: 'PDF',
    createdAt: '2023-06-30T10:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    name: 'User Activity Report - Q2 2023',
    type: 'User Activity Report',
    format: 'EXCEL',
    createdAt: '2023-06-29T15:30:00Z',
    status: 'completed',
  },
  {
    id: '3',
    name: 'Course Performance Report - May 2023',
    type: 'Course Performance Report',
    format: 'PDF',
    createdAt: '2023-05-31T09:15:00Z',
    status: 'completed',
  },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'EXCEL'>('PDF');
  const [dateRange, setDateRange] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast.error('Please select a report type');
      return;
    }

    try {
      setIsGenerating(true);
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and manage platform reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Create a new custom report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select
                value={selectedReport}
                onValueChange={setSelectedReport}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedReport && (
                <p className="text-sm text-muted-foreground">
                  {reportTypes.find((t) => t.id === selectedReport)?.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select
                value={dateRange}
                onValueChange={setDateRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="1m">Last month</SelectItem>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="pdf"
                    checked={reportFormat === 'PDF'}
                    onChange={() => setReportFormat('PDF')}
                  />
                  <Label htmlFor="pdf">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="excel"
                    checked={reportFormat === 'EXCEL'}
                    onChange={() => setReportFormat('EXCEL')}
                  />
                  <Label htmlFor="excel">Excel</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Include Metrics</Label>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="revenue"
                    checked={selectedMetrics.includes('revenue')}
                    onCheckedChange={(checked) => {
                      setSelectedMetrics(
                        checked
                          ? [...selectedMetrics, 'revenue']
                          : selectedMetrics.filter((m) => m !== 'revenue')
                      );
                    }}
                  />
                  <Label htmlFor="revenue">Revenue metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="users"
                    checked={selectedMetrics.includes('users')}
                    onCheckedChange={(checked) => {
                      setSelectedMetrics(
                        checked
                          ? [...selectedMetrics, 'users']
                          : selectedMetrics.filter((m) => m !== 'users')
                      );
                    }}
                  />
                  <Label htmlFor="users">User metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="courses"
                    checked={selectedMetrics.includes('courses')}
                    onCheckedChange={(checked) => {
                      setSelectedMetrics(
                        checked
                          ? [...selectedMetrics, 'courses']
                          : selectedMetrics.filter((m) => m !== 'courses')
                      );
                    }}
                  />
                  <Label htmlFor="courses">Course metrics</Label>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {report.format === 'PDF' ? (
                          <FilePdf className="h-4 w-4" />
                        ) : (
                          <FileSpreadsheet className="h-4 w-4" />
                        )}
                        <span>{report.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.format}</TableCell>
                    <TableCell>
                      {format(new Date(report.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 