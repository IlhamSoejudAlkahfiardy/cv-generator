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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed -top-40 left-[15%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 right-[15%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <Header />

      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7">
            <JobForm onSubmit={generateCv} isLoading={isLoading} />
          </div>

          {/* Right Column: Status & Delivery */}
          <div className="lg:col-span-5">
            <section className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-indigo-950/20 hover:border-white/15 transition-all">
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white mb-6">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
