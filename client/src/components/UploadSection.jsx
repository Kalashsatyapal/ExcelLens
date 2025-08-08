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
      setMessage('Only Excel files (.xlsx, .xls) are supported.');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.xls,.xlsx' });

  return (
    <div className="max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-md p-12 text-center cursor-pointer
          ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-indigo-600 font-semibold">Uploading...</p>
        ) : (
          <>
            <p className="text-gray-500">Drag & drop an Excel file here, or click to select</p>
            <p className="mt-2 text-sm text-gray-400">Only .xlsx and .xls files are accepted</p>
          </>
        )}
      </div>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes('success') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
