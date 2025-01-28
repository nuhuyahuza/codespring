import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';
import { InstructorOnboardingPage } from './InstructorOnboardingPage';
import { Navigation } from '@/components/layout/Navigation';

const formSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.date({
    required_error: "Please select a date of birth",
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 13;
  }, "You must be at least 13 years old"),
  occupation: z.string().min(2, 'Occupation is required'),
  educationLevel: z.string().min(2, 'Education level is required'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  preferredLanguage: z.string().min(2, 'Preferred language is required'),
});

const EDUCATION_LEVELS = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Other'
];

const INTERESTS = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'UI/UX Design'
];

const LANGUAGES = [
  'English',
  'French',
  'Spanish',
  'Arabic',
  'Chinese',
  'Other'
];

export function UserOnboardingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // If user is an instructor, show instructor onboarding
  if (user?.role === 'INSTRUCTOR') {
    return <InstructorOnboardingPage />;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading('Saving your profile...');
    
    try {
      setIsSubmitting(true);
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save onboarding information');
      }

      const data = await response.json();
      toast.success('Profile completed successfully!', {
        id: toastId,
        duration: 3000,
      });

      // Navigate based on user role
      if (user?.role === 'STUDENT') {
        navigate('/courses');
      } else if (user?.role === 'INSTRUCTOR') {
        navigate('/dashboard/instructor');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save your information', {
        id: toastId,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />
      <div className="py-16">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Help us personalize your learning experience by providing some additional information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ''}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              if (date) {
                                const age = new Date().getFullYear() - date.getFullYear();
                                if (age >= 13) {
                                  field.onChange(date);
                                }
                              }
                            }}
                            max={format(new Date(new Date().setFullYear(new Date().getFullYear() - 13)), "yyyy-MM-dd")}
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[280px]",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const age = new Date().getFullYear() - date.getFullYear();
                                  return date > new Date() || age < 13;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EDUCATION_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LANGUAGES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Areas of Interest</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map((interest) => (
                            <Button
                              key={interest}
                              type="button"
                              variant={field.value.includes(interest) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const newValue = field.value.includes(interest)
                                  ? field.value.filter((i) => i !== interest)
                                  : [...field.value, interest];
                                field.onChange(newValue);
                              }}
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Complete Profile'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 