require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin:
      "https://word-to-pdf-mauve.vercel.app/",
  })
);
app.use(express.json());

const tempDir = path.resolve(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const upload = multer({ dest: "temp/" });

app.post("/convert", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const convertedFiles = [];
const libreOfficePath = process.env.LIBREOFFICE_PATH || (process.platform === "win32"
  ? `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`
  : "libreoffice");

    for (const file of req.files) {
      try {
        const originalNameOnly = path.parse(file.originalname).name;
        const uniqueId = file.filename; // Multer's random string
        const inputPath = path.resolve(file.path);
        const outputDir = path.resolve(__dirname, "temp");
        const pdfPath = path.join(outputDir, `${uniqueId}.pdf`);

        // 2. Conversion Command
        const command = `${libreOfficePath} --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

        await new Promise((resolve, reject) => {
          exec(command, (error) => (error ? reject(error) : resolve()));
        });

        // 3. Verification Polling
        let attempts = 0;
        while (!fs.existsSync(pdfPath) && attempts < 15) {
          await new Promise((r) => setTimeout(r, 500));
          attempts++;
        }

        if (fs.existsSync(pdfPath)) {
          // 4. Upload to Cloudinary
          const fileBase64 = fs.readFileSync(pdfPath, { encoding: "base64" });
          
          const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${fileBase64}`, {
            folder: "word-to-pdf",
            resource_type: "raw",
            // Include timestamp to avoid browser caching old files
            public_id: `${originalNameOnly.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
          });

          convertedFiles.push({
            fileName: originalNameOnly + ".pdf",
            url: uploadResult.secure_url,
          });

          // 5. Cleanup
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        }
      } catch (fileError) {
        console.error(`Error with file ${file.originalname}:`, fileError);
        // Continue to next file even if one fails
      }
    }

    res.json({
      success: true,
      total: convertedFiles.length,
      files: convertedFiles,
    });

  } catch (error) {
    console.error("General Error:", error);
    res.status(500).json({ success: false, message: "Conversion process failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));