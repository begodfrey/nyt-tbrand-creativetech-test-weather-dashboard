import React from 'react';
import type { AppError } from '../types/weather';

interface ErrorBannerProps {
  error: AppError | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="mb-3 rounded-lg border border-red-500/60 bg-red-100 px-3 py-2 text-sm text-red-900 shadow-sm transition-all animate-fadeInUp"
      role="alert"
      aria-live="polite"
    >
      <p className="font-medium">{error.message}</p>
      {error.detail ? <p className="mt-1 text-xs text-red-800">{error.detail}</p> : null}
    </div>
  );
};

