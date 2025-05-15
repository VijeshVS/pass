import React from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "block w-10 h-6 bg-gray-300 rounded-full",
            props.checked ? "bg-purple-600" : "bg-gray-300",
            className
          )}></div>
          <div className={cn(
            "dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out",
            props.checked ? "transform translate-x-4" : ""
          )}></div>
        </div>
        {label && <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };