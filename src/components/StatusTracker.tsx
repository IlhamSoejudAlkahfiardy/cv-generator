import React from 'react';
import { TrackerStep } from '../types/cv';

interface StatusTrackerProps {
  steps: TrackerStep[];
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ steps }) => {
  return (
    <div className="status-tracker">
      {steps.map((step) => {
        let stepClass = 'step-item';
        if (step.state === 'active') stepClass += ' active';
        if (step.state === 'done') stepClass += ' done';

        return (
          <div key={step.id} className={stepClass}>
            <div className="step-icon">
              {step.state === 'done' ? (
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <div className="step-text">
              <h5>{step.title}</h5>
              <p>{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
