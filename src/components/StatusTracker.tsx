import React from 'react';
import { TrackerStep } from '../types/cv';

interface StatusTrackerProps {
  steps: TrackerStep[];
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ steps }) => {
  return (
    <div className="relative flex flex-col gap-6 py-2">
      {/* Connecting line */}
      <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-slate-800 pointer-events-none" />

      {steps.map((step) => {
        const isDone = step.state === 'done';
        const isActive = step.state === 'active';

        return (
          <div key={step.id} className="relative flex items-start gap-4 z-10 group">
            {/* Step Icon */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-400 shadow-md shadow-emerald-500/30'
                  : isActive
                  ? 'bg-indigo-600/30 text-indigo-300 border-2 border-indigo-500 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/30 animate-pulse'
                  : 'bg-slate-900/90 text-slate-500 border border-slate-700/60'
              }`}
            >
              {isDone ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>

            {/* Step Text */}
            <div className="pt-0.5">
              <h5
                className={`text-sm font-semibold transition-colors ${
                  isDone ? 'text-slate-200' : isActive ? 'text-indigo-300' : 'text-slate-500'
                }`}
              >
                {step.title}
              </h5>
              <p
                className={`text-xs mt-0.5 transition-colors ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
