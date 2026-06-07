import { GoogleGenAI } from "@google/genai";
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

import os from "os";

const upload = multer({ dest: os.tmpdir() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini via @google/genai
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(express.json({ limit: "50mb" }));

  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    try {
      // Using Base64 as it's safe for smaller audio, but ai.files.upload is better
      // Let's use ai.files.upload since the file is already on disk.
      const uploadResult = await ai.files.upload({
        file: req.file.path,
        config: {
          mimeType: req.file.mimetype || "audio/mp3",
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          parts: [
            { fileData: { fileUri: uploadResult.uri, mimeType: uploadResult.mimeType } },
            { text: "Please transcribe this Khmer audio accurately. Transcribe word-for-word exactly as spoken, including filler words like 'អើ', stutters, etc." },
          ]
        },
      });

      // Cleanup
      await ai.files.delete({ name: uploadResult.name });
      fs.unlinkSync(req.file.path);

      res.json({ transcript: response.text });
    } catch (error) {
      console.error("Transcription error:", error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to transcribe audio." });
    }
  });

  app.post("/api/clean-transcript", async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "No transcript provided" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Here is a Khmer transcript with stutters, filler words (like "អើ"), and repeated words (e.g. និយាយ២ដងដដែលៗ).
Please clean up the text to make it professional and standard for formal reading, but DO NOT summarize it or lose any key information. Keep the original meaning exactly as is, just remove the speech disfluencies.

Transcript to clean:
${transcript}`,
      });

      res.json({ cleanedText: response.text });
    } catch (error) {
      console.error("Clean transcript error:", error);
      res.status(500).json({ error: "Failed to clean transcript." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
