import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ActivityData {
  enrollments: Array<{
    date: string;
    count: number;
  }>;
  revenue: Array<{
    date: string;
    amount: number;
  }>;
  ratings: Array<{
    date: string;
    average: number;
    count: number;
  }>;
}

interface AnalyticsProps {
  data: ActivityData;
  type: 'recent' | 'full';
}

export function Analytics({ data, type }: AnalyticsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const enrollmentData = data.enrollments.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  const revenueData = data.revenue.map((item) => ({
    ...item,
    date: formatDate(item.date),
    formattedAmount: formatCurrency(item.amount),
  }));

  const ratingData = data.ratings.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="space-y-6">
      {/* Enrollments Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [value, 'Enrollments']}
                />
                <Bar
                  dataKey="count"
                  name="Enrollments"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={(value: number) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Revenue',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {type === 'full' && (
        <Card>
          <CardHeader>
            <CardTitle>Course Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value: number) => `${value} reviews`}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="average"
                    name="Average Rating"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    name="Number of Reviews"
                    stroke="#16a34a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 