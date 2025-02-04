import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Settings, 
  CheckCircle,
  Info,
  Target,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BasicInfoStep } from '@/features/instructor/components/course-creation/BasicInfoStep';
import { RequirementsStep } from '@/features/instructor/components/course-creation/RequirementsStep';
import { CurriculumStep } from '@/features/instructor/components/course-creation/CurriculumStep';
import { PricingStep } from '@/features/instructor/components/course-creation/PricingStep';
import { useCourseCreation } from '@/features/instructor/hooks/useCourseCreation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const STEPS = [
  { 
    id: 'basics', 
    title: 'Basic Information', 
    icon: Settings,
    tips: [
      'Choose a clear and specific course title',
      'Write a compelling course description',
      'Select the appropriate category and level',
      'Upload an eye-catching thumbnail',
      'Add relevant tags to improve discoverability',
      'Choose the primary language of instruction',
    ]
  },
  { 
    id: 'requirements', 
    title: 'Requirements & Goals', 
    icon: Target,
    tips: [
      'List clear prerequisites for students',
      'Define specific learning outcomes',
      'Set realistic expectations',
      'Highlight required software or tools',
      'Break down major skills students will gain',
      'Consider your target audience level',
    ]
  },
  { 
    id: 'curriculum', 
    title: 'Course Curriculum', 
    icon: BookOpen,
    tips: [
      'Structure your content into logical sections',
      'Keep lessons focused and concise (5-15 minutes)',
      'Include a mix of theory and practical exercises',
      'Add quizzes to reinforce learning',
      'Provide downloadable resources',
      'Consider including practice assignments',
    ]
  },
  { 
    id: 'pricing', 
    title: 'Pricing & Publishing', 
    icon: DollarSign,
    tips: [
      'Research competitor pricing',
      'Consider your target audience',
      'Factor in course length and content quality',
      'Decide on certification options',
      'Choose appropriate course status',
      'Plan promotional strategies',
    ]
  },
];

export function CourseCreationPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(() => {
    return searchParams.get('step') || 'basics';
  });
  const [showTips, setShowTips] = useState(true);
  const { courseData, isLoading, saveStep, publishCourse } = useCourseCreation(courseId);
  
  // Sync URL with current step
  useEffect(() => {
    const stepFromUrl = searchParams.get('step');
    if (stepFromUrl && stepFromUrl !== currentStep) {
      setCurrentStep(stepFromUrl);
    }
  }, [searchParams]);

  const progress = ((STEPS.findIndex(step => step.id === currentStep) + 1) / STEPS.length) * 100;

  const handleSaveAndContinue = async (stepData: any) => {
    try {
      await saveStep(currentStep, stepData);
      
      // Move to next step
      const currentIndex = STEPS.findIndex(step => step.id === currentStep);
      if (currentIndex < STEPS.length - 1) {
        const nextStep = STEPS[currentIndex + 1].id;
        setCurrentStep(nextStep);
        // Only update URL if we have a courseId
        if (courseId) {
          navigate(`/dashboard/courses/${courseId}/edit?step=${nextStep}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  const handleStepChange = (stepId: string) => {
    // Only allow moving to next step if current step is completed
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    const targetIndex = STEPS.findIndex(step => step.id === stepId);
    
    if (targetIndex <= currentIndex || courseData[currentStep as keyof typeof courseData]) {
      setCurrentStep(stepId);
      // Only update URL if we have a courseId
      if (courseId) {
        navigate(`/dashboard/courses/${courseId}/edit?step=${stepId}`, { replace: true });
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <BasicInfoStep
            initialData={courseData.basics}
            onSave={handleSaveAndContinue}
          />
        );
      case 'requirements':
        return (
          <RequirementsStep
            initialData={courseData.requirements}
            onSave={handleSaveAndContinue}
          />
        );
      case 'curriculum':
        return (
          <CurriculumStep
            onSave={handleSaveAndContinue}
          />
        );
      case 'pricing':
        return (
          <PricingStep
            initialData={courseData.pricing}
            onSave={async (data) => {
              await handleSaveAndContinue(data);
              if (data.status === 'PUBLISHED') {
                await publishCourse();
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="INSTRUCTOR">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">
              {courseId ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow the steps below to {courseId ? 'edit your' : 'create your'} course
            </p>
          </div>

          <Progress value={progress} className="h-2 bg-green-100" />

          <div className="grid md:grid-cols-4 gap-6">
            {/* Steps Navigation */}
            <div className="space-y-2">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = courseData[step.id as keyof typeof courseData];
                const isDisabled = !isCompleted && STEPS.findIndex(s => s.id === step.id) > 
                  STEPS.findIndex(s => s.id === currentStep);
                
                return (
                  <Button
                    key={step.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? 'bg-green-50 text-green-700' : ''
                    } ${isCompleted ? 'text-green-600' : ''}`}
                    onClick={() => handleStepChange(step.id)}
                    disabled={isLoading || isDisabled}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {step.title}
                    {isCompleted && <CheckCircle className="h-4 w-4 ml-auto" />}
                  </Button>
                );
              })}
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">
              {/* Tips Card */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Info className="h-5 w-5" />
                      Tips for this step
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTips(!showTips)}
                      className="text-green-700 hover:text-green-800 hover:bg-green-100"
                    >
                      {showTips ? 'Hide Tips' : 'Show Tips'}
                    </Button>
                  </div>
                </CardHeader>
                {showTips && (
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-green-700">
                      {STEPS.find(step => step.id === currentStep)?.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>

              {/* Step Content */}
              <Card>
                <CardContent className="p-6">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 