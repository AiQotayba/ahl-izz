'use client'

import * as React from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

export interface PhoneInputProps {
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  dir?: 'ltr' | 'rtl'
}

const PhoneInputField = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({
        value,
        onChange,
        placeholder = "رقم الهاتف",
        className,
        disabled = false,
        required = false,
        error,
        label,
        dir = 'rtl',
        ...props
    }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-[#1E7B6B] font-semibold text-base block">
                        {label}
                        {required && <span className="text-red-500 mr-1">*</span>}
                    </label>
                )}
                <div className="relative">
          <PhoneInput
            value={value}
            onChange={(value) => onChange?.(value || undefined)}
            placeholder={placeholder}
            disabled={disabled}
            defaultCountry="SY"
            international
            countryCallingCodeEditable={false}
            className={cn(
              "flex h-12 w-full rounded-md border border-[#1E7B6B]/40 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7B6B]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-[#1E7B6B]/60",
              error && "border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            style={{
              direction: dir,
            }}
            {...props}
          />
                    {error && (
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
PhoneInputField.displayName = "PhoneInputField"

export { PhoneInputField }
