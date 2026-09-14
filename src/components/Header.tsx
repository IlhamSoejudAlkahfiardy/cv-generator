import React from 'react';

export const Header: React.FC = () => {
  return (
    <header>
      <div className="brand">
        <div className="brand-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="brand-text">
          <h1>ATS CV Studio</h1>
          <p>AI-Powered Automated Resume Builder</p>
        </div>
      </div>
      <div className="header-actions">
        <div className="badge-status">
          <span className="dot"></span>
          <span>n8n Engine Connected</span>
        </div>
      </div>
    </header>
  );
};
