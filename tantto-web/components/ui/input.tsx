import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  error?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onEndContentClick?: React.MouseEventHandler<HTMLSpanElement>;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      startContent,
      endContent,
      onEndContentClick,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center w-full">
          {startContent && (
            <span className="absolute left-3 flex items-center h-full text-xl text-foreground select-none pointer-events-none">
              {startContent}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            data-slot="input"
            aria-invalid={!!error}
            className={cn(
              "file:text-foreground placeholder:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 border-2 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "rounded-2xl",
              startContent ? "pl-10" : "",
              endContent ? "pr-10" : "",
              className,
            )}
            {...props}
          />
          {endContent && (
            <span
              className="absolute right-3 flex items-center h-full text-xl text-foreground cursor-pointer"
              onClick={onEndContentClick}
              tabIndex={0}
              role={onEndContentClick ? "button" : undefined}
              aria-label={onEndContentClick ? "Ícone de ação" : undefined}
            >
              {endContent}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 mb-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
