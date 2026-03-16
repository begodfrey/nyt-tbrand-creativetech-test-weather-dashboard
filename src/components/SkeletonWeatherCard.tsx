import React from 'react';

export const SkeletonWeatherCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-700" />
      <div className="mb-6 h-10 w-24 animate-pulse rounded bg-slate-700" />
      <div className="space-y-2">
        <div className="h-3 w-40 animate-pulse rounded bg-slate-700" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-700" />
      </div>
    </div>
  );
};

