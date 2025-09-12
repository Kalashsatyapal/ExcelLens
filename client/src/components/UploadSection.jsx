import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import API from '../utils/api';

export default function UploadSection() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setMessage('');

    const file = acceptedFiles[0];

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setMessage('❌ Only Excel files (.xlsx, .xls) are supported.');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Upload failed'}`);
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xls,.xlsx',
  });

  return (
    <div className="max-w-xl mx-auto font-inter">
      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 backdrop-blur-md
          ${
            isDragActive
              ? 'border-cyan-500 bg-cyan-50 shadow-md'
              : 'border-slate-300 bg-white/60 hover:border-cyan-400 hover:bg-white/80'
          }
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-cyan-600 font-semibold text-lg animate-pulse">
            Uploading...
          </p>
        ) : (
          <>
            <p className="text-slate-700 text-lg font-medium">
              Drag & drop an Excel file here, or click to select
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Only <code>.xlsx</code> and <code>.xls</code> files are accepted
            </p>
          </>
        )}
      </div>

      {message && (
        <p
          className={`mt-6 text-center text-base font-medium transition ${
            message.includes('✅') ? 'text-cyan-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
