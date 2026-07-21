"use client"

import React from "react";

const PerformanceChart: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <svg
        className="w-12 h-12 animate-pulse"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

export default PerformanceChart;
