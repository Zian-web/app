import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-slate-800 text-white hover:bg-slate-900 active:bg-slate-900 shadow-sm",
        destructive:
          "bg-destructive-500 text-white hover:bg-destructive-600 active:bg-destructive-600 shadow-sm",
        outline:
          "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 shadow-sm",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-200",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-100",
        link: "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600",
        success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-600 shadow-sm",
        warning: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-600 shadow-sm",
        info: "bg-info-500 text-white hover:bg-info-600 active:bg-info-600 shadow-sm",
        "dark-blue": "bg-slate-800 text-white hover:bg-slate-900 active:bg-slate-900 shadow-sm",
        "navy": "bg-blue-800 text-white hover:bg-blue-900 active:bg-blue-900 shadow-sm",
        "deep-blue": "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-800 shadow-sm",
        "light-blue": "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
