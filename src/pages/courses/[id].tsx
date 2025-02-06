import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ShoppingCart } from "lucide-react";
import { Course } from "@/types";
import { useAuth } from "@/features/auth";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

interface CourseDetails extends Course {
  // Add additional fields needed for the details page
  duration: number;
  level: string;
  learningObjectives: string[];
  requirements: string[];
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const addItem = useCartStore((state) => state.addItem);

  const { data: course, isLoading } = useQuery<CourseDetails>({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (!user?.hasCompletedOnboarding) {
      navigate('/onboarding');
      return;
    }

    addItem(id!);
    toast.success('Course added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={course.thumbnail || '/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">By {course.instructor}</span>
              <span className="text-2xl font-bold">${course.price || 'Free'}</span>
            </div>
            <p className="text-gray-700 mb-6">{course.title}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Duration</h3>
                <p>{course.duration} hours</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Level</h3>
                <p>{course.level}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">What you'll learn</h3>
              <ul className="list-disc pl-5">
                {course.learningObjectives?.map((objective, index) => (
                  <li key={index} className="text-gray-700">{objective}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5">
                {course.requirements?.map((requirement, index) => (
                  <li key={index} className="text-gray-700">{requirement}</li>
                ))}
              </ul>
            </div>

            <Button className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 