import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    User: {
      name: string;
    };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Link to={`/courses/${course.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={course.imageUrl || "/placeholder-course.jpg"}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {course.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              By {course.User.name}
            </span>
            <span className="font-semibold text-primary">
              ${course.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 