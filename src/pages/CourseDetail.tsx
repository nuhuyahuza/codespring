
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Play, BookOpen, FileText, MessageSquare, Award } from "lucide-react";

interface CourseModule {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  image: string;
  isCompleted: boolean;
  instructor: string;
  duration: string;
  level: string;
  modules: CourseModule[];
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch course details
    const fetchCourse = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      const mockCourses: Record<string, Course> = {
        "1": {
          id: "1",
          title: "Advanced JavaScript Development",
          description: "Learn advanced JavaScript concepts including closures, prototypes, and async patterns. This course will take you from intermediate to advanced level with practical examples and real-world applications.",
          progress: 65,
          image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
          isCompleted: false,
          instructor: "Sarah Johnson",
          duration: "12 hours",
          level: "Advanced",
          modules: [
            { id: "1-1", title: "Modern JavaScript Fundamentals", duration: "1h 20m", isCompleted: true },
            { id: "1-2", title: "Advanced Closures and Scope", duration: "1h 45m", isCompleted: true },
            { id: "1-3", title: "Prototypal Inheritance", duration: "2h 10m", isCompleted: true },
            { id: "1-4", title: "Asynchronous JavaScript", duration: "2h 30m", isCompleted: false },
            { id: "1-5", title: "Error Handling & Debugging", duration: "1h 55m", isCompleted: false },
            { id: "1-6", title: "JavaScript Design Patterns", duration: "2h 20m", isCompleted: false },
          ]
        },
        "2": {
          id: "2",
          title: "React Fundamentals",
          description: "Master the basics of React, including components, props, state, and hooks. This course provides a solid foundation for building modern web applications with React.",
          progress: 92,
          image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
          isCompleted: false,
          instructor: "Michael Chen",
          duration: "10 hours",
          level: "Intermediate",
          modules: [
            { id: "2-1", title: "React Core Concepts", duration: "1h 30m", isCompleted: true },
            { id: "2-2", title: "Components & Props", duration: "1h 50m", isCompleted: true },
            { id: "2-3", title: "State Management", duration: "2h 15m", isCompleted: true },
            { id: "2-4", title: "React Hooks", duration: "2h 25m", isCompleted: true },
            { id: "2-5", title: "Forms & Validation", duration: "1h 40m", isCompleted: false },
          ]
        },
      };

      setTimeout(() => {
        if (courseId && mockCourses[courseId]) {
          setCourse(mockCourses[courseId]);
        }
        setLoading(false);
      }, 500);
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4 h-8 animate-pulse">
          <div className="h-8 w-40 bg-muted rounded-md"></div>
        </div>
        <div className="w-full h-[400px] bg-muted rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/courses")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">Course not found</h3>
          <p className="text-muted-foreground mt-1">
            The course you're looking for doesn't exist or has been removed
          </p>
        </div>
      </div>
    );
  }

  const completedModules = course.modules.filter(module => module.isCompleted).length;
  const completionPercentage = Math.round((completedModules / course.modules.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/courses")}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden rounded-md mb-4">
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>Course Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
            
            <Button size="lg" className="w-full gap-2 shadow-sm">
              <Play size={18} />
              <span>Continue Learning</span>
            </Button>
          </DashboardCard>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="flex gap-2 items-center">
                <BookOpen size={16} />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex gap-2 items-center">
                <FileText size={16} />
                <span className="hidden sm:inline">Assignments</span>
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex gap-2 items-center">
                <MessageSquare size={16} />
                <span className="hidden sm:inline">Discussions</span>
              </TabsTrigger>
              <TabsTrigger value="certificate" className="flex gap-2 items-center">
                <Award size={16} />
                <span className="hidden sm:inline">Certificate</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <DashboardCard className="overflow-hidden">
                <h3 className="text-lg font-medium mb-4">Course Modules</h3>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div 
                      key={module.id}
                      className={`p-4 rounded-lg border ${module.isCompleted ? 'bg-green-50 border-green-100' : 'bg-background'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium flex items-center">
                            <span className="bg-primary/10 text-primary w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">
                              {index + 1}
                            </span>
                            {module.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">Duration: {module.duration}</p>
                        </div>
                        <Button variant={module.isCompleted ? "outline" : "default"} size="sm">
                          {module.isCompleted ? "Review" : "Start"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </TabsContent>
            
            <TabsContent value="assignments" className="space-y-4">
              <DashboardCard>
                <h3 className="text-lg font-medium mb-4">Course Assignments</h3>
                <p className="text-muted-foreground">No assignments available for this course yet.</p>
              </DashboardCard>
            </TabsContent>
            
            <TabsContent value="discussions" className="space-y-4">
              <DashboardCard>
                <h3 className="text-lg font-medium mb-4">Discussion Forum</h3>
                <p className="text-muted-foreground">Join the discussion with fellow students and instructors.</p>
                <Button className="mt-4">View Discussions</Button>
              </DashboardCard>
            </TabsContent>
            
            <TabsContent value="certificate" className="space-y-4">
              <DashboardCard>
                <h3 className="text-lg font-medium mb-4">Course Certificate</h3>
                <p className="text-muted-foreground">
                  Complete {completionPercentage}% of the course to unlock your certificate.
                </p>
                <div className="mt-4">
                  <Progress value={completionPercentage} className="h-2 mb-2" />
                  <p className="text-sm">{completedModules} of {course.modules.length} modules completed</p>
                </div>
              </DashboardCard>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Course Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{course.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="font-medium">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="font-medium">{course.progress}% Complete</p>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">Course Notes</Button>
              <Button variant="outline" className="w-full justify-start">Code Repository</Button>
              <Button variant="outline" className="w-full justify-start">Reference Materials</Button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
