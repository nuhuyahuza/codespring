import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export const formatCurrency = formatPrice;

export function calculateProgress(lessonProgress: any[] = []) {
  if (!lessonProgress || lessonProgress.length === 0) return 0;
  const completedLessons = lessonProgress.filter((progress) => progress.completed).length;
  return Math.round((completedLessons / lessonProgress.length) * 100);
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
}

export function generateCredentialId(courseId: string, userId: string) {
  return `${courseId.slice(0, 6)}-${userId.slice(0, 6)}-${Date.now().toString(36)}`;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
} 