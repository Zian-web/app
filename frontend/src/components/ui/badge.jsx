import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-primary-600 border border-primary-200",
        secondary:
          "bg-gray-100 text-gray-700 border border-gray-200",
        destructive:
          "bg-destructive-100 text-destructive-600 border border-destructive-200",
        success:
          "bg-success-100 text-success-600 border border-success-200",
        warning:
          "bg-warning-100 text-warning-600 border border-warning-200",
        info:
          "bg-info-100 text-info-600 border border-info-200",
        outline: 
          "text-gray-700 border border-gray-200 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
