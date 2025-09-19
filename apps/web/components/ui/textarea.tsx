import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  required?: boolean
  optional?: boolean
  dir?: 'ltr' | 'rtl'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error,
    label,
    required = false,
    optional = false,
    dir = 'rtl',
    ...props 
  }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-[#1E7B6B] font-semibold text-base block">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
            {optional && <span className="text-gray-500 mr-1">(اختياري)</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[100px] w-full rounded-md border border-[#1E7B6B]/40 bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7B6B]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-[#1E7B6B]/60 resize-none",
              error && "border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            style={{ direction: dir }}
            ref={ref}
            {...props}
          />
          {error && (
            <div className="absolute left-3 top-3">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded-md border border-red-200 flex items-center">
            <AlertCircle className="h-4 w-4 ml-2" />
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

