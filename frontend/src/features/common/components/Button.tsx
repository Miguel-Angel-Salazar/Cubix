import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2 shadow-sm",
    lg: "px-6 py-3 text-base font-semibold gap-2.5 shadow-md",
  };

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500 shadow-blue-500/20 active:scale-[0.98]",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 focus-visible:ring-slate-400 active:scale-[0.98]",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500 shadow-rose-500/20 active:scale-[0.98]",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400",
    ghost:
      "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
