import { useState } from "react";
import FileCard from "./components/FileCard";
import DownloadCard from "./components/DownloadCard";
import Loader from "./components/Loader";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]);

  const MAX_FILES = 10;

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newSelections = Array.from(e.target.files);
      
      if (files.length + newSelections.length > MAX_FILES) {
        alert(`You can only convert up to ${MAX_FILES} files at a time.`);
        e.target.value = null;
        return;
      }

      setFiles((prev) => [...prev, ...newSelections]);
      setDownloadLinks([]);
      e.target.value = null;
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    try {
      const response = await fetch("https://word-to-pdf-ueii.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setDownloadLinks(data.files);
      } else {
        alert("Conversion failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 md:p-10">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Word to PDF</h1>
          <p className="text-blue-100 opacity-90">Fast, secure, and professional document conversion</p>
        </div>

        <div className="p-8 md:p-12">
          {/* Upload Area */}
          <div className="mb-8">
            <label className={`
              flex flex-col items-center w-full p-8 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer
              ${files.length >= MAX_FILES 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 group'}
            `}>
              <input
                type="file"
                accept=".doc,.docx"
                multiple
                disabled={files.length >= MAX_FILES}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className={`p-4 rounded-2xl mb-4 transition-transform ${files.length >= MAX_FILES ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 group-hover:scale-110'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-gray-700">
                  {files.length >= MAX_FILES ? "Limit Reached" : "Drop files here or click to upload"}
                </p>
                <p className={`text-sm mt-1 ${files.length >= MAX_FILES ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                   {files.length} / {MAX_FILES} files selected (Max 10)
                </p>
              </div>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Convert ${files.length > 0 ? files.length : ''} ${files.length === 1 ? 'Document' : 'Documents'}`
            )}
          </button>

          {/* List of Files */}
          {!loading && files.length > 0 && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Queue</h2>
                <button 
                  onClick={() => setFiles([])} 
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="grid gap-3">
                {files.map((file, index) => (
                  <FileCard 
                    key={`${file.name}-${index}`} 
                    file={file} 
                    onRemove={() => removeFile(index)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Loader Overlay for active work */}
          {loading && (
            <div className="mt-10 flex flex-col items-center">
                <Loader />
                <p className="text-gray-500 mt-4 animate-pulse text-sm">Converting your documents, please wait...</p>
            </div>
          )}

          {/* Download Section */}
          {downloadLinks.length > 0 && (
            <div className="mt-10 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-500 p-1.5 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-lg font-bold text-emerald-900">Ready for Download</h2>
              </div>
              <div className="grid gap-3">
                {downloadLinks.map((file, index) => (
                  <DownloadCard key={index} file={file} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Microsoft Word (.doc, .docx) supported. Your privacy is protected.</p>
        </div>
      </div>
    </div>
  );
}

export default App;