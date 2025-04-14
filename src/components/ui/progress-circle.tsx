
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  animate?: boolean;
  color?: string;
}

export function ProgressCircle({
  value,
  size = 120,
  strokeWidth = 6,
  className,
  showValue = true,
  animate = true,
  color,
}: ProgressCircleProps) {
  const [progress, setProgress] = useState(animate ? 0 : value);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, animate]);

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      style={{ "--size": `${size}px`, "--progress-value": progress } as React.CSSProperties}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-none stroke-muted"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("fill-none transition-all duration-1000 ease-out", 
            color ? color : "stroke-primary"
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {showValue && (
        <div className="absolute flex items-center justify-center">
          <span className="text-xl font-semibold">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
