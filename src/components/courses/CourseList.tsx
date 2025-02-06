import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructor: {
    name: string;
  };
  price: number;
}

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleAddToCart = (courseId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    if (!user?.hasCompletedOnboarding) {
      navigate('/onboarding');
      return;
    }

    addItem(courseId);
    toast.success('Course added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <Input
          type="search"
          placeholder="Search courses..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img
                src={course.imageUrl || '/placeholder-course.jpg'}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            </CardContent>
            <CardFooter className="p-4 border-t flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-600">By {course.instructor.name}</span>
                <span className="font-bold">${course.price || 'Free'}</span>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewCourse(course.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleAddToCart(course.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
} 