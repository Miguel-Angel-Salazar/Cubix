import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 
          bg-white dark:bg-slate-900 
          text-slate-900 dark:text-slate-100 
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:outline-none focus:ring-2 
          ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5">
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
