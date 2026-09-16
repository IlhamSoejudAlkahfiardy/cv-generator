import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 px-6 sm:px-10 py-4 flex justify-between items-center border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">ATS CV Studio</h1>
          <p className="text-xs text-slate-400">AI-Powered Automated Resume Builder</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden sm:inline">n8n Engine Connected</span>
          <span className="sm:hidden">Online</span>
        </div>
      </div>
    </header>
  );
};
