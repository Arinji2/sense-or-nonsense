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
        "flex h-fit w-fit flex-col items-center justify-center rounded-md px-6 py-2 xl:py-3",
        className,
        { "w-full": isFullWidth },
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
