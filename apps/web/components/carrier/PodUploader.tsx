"use client";

import { useState } from "react";
import { podApi, ApiClientError } from "../../lib/apiClient";
import { Spinner } from "../ui/Spinner";

interface PodUploaderProps {
  loadId: string;
  onUploaded: () => void;
}

export function PodUploader({ loadId, onUploaded }: PodUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (f.size > 20 * 1024 * 1024) {
      setError("File must be under 20 MB");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      await podApi.upload(loadId, file);
      setSuccess(true);
      onUploaded();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-5 text-sm animate-fade-in">
        <p className="font-semibold text-emerald-800">✓ Proof of Delivery Uploaded</p>
        <p className="mt-1 text-emerald-700">
          Your POD has been received. Load status will update shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-4" aria-label="Upload proof of delivery">
      <h3 className="font-semibold text-content-primary">Upload Proof of Delivery</h3>
      <p className="text-sm text-content-secondary">
        Upload a signed Bill of Lading or delivery receipt (PDF, JPG, PNG, max 20 MB).
      </p>

      {/* Drop zone */}
      <label
        htmlFor="pod-file-input"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        className={[
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragOver
            ? "border-action bg-action-light"
            : "border-surface-border hover:border-action/50 hover:bg-surface-muted",
        ].join(" ")}
      >
        <svg className="mb-2 h-8 w-8 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {file ? (
          <p className="text-sm font-medium text-content-primary">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-content-secondary">
              Drag &amp; drop or <span className="text-action">browse</span>
            </p>
            <p className="mt-1 text-xs text-content-muted">PDF, JPG, PNG up to 20 MB</p>
          </>
        )}
        <input
          id="pod-file-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </label>

      {error && <p className="text-sm text-compliance-inactive">{error}</p>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
        className="btn-primary w-full"
        id="upload-pod-btn"
      >
        {uploading ? <Spinner size="sm" className="text-white" /> : "Upload POD"}
      </button>
    </div>
  );
}
