import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-[#242428] bg-[#0C0C0F] px-4 py-3 text-sm text-[#EEEEF0] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#7A7A85] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-mint disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
