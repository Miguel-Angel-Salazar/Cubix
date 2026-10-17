import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({
  size = "md",
  className = "",
  label = "Cargando...",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      role="status"
      className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
