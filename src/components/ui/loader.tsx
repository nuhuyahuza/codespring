export function Loader({ className = "w-6 h-6" }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary ${className}`} />
  );
} 