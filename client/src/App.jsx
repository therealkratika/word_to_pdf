import { useState } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Trash2, 
  ArrowRight,
  Info,
  Lock
} from "lucide-react";
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
        alert(`Limit exceeded: You can only convert up to ${MAX_FILES} files at once.`);
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
    files.forEach((file) => formData.append("files", file));

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
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 font-sans">
      
      {/* 1. HERO & CONVERTER SECTION */}
      <section className="pt-16 pb-24 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Word to <span className="text-blue-600">PDF</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Convert up to <span className="font-bold text-gray-900">{MAX_FILES} documents</span> at once with our high-precision engine.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <label className={`
                flex flex-col items-center w-full p-10 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer
                ${files.length >= MAX_FILES ? 'border-gray-200 bg-gray-50' : 'border-blue-200 hover:bg-blue-50/50 group'}
              `}>
                <input type="file" accept=".doc,.docx" multiple onChange={handleFileChange} className="hidden" disabled={files.length >= MAX_FILES} />
                <div className="bg-blue-600 text-white p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                  <Upload size={32} strokeWidth={2.5} />
                </div>
                <span className="text-gray-700 font-bold text-lg">
                  {files.length >= MAX_FILES ? "Limit Reached" : "Add Word Documents"}
                </span>
                <span className="text-gray-400 text-sm mt-1">{files.length} of {MAX_FILES} files used</span>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || files.length === 0}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:bg-gray-200 transition-all flex items-center justify-center gap-3"
            >
              {loading ? "Processing..." : (
                <>
                  <span>Convert Files</span>
                  <ArrowRight size={24} />
                </>
              )}
            </button>

            {loading && <div className="mt-8"><Loader /></div>}

            {!loading && files.length > 0 && (
              <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm uppercase tracking-widest font-bold text-gray-400">Queue</h2>
                    <button onClick={() => setFiles([])} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs font-bold">
                        <Trash2 size={14} /> Clear
                    </button>
                </div>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <FileCard key={index} file={file} onRemove={() => removeFile(index)} />
                  ))}
                </div>
              </div>
            )}

            {downloadLinks.length > 0 && (
              <div className="mt-10 p-6 bg-green-50 rounded-[2rem] border border-green-100">
                <div className="flex items-center gap-2 mb-4 text-green-800">
                    <CheckCircle size={20} />
                    <h2 className="text-lg font-bold">Ready for Download</h2>
                </div>
                <div className="space-y-3">
                  {downloadLinks.map((file, index) => (
                    <DownloadCard key={index} file={file} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 italic">How it works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <Step icon={<FileText className="text-blue-600" />} title="Upload" desc="Pick up to 10 .doc or .docx files." />
          <Step icon={<Zap className="text-blue-600" />} title="Convert" desc="Our cloud engine processes the formatting." />
          <Step icon={<CheckCircle className="text-blue-600" />} title="Download" desc="Get your PDF results instantly." />
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="py-24 bg-gray-900 text-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Professional Features</h2>
            <p className="text-gray-400">Zero cost, premium quality.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureBox icon={<FileText size={28} />} title="100% Accuracy" desc="Preserves every margin, font, and table." />
            <FeatureBox icon={<Zap size={28} />} title="Fast Batching" desc="Convert multiple files simultaneously." />
            <FeatureBox icon={<ShieldCheck size={28} />} title="Encrypted" desc="End-to-end security for every upload." />
            <FeatureBox icon={<Smartphone size={28} />} title="Mobile Ready" desc="Convert on the go from any device." />
          </div>
        </div>
      </section>

      {/* 4. FAQ & PRIVACY */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
            <div>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <Info className="text-blue-600" /> FAQ
                </h2>
                <div className="space-y-6">
                    <FAQItem q="Maximum file size?" a="We recommend keeping files under 20MB for the fastest performance." />
                    <FAQItem q="Is it really free?" a="Yes! No watermarks, no sign-ups, no hidden fees." />
                </div>
            </div>
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
                <Lock className="mb-4 opacity-80" size={32} />
                <h2 className="text-2xl font-bold mb-4">Privacy First</h2>
                <p className="text-blue-50 text-sm leading-relaxed">
                    Files are automatically deleted from our servers 60 minutes after conversion. We never share your data.
                </p>
            </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} WordToPDF Pro</p>
      </footer>
    </div>
  );
}

const Step = ({ icon, title, desc }) => (
    <div className="text-center group">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

const FeatureBox = ({ icon, title, desc }) => (
  <div className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const FAQItem = ({ q, a }) => (
  <div className="border-l-2 border-blue-100 pl-4">
    <h4 className="font-bold text-gray-900 mb-1 italic">{q}</h4>
    <p className="text-gray-500 text-sm">{a}</p>
  </div>
);

export default App;