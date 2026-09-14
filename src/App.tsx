import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { JobForm } from './components/JobForm';
import { StatusTracker } from './components/StatusTracker';
import { ResultBox } from './components/ResultBox';
import { Footer } from './components/Footer';
import { useCvGenerator } from './hooks/useCvGenerator';

export const App: React.FC = () => {
  const { steps, isLoading, result, errorMessage, generateCv, downloadPdf } = useCvGenerator();

  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
    }
  }, [errorMessage]);

  return (
    <>
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <Header />

      <main>
        <div className="grid-layout">
          {/* Left Column: Input Form */}
          <JobForm onSubmit={generateCv} isLoading={isLoading} />

          {/* Right Column: Status & Delivery */}
          <section className="card">
            <div className="card-title">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span>Progress & Output</span>
            </div>

            <StatusTracker steps={steps} />

            {result && <ResultBox result={result} onDownload={downloadPdf} />}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default App;
