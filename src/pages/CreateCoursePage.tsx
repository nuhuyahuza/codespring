import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { useCreateCourse } from '@/features/instructor/hooks/useCreateCourse';
import { formatCurrency } from '@/lib/utils';

const COURSE_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Music',
  'Photography',
  'Health & Fitness',
  'Language',
  'Other',
];

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  duration: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export function CreateCoursePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    price: 0,
    duration: 0,
    level: 'BEGINNER',
  });

  const { createCourse, isLoading, error } = useCreateCourse();

  const handleInputChange = (
    field: keyof CourseFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThumbnailUpload = (url: string) => {
    handleInputChange('thumbnail', url);
  };

  const handleSubmit = async () => {
    try {
      const courseId = await createCourse(formData);
      navigate(`/instructor/courses/${courseId}/edit`);
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  return (
    <ProtectedRoute requiredRole="INSTRUCTOR">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
            <p className="text-muted-foreground">
              Fill in the details below to create your course
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-3 h-3 rounded-full ${
                    step >= stepNumber ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Step {step} of 3
            </span>
          </div>

          <Card>
            <CardContent className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter course title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter course description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange('category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Course Thumbnail</Label>
                    <ImageUpload
                      value={formData.thumbnail}
                      onChange={handleThumbnailUpload}
                      maxSize={5}
                      aspectRatio={16 / 9}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange('price', parseFloat(e.target.value))
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Preview: {formatCurrency(formData.price)}
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Estimated Duration (hours)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min={0}
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange('duration', parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Course Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => handleInputChange('level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 text-sm text-destructive">{error}</div>
              )}

              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    className="ml-auto"
                    onClick={() => setStep((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="ml-auto"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Course'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 