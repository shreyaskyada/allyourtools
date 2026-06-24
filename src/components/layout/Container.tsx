import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  fluid?: boolean;
}

export default function Container({
  children,
  className,
  as: Component = "div",
  fluid = false,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        fluid 
          ? "w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16" 
          : "container mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Component>
  );
}
