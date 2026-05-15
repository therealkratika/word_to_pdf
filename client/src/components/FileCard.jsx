import React from 'react';
function FileCard({ file, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 group">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </div>
        <div className="truncate">
          <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent any accidental parent clicks
          onRemove();
        }}
        className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default FileCard;