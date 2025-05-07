import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui';
import { useAuth } from '@/features/auth';
import { Navigation } from '@/components/layout/Navigation';
import { api } from '@/lib/api';

const formSchema = z.object({
  expertise: z.array(z.string()).min(1, 'Select at least one area of expertise'),
  biography: z.string().min(100, 'Biography should be at least 100 characters'),
  teachingExperience: z.string().min(1, 'Select your teaching experience'),
  linkedinProfile: z.string().url('Please enter a valid LinkedIn URL').optional(),
  websiteUrl: z.string().url('Please enter a valid website URL').optional(),
  preferredLanguage: z.string().min(1, 'Select your preferred teaching language'),
  qualifications: z.array(z.string()).min(1, 'Add at least one qualification'),
});

const EXPERTISE_AREAS = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'UI/UX Design',
  'Digital Marketing',
  'Business',
  'Other'
];

const TEACHING_EXPERIENCE_OPTIONS = [
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Other'
];

export function InstructorOnboardingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expertise: [],
      biography: '',
      teachingExperience: '',
      linkedinProfile: '',
      websiteUrl: '',
      preferredLanguage: '',
      qualifications: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form validation state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    
    if (!form.formState.isValid) {
      console.log('Form is invalid, validation errors:', form.formState.errors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    const toastId = toast.loading('Saving your instructor profile...');
    
    try {
      setIsSubmitting(true);
      
      // Get the auth token
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Submitting values:', values);
      
      // Add auth token to request
      const response = await api.post('/instructors/onboarding', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Server response:', response);
      
      // Update user data in auth context
      await updateUser();
      
      toast.success('Profile completed successfully!', {
        id: toastId,
        duration: 3000,
      });
      
      navigate('/dashboard/instructor');
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // More detailed error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save your information. Please try again.';
      
      toast.error(errorMessage, {
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
        <div className="container max-w-3xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Instructor Profile</CardTitle>
              <CardDescription>
                Help us understand your expertise and teaching experience to better support your journey as an instructor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Areas of Expertise</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {EXPERTISE_AREAS.map((area) => (
                            <Button
                              key={area}
                              type="button"
                              variant={field.value?.includes(area) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const currentValue = field.value || [];
                                const newValue = currentValue.includes(area)
                                  ? currentValue.filter((i) => i !== area)
                                  : [...currentValue, area];
                                field.onChange(newValue);
                              }}
                            >
                              {area}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Biography</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your professional background and teaching philosophy..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teachingExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teaching Experience</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {TEACHING_EXPERIENCE_OPTIONS.map((exp) => (
                            <Button
                              key={exp}
                              type="button"
                              variant={field.value === exp ? "default" : "outline"}
                              size="sm"
                              onClick={() => field.onChange(exp)}
                            >
                              {exp}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="linkedinProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Teaching Language</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGE_OPTIONS.map((lang) => (
                            <Button
                              key={lang}
                              type="button"
                              variant={field.value === lang ? "default" : "outline"}
                              size="sm"
                              onClick={() => field.onChange(lang)}
                            >
                              {lang}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualifications & Certifications</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add your qualifications (comma-separated)"
                            onChange={(e) => {
                              const quals = e.target.value
                                .split(',')
                                .map(q => q.trim())
                                .filter(q => q.length > 0);
                              field.onChange(quals);
                            }}
                          />
                        </FormControl>
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