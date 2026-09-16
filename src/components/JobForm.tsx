import React, { useState, useRef } from 'react';
import { GenerateCvPayload } from '../types/cv';
import defaultMasterResume from '../assets/files/Master Resume.md?raw';

interface JobFormProps {
  onSubmit: (webhookUrl: string, payload: GenerateCvPayload) => void;
  isLoading: boolean;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit, isLoading }) => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [targetPhone, setTargetPhone] = useState<string>('628983474756');
  const [usePhoto, setUsePhoto] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    'https://n8n.alkahfiardy.com/webhook/generate-cv'
  );

  // Master Resume State
  const [resumeMode, setResumeMode] = useState<'default' | 'custom'>('default');
  const [customResumeText, setCustomResumeText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteJob = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch {
      alert('Izin clipboard tidak diaktifkan. Silakan tempel (Ctrl+V) langsung di textarea.');
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    const isMarkdownOrText =
      file.name.endsWith('.md') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.markdown') ||
      file.type.includes('text');

    if (!isMarkdownOrText) {
      alert('Format file tidak didukung. Mohon unggah file berekstensi .md atau .txt.');
      return;
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text || !text.trim()) {
        alert('File yang diunggah kosong.');
        return;
      }
      setCustomResumeText(text);
      setUploadedFileName(file.name);
      setUploadedFileSize(sizeFormatted);
      setResumeMode('custom');
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleResetToDefault = () => {
    setResumeMode('default');
    setCustomResumeText('');
    setUploadedFileName('');
    setUploadedFileSize('');
    setIsPreviewOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedJob = jobDescription.trim();
    if (!trimmedJob) {
      alert('Mohon masukkan teks Job Description.');
      return;
    }

    let finalMasterResume = defaultMasterResume;
    if (resumeMode === 'custom') {
      const trimmedCustom = customResumeText.trim();
      if (!trimmedCustom) {
        alert('Master Resume Kustom belum diunggah atau kosong. Silakan unggah file .md / .txt terlebih dahulu.');
        return;
      }
      finalMasterResume = trimmedCustom;
    }

    onSubmit(webhookUrl.trim(), {
      job_description: trimmedJob,
      use_photo: usePhoto,
      custom_role: customRole.trim() || undefined,
      target_phone: targetPhone.trim() || '628983474756',
      master_resume: finalMasterResume,
    });
  };

  const activeResumeContent = resumeMode === 'custom' ? customResumeText : defaultMasterResume;

  return (
    <section className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-indigo-950/20 hover:border-white/15 transition-all">
      <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white mb-6">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span>Input Data & Konfigurasi CV</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. Master Resume Section */}
        <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 sm:p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">Sumber Master Resume</label>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {resumeMode === 'custom' ? '✨ Custom Resume Aktif' : 'Default (Ilham Soejud)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                resumeMode === 'default'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-slate-800 hover:text-slate-200 hover:border-white/15'
              }`}
              onClick={handleResetToDefault}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Gunakan Resume Bawaan</span>
            </button>

            <button
              type="button"
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                resumeMode === 'custom'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-slate-800 hover:text-slate-200 hover:border-white/15'
              }`}
              onClick={() => {
                setResumeMode('custom');
                if (!uploadedFileName && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span>Unggah Master Resume (.md / .txt)</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".md,.txt,.markdown,text/plain,text/markdown"
            className="hidden"
          />

          {resumeMode === 'custom' && (
            <div
              className={`mt-2.5 mb-3 p-4 sm:p-5 rounded-xl text-center cursor-pointer transition-all duration-200 border-2 ${
                uploadedFileName
                  ? 'border-solid border-emerald-500/40 bg-emerald-500/5'
                  : isDragging
                  ? 'border-dashed border-indigo-400 bg-indigo-500/15 scale-[1.01]'
                  : 'border-dashed border-indigo-500/30 bg-slate-900/40 hover:border-indigo-400 hover:bg-indigo-500/10 hover:scale-[1.005]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedFileName ? (
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-slate-200 truncate">{uploadedFileName}</span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      {uploadedFileSize} • {customResumeText.length} karakter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 text-slate-200 hover:bg-white/20 transition-all cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      title="Ganti file"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-all cursor-pointer"
                      onClick={handleResetToDefault}
                      title="Hapus dan kembali ke default"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <svg className="w-8 h-8 text-indigo-400/80 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-xs text-slate-300">
                    Tarik & lepaskan file <strong className="text-indigo-300">.md</strong> atau <strong className="text-indigo-300">.txt</strong> di sini
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">atau klik untuk memilih file dari komputer</p>
                </div>
              )}
            </div>
          )}

          {/* Collapsible Resume Preview */}
          <div className="mt-2 pt-2 border-t border-white/5">
            <button
              type="button"
              className="w-full flex justify-between items-center text-xs font-medium text-slate-400 hover:text-slate-200 py-1.5 px-1 rounded transition-colors cursor-pointer"
              onClick={() => setIsPreviewOpen((prev) => !prev)}
            >
              <span className="flex items-center gap-1.5">
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isPreviewOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span>
                  {isPreviewOpen ? 'Sembunyikan Isi Master Resume' : 'Lihat / Sunting Isi Master Resume'}
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {activeResumeContent.length} karakter
              </span>
            </button>

            {isPreviewOpen && (
              <div className="mt-2">
                <textarea
                  className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-3 text-slate-300 font-mono text-xs leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y transition-colors"
                  value={activeResumeContent}
                  onChange={(e) => {
                    setCustomResumeText(e.target.value);
                    if (resumeMode === 'default') {
                      setResumeMode('custom');
                      setUploadedFileName('Custom_Edited_Resume.md');
                      setUploadedFileSize('Edited');
                    }
                  }}
                  rows={8}
                  placeholder="Isi teks Master Resume..."
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. Job Description Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="jobDescription" className="text-xs sm:text-sm font-semibold text-slate-200">
              Teks Job Description & Requirements *
            </label>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              onClick={handlePasteJob}
              title="Paste clipboard text"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Paste dari Clipboard</span>
            </button>
          </div>
          <textarea
            id="jobDescription"
            placeholder="Tempelkan seluruh kriteria, tanggung jawab, dan kualifikasi lowongan pekerjaan di sini..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={5}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 text-sm leading-relaxed outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
          />
          <div className="text-right text-[11px] text-slate-500 mt-1 font-mono">
            {jobDescription.length} karakter
          </div>
        </div>

        {/* 3. Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="customRole" className="text-xs font-semibold text-slate-300">
              Role / Jabatan Target (Opsional)
            </label>
            <input
              type="text"
              id="customRole"
              placeholder="Otomatis dideteksi AI (atau ketik manual)"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="targetPhone" className="text-xs font-semibold text-slate-300">
              Nomor WhatsApp Pengiriman (WAHA)
            </label>
            <input
              type="text"
              id="targetPhone"
              placeholder="Format: 628xxxxxxxx"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* 4. Photo Toggle Card */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Format Visual & Foto Formal
          </label>
          <div
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:border-white/20 transition-all"
            onClick={() => setUsePhoto((prev) => !prev)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src="/photos_assets.jpg"
                alt="Foto Formal"
                className={`w-10 h-12 rounded-lg object-cover border-2 transition-all duration-300 shrink-0 ${
                  usePhoto
                    ? 'border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'border-slate-700 grayscale opacity-40'
                }`}
              />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white">Gunakan Foto Formal Jas</h4>
                <p
                  className={`text-xs mt-0.5 transition-colors ${
                    usePhoto ? 'text-emerald-400 font-medium' : 'text-slate-400'
                  }`}
                >
                  {usePhoto
                    ? 'Aktif — Menggunakan Foto Formal (Jas & Background Merah)'
                    : 'Nonaktif — Standar ATS Modern (Tanpa Foto)'}
                </p>
              </div>
            </div>

            {/* Custom Tailwind Switch */}
            <div
              className={`w-11 h-6 flex items-center rounded-full p-0.5 shrink-0 transition-colors duration-200 ease-in-out ${
                usePhoto ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  usePhoto ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 5. Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-base text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 active:scale-[0.99] shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="3"
                  strokeDasharray="32"
                  strokeLinecap="round"
                />
              </svg>
              <span>Sedang Memproses CV...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Generate CV ATS Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* 6. Webhook Setting Collapsible */}
      <details className="mt-6 pt-4 border-t border-white/10 group">
        <summary className="text-xs text-slate-500 hover:text-slate-300 font-mono cursor-pointer select-none flex items-center gap-1.5 transition-colors">
          ⚙️ Pengaturan Webhook Endpoint n8n
        </summary>
        <div className="mt-3">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </details>
    </section>
  );
};

