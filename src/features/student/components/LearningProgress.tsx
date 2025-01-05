import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProgressData {
  date: string;
  hoursSpent: number;
  lessonsCompleted: number;
}

interface LearningProgressProps {
  progress: ProgressData[];
}

export function LearningProgress({ progress }: LearningProgressProps) {
  const totalHours = progress.reduce((sum, day) => sum + day.hoursSpent, 0);
  const totalLessons = progress.reduce(
    (sum, day) => sum + day.lessonsCompleted,
    0
  );
  const averageHoursPerDay =
    progress.length > 0 ? (totalHours / progress.length).toFixed(1) : '0';

  const formattedData = progress.map((day) => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              Time spent learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Lessons Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Total lessons finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average Daily Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHoursPerDay}h</div>
            <p className="text-xs text-muted-foreground">
              Hours per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="hoursSpent"
                  name="Hours Spent"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="lessonsCompleted"
                  name="Lessons Completed"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 