import { useState, useRef, useEffect, useCallback } from 'react';
import { GenerateCvPayload, GenerateCvResponse, GenerationResult, TrackerStep } from '../types/cv';

const INITIAL_STEPS: TrackerStep[] = [
  {
    id: 1,
    title: 'Menerima Job Description',
    description: 'Ekstraksi kata kunci penting & verifikasi parameter',
    state: 'idle',
  },
  {
    id: 2,
    title: 'Gemini AI Tailoring',
    description: 'Mencocokkan Master Resume dengan kriteria lowongan',
    state: 'idle',
  },
  {
    id: 3,
    title: 'Kompilasi PDF Gotenberg',
    description: 'Render layout 1 Halaman A4 ATS-friendly (1:1 Figma)',
    state: 'idle',
  },
  {
    id: 4,
    title: 'Kirim File via WAHA',
    description: 'Pengiriman dokumen PDF otomatis ke WhatsApp Anda',
    state: 'idle',
  },
];

export function useCvGenerator() {
  const [steps, setSteps] = useState<TrackerStep[]>(INITIAL_STEPS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const generateCv = async (webhookUrl: string, payload: GenerateCvPayload) => {
    clearAllTimers();
    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);

    // Set step 1 active, others idle
    setSteps([
      { ...INITIAL_STEPS[0], state: 'active' },
      { ...INITIAL_STEPS[1], state: 'idle' },
      { ...INITIAL_STEPS[2], state: 'idle' },
      { ...INITIAL_STEPS[3], state: 'idle' },
    ]);

    // Timers for realistic progress
    const t1 = setTimeout(() => {
      setSteps((prev) => [
        { ...prev[0], state: 'done' },
        { ...prev[1], state: 'active' },
        prev[2],
        prev[3],
      ]);
    }, 700);

    const t2 = setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        { ...prev[1], state: 'done' },
        { ...prev[2], state: 'active' },
        prev[3],
      ]);
    }, 9000);

    const t3 = setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], state: 'done' },
        { ...prev[3], state: 'active' },
      ]);
    }, 12500);

    timersRef.current = [t1, t2, t3];

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      clearAllTimers();

      // All steps done
      setSteps((prev) => prev.map((s) => ({ ...s, state: 'done' })));

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
      }

      const data: GenerateCvResponse = await response.json();

      const roleTitle = data.role_title || 'Resume';
      const cleanRole = roleTitle.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanName = (data.candidate_name || 'Ilham_Soejud').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = data.pdf_filename || `CV_${cleanName}_${cleanRole}.pdf`;
      const pdfBase64 = data.pdf_base64 && data.pdf_base64.length > 50 ? data.pdf_base64 : null;

      setResult({
        roleTitle: data.role_title ? `CV ${data.role_title} Berhasil Dibuat!` : 'CV Berhasil Dibuat!',
        pdfBase64,
        pdfFilename: filename,
        isNetworkTimeoutWarning: false,
      });
    } catch (err: unknown) {
      clearAllTimers();

      const errString = err instanceof Error ? err.message : String(err);
      const isNetworkTimeout =
        errString.toLowerCase().includes('fetch') ||
        errString.toLowerCase().includes('network') ||
        errString.toLowerCase().includes('quic');

      if (isNetworkTimeout) {
        // WhatsApp notification fallback for QUIC idle / UDP timeout
        setSteps((prev) => prev.map((s) => ({ ...s, state: 'done' })));
        setResult({
          roleTitle: 'CV ATS Selesai Diproses!',
          pdfBase64: null,
          pdfFilename: 'CV_Ilham_Soejud.pdf',
          isNetworkTimeoutWarning: true,
        });
      } else {
        setErrorMessage(`Gagal memproses CV: ${errString}\n\nPastikan workflow di n8n sudah diaktifkan.`);
        setSteps((prev) => prev.map((s) => ({ ...s, state: 'idle' })));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdf = (base64Data: string, filename: string) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal mendownload PDF: ${msg}`);
    }
  };

  return {
    steps,
    isLoading,
    result,
    errorMessage,
    generateCv,
    downloadPdf,
  };
}
