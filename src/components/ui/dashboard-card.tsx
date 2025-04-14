
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  isHoverable?: boolean;
}

export function DashboardCard({
  title,
  description,
  icon,
  footer,
  children,
  className,
  contentClassName,
  isHoverable = true,
}: DashboardCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border", 
      isHoverable && "card-hover",
      className
    )}>
      {(title || description || icon) && (
        <CardHeader className={cn("flex flex-row items-center gap-2 animate-fade-in")}>
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex-1">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn("animate-slide-in", contentClassName)}>
        {children}
      </CardContent>
      {footer && <CardFooter className="border-t animate-fade-in">{footer}</CardFooter>}
    </Card>
  );
}
