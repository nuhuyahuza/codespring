
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";


interface CourseCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnail: string | null;
  progress: number;
  className?: string;
  instructor: {
    name: string;
  };
}

export function CourseCard({
  id,
  title,
  description,
  progress,
  thumbnail,
  className,
  instructor
}: CourseCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <DashboardCard className={cn("overflow-hidden", className)}>
      <div className="aspect-video relative overflow-hidden rounded-md mb-4">
        <div 
          className={cn(
            "absolute inset-0 bg-muted skeleton", 
            imageLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        <img
          src={thumbnail || "/images/placeholders/course-default.jpg"}
          alt={title}
          className={cn(
            "object-cover w-full h-full transition-all duration-500",
            !imageLoaded && "image-blur-loading"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      )}
      {instructor && (<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{instructor.name}</p>)}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span>{progress === 100 ? "Completed" : "Progress"}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      <div className="mt-4">
        <Button asChild className="w-full gap-2 shadow-sm">
          <Link to={`/student/courses/${id}/learn`}>
            <Play size={16} />
            <span>{ progress === 100 ? "Review Course" : (progress > 0 && progress < 100 ? "Resume Course" : "Start Course")}</span>
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
