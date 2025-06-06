'use client'

import * as React from 'react'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className || ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          ref={ref}
          className="sr-only"
          {...props}
        />
        <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 dark:bg-gray-700 peer-checked:bg-indigo-600 transition-colors"></span>
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></span>
      </label>
    )
  }
)
Switch.displayName = 'Switch'
