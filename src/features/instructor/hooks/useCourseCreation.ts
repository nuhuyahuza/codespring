import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface CourseData {
  basics?: {
    title: string;
    description: string;
    category: string;
    level: string;
    language: string;
    thumbnail?: File;
    tags: string[];
  };
  requirements?: {
    learningObjectives: string[];
    requirements: string[];
  };
  curriculum?: {
    sections: Array<{
      id: string;
      title: string;
      description?: string;
      lessons: Array<{
        id: string;
        title: string;
        type: 'VIDEO' | 'READING' | 'QUIZ' | 'ASSIGNMENT';
        content?: string;
        duration?: number;
        order: number;
        videoUrl?: string;
        videoProvider?: 'LOCAL' | 'YOUTUBE';
        videoThumbnail?: string;
      }>;
      order: number;
    }>;
  };
  pricing?: {
    price: number;
    isLiveEnabled: boolean;
    hasCertification: boolean;
    certificationPrice?: number;
    status: 'DRAFT' | 'PUBLISHED';
    liveSessionDetails?: {
      maxStudents: number;
      sessionDuration: number;
      scheduleType: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY';
    };
  };
  completedSteps?: string;
  lastSavedStep?: string;
}

interface ApiResponse {
    id: string;
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    language?: string;
    tags?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    lastSavedStep?: string;
    completedSteps?: string;
    [key: string]: any;
  };


export function useCourseCreation(courseId?: string) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseData>({});

  const fetchCourseData = async () => {
    if (!courseId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }) as ApiResponse;

      console.log('API Response:', response);

      // Transform the data to match our state structure
      const transformedData: CourseData = {
        basics: {
          title: response.data.title || '',
          description: response.data.description || '',
          category: response.data.category || '',
          level: response.data.level || 'BEGINNER',
          language: response.data.language || 'English',
          tags: response.data.tags ? response.data.tags.split(',').filter(Boolean) : [],
        },
        requirements: {
          learningObjectives: response.data.learningObjectives ? JSON.parse(response.data.learningObjectives as string) : [],
          requirements: response.data.requirements ? JSON.parse(response.data.requirements as string) : [],
        },
        curriculum: {
          sections: Array.isArray(response.data.sections) ? response.data.sections.map((section: any) => ({
            id: section.id,
            title: section.title,
            description: section.description || '',
            lessons: Array.isArray(section.lessons) ? section.lessons.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              type: lesson.type || 'VIDEO',
              content: lesson.content || '',
              duration: lesson.duration || 0,
              order: lesson.order || 0
            })) : [],
            order: section.order || 0
          })) : []
        },
        pricing: {
          price: Number(response.data.price) || 0,
          isLiveEnabled: Boolean(response.data.isLiveEnabled),
          hasCertification: false,
          status: (response.data.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT') as 'DRAFT' | 'PUBLISHED',
          liveSessionDetails: response.data.liveSessionDetails ? JSON.parse(response.data.liveSessionDetails as string) : undefined,
        },
        completedSteps: response.data.completedSteps || '[]',
        lastSavedStep: response.data.lastSavedStep || 'basics'
      };

      console.log('Transformed Data:', transformedData);
      setCourseData(transformedData);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course data on mount if courseId exists
  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const saveStep = async (step: string, data: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to create a course');
      return;
    }

    setIsLoading(true);
    try {
      let payload;
      let endpoint: string;
      
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch (step) {
        case 'basics':
          endpoint = courseId ? `/courses/${courseId}` : '/courses';
          payload = {
            title: data.title,
            description: data.description,
            category: data.category,
            level: data.level,
            language: data.language,
            tags: data.tags.join(','),
            lastSavedStep: step,
            completedSteps: JSON.stringify([step]),
            status: 'DRAFT',
            duration: 0,
            instructor: {
              connect: {
                id: user.id
              }
            }
          };
          break;

        case 'requirements':
          const storedCourseId = courseId || sessionStorage.getItem('currentCourseId');
          if (!storedCourseId) {
            throw new Error('Course ID not found');
          }
          endpoint = `/courses/${storedCourseId}/${step}`;
          const prevCompletedSteps = courseData.completedSteps ? JSON.parse(courseData.completedSteps as string) : [];
          payload = {
            learningObjectives: JSON.stringify(data.learningObjectives),
            requirements: JSON.stringify(data.requirements),
            lastSavedStep: step,
            completedSteps: JSON.stringify([...new Set([...prevCompletedSteps, step])])
          };
          break;

        case 'curriculum':
          const storedCourseIdCurriculum = courseId || sessionStorage.getItem('currentCourseId');
          if (!storedCourseIdCurriculum) {
            throw new Error('Course ID not found');
          }
          endpoint = `/courses/${storedCourseIdCurriculum}/${step}`;
          const curriculumCompletedSteps = courseData.completedSteps ? JSON.parse(courseData.completedSteps as string) : [];
          payload = {
            sections: {
              create: data.sections.map((section: any, index: number) => ({
                title: section.title,
                description: section.description,
                order: index,
                lessons: {
                  create: section.lessons.map((lesson: any, lessonIndex: number) => ({
                    title: lesson.title,
                    type: lesson.type,
                    content: lesson.content,
                    duration: lesson.duration || 0,
                    order: lessonIndex
                  }))
                }
              }))
            },
            lastSavedStep: step,
            completedSteps: JSON.stringify([...new Set([...curriculumCompletedSteps, step])])
          };
          break;

        case 'pricing':
          const storedCourseIdPricing = courseId || sessionStorage.getItem('currentCourseId');
          if (!storedCourseIdPricing) {
            throw new Error('Course ID not found');
          }
          endpoint = `/courses/${storedCourseIdPricing}/${step}`;
          const pricingCompletedSteps = courseData.completedSteps ? JSON.parse(courseData.completedSteps as string) : [];
          payload = {
            price: Number(data.price) || 0,
            isLiveEnabled: Boolean(data.isLiveEnabled),
            liveSessionDetails: data.isLiveEnabled ? JSON.stringify(data.liveSessionDetails) : null,
            lastSavedStep: step,
            completedSteps: JSON.stringify([...new Set([...pricingCompletedSteps, step])]),
            status: data.status || 'DRAFT'
          };
          break;

        default:
          throw new Error(`Unknown step: ${step}`);
      }

      console.log('Sending request to:', endpoint);
      console.log('With payload:', payload);

      const response = await api.post(endpoint, payload, { headers }) as ApiResponse;
      console.log("Shado",response);

      // Store the course ID immediately after creating the course
      if (!courseId) {
        sessionStorage.setItem('currentCourseId', response.id);
      }

      // Update state and return
      setCourseData(prev => ({
        ...prev,
        [step]: data,
        lastSavedStep: step,
        completedSteps: JSON.stringify([step])
      }));

      toast.success('Progress saved successfully');
      return response;
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save progress';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const publishCourse = async () => {
    if (!courseId) {
      toast.error('Course ID is required to publish');
      return;
    }

    setIsLoading(true);
    try {
      await api.patch(`/courses/${courseId}/status`, 
        { status: 'PUBLISHED' },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Course published successfully');
      navigate('/dashboard/courses');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish course');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courseData,
    isLoading,
    saveStep,
    publishCourse,
  };
} 