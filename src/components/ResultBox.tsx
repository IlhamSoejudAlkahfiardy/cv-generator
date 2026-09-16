import React from 'react';
import { GenerationResult } from '../types/cv';

interface ResultBoxProps {
  result: GenerationResult;
  onDownload: (base64Data: string, filename: string) => void;
}

export const ResultBox: React.FC<ResultBoxProps> = ({ result, onDownload }) => {
  const handleDownloadClick = () => {
    if (!result.pdfBase64) {
      alert('File PDF belum tersedia. Pastikan Gotenberg sudah berjalan di VPS.');
      return;
    }
    onDownload(result.pdfBase64, result.pdfFilename);
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center text-center">
      {/* Success Icon */}
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-3">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{result.roleTitle}</h3>
      <p className="text-xs text-slate-400 mb-5">CV A4 1 halaman siap digunakan untuk melamar pekerjaan.</p>

      <div className="w-full flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={!result.pdfBase64}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300 active:scale-[0.99] shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download PDF di Browser</span>
        </button>

        <div className="w-full flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs text-left leading-relaxed">
          <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
          </svg>
          {result.isNetworkTimeoutWarning ? (
            <div>
              <strong className="block font-semibold text-emerald-200">Dokumen PDF telah berhasil dikirim ke WhatsApp Anda!</strong>
              <span className="text-[11px] text-emerald-400/80 mt-0.5 block">
                (Browser mengalami timeout koneksi UDP/QUIC saat transmisi file besar, namun sistem n8n telah berhasil mengompilasi dan mengirimkan PDF ke WhatsApp Anda).
              </span>
            </div>
          ) : result.pdfBase64 ? (
            <span>Dokumen juga telah dikirimkan ke WhatsApp Anda!</span>
          ) : (
            <span>⚠️ Dokumen terkirim ke WhatsApp, namun pratinjau browser tidak tersedia.</span>
          )}
        </div>
      </div>
    </div>
  );
};
