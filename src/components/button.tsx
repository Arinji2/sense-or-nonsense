"use client";

import * as React from "react";

import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isFullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isFullWidth = false, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-fit w-fit scale-100 flex-col items-center justify-center rounded-md border border-black px-6 py-2 shadow-md shadow-black transition-all duration-200 ease-out will-change-transform enabled:hover:scale-95 enabled:hover:shadow-sm disabled:bg-gray-500 xl:py-3",
        className,
        { "w-full": isFullWidth },
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
