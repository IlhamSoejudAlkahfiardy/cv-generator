import React, { useState } from 'react';
import { GenerateCvPayload } from '../types/cv';

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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch {
      alert('Izin clipboard tidak diaktifkan. Silakan tempel (Ctrl+V) langsung di textarea.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedJob = jobDescription.trim();
    if (!trimmedJob) {
      alert('Mohon masukkan teks Job Description.');
      return;
    }

    onSubmit(webhookUrl.trim(), {
      job_description: trimmedJob,
      use_photo: usePhoto,
      custom_role: customRole.trim() || undefined,
      target_phone: targetPhone.trim() || '628983474756',
    });
  };

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
        <span>Input Lowongan Pekerjaan (Job Description)</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="jobDescription">Teks Job Description & Requirements *</label>
            <button
              type="button"
              className="quick-btn"
              onClick={handlePaste}
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
          />
          <div className="char-count">{jobDescription.length} karakter</div>
        </div>

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

        {/* Photo Toggle Card */}
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
