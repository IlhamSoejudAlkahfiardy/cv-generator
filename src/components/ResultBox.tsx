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
    <div className="result-box">
      <div className="result-success-icon">
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3>{result.roleTitle}</h3>
      <p>CV A4 1 halaman siap digunakan untuk melamar pekerjaan.</p>

      <div className="result-actions">
        <button
          type="button"
          className="btn-download"
          onClick={handleDownloadClick}
          disabled={!result.pdfBase64}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download PDF di Browser</span>
        </button>

        <div className="wa-delivery-notice">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
          </svg>
          {result.isNetworkTimeoutWarning ? (
            <span>
              <strong>Dokumen PDF telah berhasil dikirim ke WhatsApp Anda!</strong>
              <br />
              <small style={{ opacity: 0.85 }}>
                (Browser mengalami timeout koneksi UDP/QUIC saat transmisi file besar, namun sistem n8n telah berhasil mengompilasi dan mengirimkan PDF ke WhatsApp Anda).
              </small>
            </span>
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
