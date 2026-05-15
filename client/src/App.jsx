import { useState } from "react";
import FileCard from "./components/FileCard";
import DownloadCard from "./components/DownloadCard";
import Loader from "./components/Loader";

function App() {
  const [files, setFiles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newSelections = Array.from(e.target.files);
      
      // Keep old files + add new ones
      setFiles((prev) => [...prev, ...newSelections]);
      
      setDownloadLinks([]); 
      
      // Reset input so the same file can be picked again if deleted
      e.target.value = null; 
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select files first");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    try {
      const response = await fetch("https://word-to-pdf-njda.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setDownloadLinks(data.files);
      } else {
        alert("Conversion failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8">Word to PDF</h1>

        <div className="mb-6">
          <label className="flex flex-col items-center w-full p-10 border-2 border-dashed border-blue-200 rounded-3xl cursor-pointer hover:bg-blue-50 transition-all group">
            <input
              type="file"
              accept=".doc,.docx"
              multiple // Allows picking multiple in one go
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4 group-hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-gray-600 font-semibold">Click to add more files</span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-200 transition-all"
        >
          {loading ? "Converting..." : `Convert ${files.length} Files`}
        </button>

        {loading && <Loader />}

        {!loading && files.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Files to Convert</h2>
            <div className="space-y-3">
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

        {downloadLinks.length > 0 && (
          <div className="mt-10 p-6 bg-green-50 rounded-3xl border border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-4">Download Results</h2>
            <div className="space-y-3">
              {downloadLinks.map((file, index) => (
                <DownloadCard key={index} file={file} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;