function DownloadCard({ file }) {
  return (
    <a
      href={file.url}
      // target="_blank" opens in new tab if download is blocked by browser settings
      target="_blank" 
      // rel is for security when using target="_blank"
      rel="noopener noreferrer"
      // download suggests the filename to the browser
      download={file.fileName}
      className="
        block
        bg-green-600
        text-white
        text-center
        py-4
        rounded-xl
        font-medium
        hover:bg-green-700
        transition-all
        shadow-sm
        hover:shadow-md
      "
    >
      Download {file.fileName}
    </a>
  );
}

export default DownloadCard;