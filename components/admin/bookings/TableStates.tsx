"use client";

import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading bookings..." 
}) => (
  <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
    {message}
  </div>
);

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No bookings found." 
}) => (
  <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
    {message}
  </div>
);