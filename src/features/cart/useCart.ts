import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const useCart = () => {
  const queryClient = useQueryClient();

  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await api.post('/student/enroll', { courseId });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['enrollmentStatus'] });
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
    },
  });

  return {
    // ... rest of the component code ...
  };
};

export default useCart; 