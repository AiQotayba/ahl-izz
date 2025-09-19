import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  required?: boolean
  optional?: boolean
  icon?: React.ReactNode
  showPasswordToggle?: boolean
  dir?: 'ltr' | 'rtl'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error,
    label,
    required = false,
    optional = false,
    icon,
    showPasswordToggle = false,
    dir = 'rtl',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type

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
          {icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              "flex h-12 w-full rounded-md border border-[#1E7B6B]/40 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7B6B]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-[#1E7B6B]/60",
              error && "border-red-500 focus-visible:ring-red-500/20",
              icon && "pr-10",
              showPasswordToggle && "pr-10",
              className
            )}
            style={{ direction: dir }}
            ref={ref}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {error && !showPasswordToggle && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
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
Input.displayName = "Input"

export { Input }

