// components/GCPColoredSpinner.jsx
import React from "react";

const GCPColoredSpinner = ({ size = "medium", color = "blue" }) => {
  // Map size prop to Tailwind CSS width/height classes
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
    xl: "w-16 h-16",
  } as any;

  const colorClasses = {
    blue: "border-blue-600 border-t-blue-300",
    red: "border-red-600 border-t-red-300",
    yellow: "border-yellow-500 border-t-yellow-300",
    green: "border-green-600 border-t-green-300",
    indigo: "border-indigo-600 border-t-indigo-300",
    gray: "border-gray-500 border-t-gray-300",
  } as any;

  const spinnerClass = `
    inline-block 
    ${sizeClasses[size] || sizeClasses.medium} 
    rounded-full 
    border-4                 /* Fixed border thickness */
    animate-spin             /* Tailwind's built-in spin animation */
    ${
      colorClasses[color] || colorClasses.blue
    } /* Apply specific colors, default to blue */
  `;

  return (
    <div className={spinnerClass} role="status" aria-label="Loading...">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default GCPColoredSpinner;
