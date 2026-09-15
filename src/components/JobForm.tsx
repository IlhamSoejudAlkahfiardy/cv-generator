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
    <section className="card">
      <div className="card-title">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="form-group master-resume-section">
          <div className="label-row">
            <label>Sumber Master Resume</label>
            <span className="badge-pill">
              {resumeMode === 'custom' ? '✨ Custom Resume Aktif' : 'Default (Ilham Soejud)'}
            </span>
          </div>

          <div className="resume-mode-selector">
            <button
              type="button"
              className={`mode-btn ${resumeMode === 'default' ? 'active' : ''}`}
              onClick={handleResetToDefault}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`mode-btn ${resumeMode === 'custom' ? 'active' : ''}`}
              onClick={() => {
                setResumeMode('custom');
                if (!uploadedFileName && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            style={{ display: 'none' }}
          />

          {resumeMode === 'custom' && (
            <div
              className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${
                uploadedFileName ? 'has-file' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedFileName ? (
                <div className="file-info-bar">
                  <div className="file-icon">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="file-details">
                    <span className="file-name">{uploadedFileName}</span>
                    <span className="file-meta">
                      {uploadedFileSize} • {customResumeText.length} karakter
                    </span>
                  </div>
                  <div className="file-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-text-action"
                      onClick={() => fileInputRef.current?.click()}
                      title="Ganti file"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      className="btn-text-action danger"
                      onClick={handleResetToDefault}
                      title="Hapus dan kembali ke default"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="dropzone-title">
                    Tarik & lepaskan file <strong>.md</strong> atau <strong>.txt</strong> di sini
                  </p>
                  <p className="dropzone-sub">atau klik untuk memilih file dari komputer</p>
                </div>
              )}
            </div>
          )}

          {/* Collapsible Resume Preview */}
          <div className="resume-preview-wrapper">
            <button
              type="button"
              className="preview-toggle-btn"
              onClick={() => setIsPreviewOpen((prev) => !prev)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    transform: isPreviewOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span>
                  {isPreviewOpen ? 'Sembunyikan Isi Master Resume' : 'Lihat / Sunting Isi Master Resume'}
                </span>
              </span>
              <span className="preview-meta-info">
                {activeResumeContent.length} karakter
              </span>
            </button>

            {isPreviewOpen && (
              <div className="preview-content-box">
                <textarea
                  className="resume-textarea"
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
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="jobDescription">Teks Job Description & Requirements *</label>
            <button
              type="button"
              className="quick-btn"
              onClick={handlePasteJob}
              title="Paste clipboard text"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          />
          <div className="char-count">{jobDescription.length} karakter</div>
        </div>

        {/* 3. Options Grid */}
        <div className="options-grid">
          <div className="form-group">
            <label htmlFor="customRole">Role / Jabatan Target (Opsional)</label>
            <input
              type="text"
              id="customRole"
              placeholder="Otomatis dideteksi AI (atau ketik manual)"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetPhone">Nomor WhatsApp Pengiriman (WAHA)</label>
            <input
              type="text"
              id="targetPhone"
              placeholder="Format: 628xxxxxxxx"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
            />
          </div>
        </div>

        {/* 4. Photo Toggle Card */}
        <div className="form-group">
          <label style={{ marginBottom: '8px', display: 'block' }}>Format Visual & Foto Formal</label>
          <div
            className="toggle-card"
            onClick={() => setUsePhoto((prev) => !prev)}
            role="button"
            tabIndex={0}
          >
            <div className="toggle-info">
              <img
                src="/photos_assets.jpg"
                alt="Foto Formal"
                className={`toggle-photo-thumb ${!usePhoto ? 'disabled' : ''}`}
              />
              <div className="toggle-text">
                <h4>Gunakan Foto Formal Jas</h4>
                <p style={{ color: usePhoto ? '#34d399' : 'var(--text-muted)' }}>
                  {usePhoto
                    ? 'Aktif — Menggunakan Foto Formal (Jas & Background Merah)'
                    : 'Nonaktif — Standar ATS Modern (Tanpa Foto)'}
                </p>
              </div>
            </div>
            <label className="switch" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={usePhoto}
                onChange={(e) => setUsePhoto(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* 5. Submit Button */}
        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="spin-icon"
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
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <details className="webhook-setting">
        <summary>⚙️ Pengaturan Webhook Endpoint n8n</summary>
        <div className="webhook-config-body">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}
          />
        </div>
      </details>
    </section>
  );
};
