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

  const getAI = (req: express.Request) => {
    const key = req.headers['x-gemini-api-key'] as string;
    if (!key) {
      throw new Error("ការភ្ជាប់ API Key បរាជ័យ សូមបញ្ចូល Gemini API Key នៅក្នុងការកំណត់ (Settings)។");
    }
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  app.use(express.json({ limit: "50mb" }));

  // Middleware to enforce API Key for AI routes
  app.use("/api", (req, res, next) => {
    if (req.path === "/import-sheet") {
      return next(); // This route doesn't need Gemini API
    }
    const key = req.headers['x-gemini-api-key'] as string;
    if (!key) {
      res.status(401).json({ error: "សូមបញ្ចូល Gemini API Key របស់អ្នកនៅក្នុងការកំណត់ (Settings) ជាមុនសិន ដែលមានរូបតំណាងគន្លាក់កង់នៅផ្នែកលើ!" });
      return;
    }
    next();
  });

  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    try {
      const ai = getAI(req);
      // Using Base64 as it's safe for smaller audio, but ai.files.upload is better
      // Let's use ai.files.upload since the file is already on disk.
      const uploadResult = await ai.files.upload({
        file: req.file.path,
        config: {
          mimeType: req.file.mimetype || "audio/mp3",
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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
    } catch (error: any) {
      console.error("Transcription error:", error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error?.message || "Failed to transcribe audio." });
    }
  });

  app.post("/api/clean-transcript", async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "No transcript provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Here is a Khmer transcript with stutters, filler words (like "អើ"), and repeated words (e.g. និយាយ២ដងដដែលៗ).
Please clean up the text to make it professional and standard for formal reading, but DO NOT summarize it or lose any key information. Keep the original meaning exactly as is, just remove the speech disfluencies.

Transcript to clean:
${transcript}`,
      });

      res.json({ cleanedText: response.text });
    } catch (error: any) {
      console.error("Clean transcript error:", error);
      res.status(500).json({ error: error?.message || "Failed to clean transcript." });
    }
  });

  app.post("/api/import-sheet", async (req, res) => {
    const { url, dateFilter } = req.body;
    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    try {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        return res.status(400).json({ error: "Invalid Google Sheets URL" });
      }
      
      const sheetId = match[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      
      const sheetRes = await fetch(csvUrl);
      if (!sheetRes.ok) {
        throw new Error("Failed to fetch sheet data. Make sure it is completely public (Anyone with the link can view).");
      }
      
      const csvText = await sheetRes.text();
      
      // Basic CSV parsing
      const lines = csvText.split(/\r?\n/);
      if (lines.length < 2) {
        return res.json({ attendees: [] });
      }
      
      const headers = lines[0].split(",");
      // Approximate column indexes based on common keywords
      let timestampIdx = 0; // Usually the first column in Google Forms is Timestamp
      let nameIdx = -1;
      let genderIdx = -1;
      let roleIdx = -1;
      let phoneIdx = -1;
      let noteIdx = -1;
      
      headers.forEach((header, i) => {
        const h = header.toLowerCase();
        if (h.includes("ចំណុចពេលវេលា") || h.includes("timestamp") || h.includes("កាលបរិច្ឆេទ") || h.includes("date")) timestampIdx = i;
        if (h.includes("នាម") || h.includes("ឈ្មោះ") || h.includes("name")) nameIdx = i;
        if (h.includes("ភេទ") || h.includes("gender")) genderIdx = i;
        if (h.includes("តួនាទី") || h.includes("មុខតំណែង") || h.includes("role")) roleIdx = i;
        if (h.includes("ទូរស័ព្ទ") || h.includes("phone")) phoneIdx = i;
        if (h.includes("ផ្សេងៗ") || h.includes("ចំណាំ") || h.includes("note")) noteIdx = i;
      });
      
      // Default mappings if headers don't match exactly (based on the user screenshot: B=Name, C=Gender, D=Role, F=Notes, G=Phone)
      if (nameIdx === -1) nameIdx = 1;
      if (genderIdx === -1) genderIdx = 2;
      if (roleIdx === -1) roleIdx = 3;
      if (noteIdx === -1) noteIdx = 5;
      if (phoneIdx === -1) phoneIdx = 6;
      
      const attendees = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Handle basic CSV splitting avoiding commas inside quotes
        let inQuotes = false;
        let col = 0;
        let p = 0;
        const row = [];
        row[col] = '';
        for (let j = 0; j < lines[i].length; j++) {
          if (lines[i][j] === '"') {
            inQuotes = !inQuotes;
          } else if (lines[i][j] === ',' && !inQuotes) {
            col++;
            row[col] = '';
          } else {
            row[col] += lines[i][j];
          }
        }
        
        // Apply date filter if provided
        const rowTimestamp = row[timestampIdx]?.trim().replace(/^"|"$/g, '') || '';
        if (dateFilter && dateFilter.trim() !== '') {
          const filterDates = dateFilter.split(',').map((d: string) => d.trim().toLowerCase()).filter((d: string) => d !== '');
          const matchesDate = filterDates.some((dateString: string) => rowTimestamp.toLowerCase().includes(dateString));
          
          if (!matchesDate) {
            continue; // Skip this row if it doesn't match any of the date filters
          }
        }
        
        attendees.push({
          id: Date.now() + i,
          name: row[nameIdx]?.trim().replace(/^"|"$/g, '') || '',
          gender: row[genderIdx]?.trim().replace(/^"|"$/g, '') || '',
          role: row[roleIdx]?.trim().replace(/^"|"$/g, '') || '',
          phone: row[phoneIdx]?.trim().replace(/^"|"$/g, '') || '',
          note: row[noteIdx]?.trim().replace(/^"|"$/g, '') || ''
        });
      }
      
      res.json({ attendees });
    } catch (error: any) {
      console.error("Import sheet error:", error);
      res.status(500).json({ error: error.message || "Failed to import sheet." });
    }
  });

  app.post("/api/summarize-transcript", async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "No transcript provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Here is a Khmer transcript. Please summarize it very briefly, extracting ONLY the most important key points, decisions, and action items. Format it as a short bulleted list in Khmer. Keep the summary as concise and to the point as possible.
        
Transcript to summarize:
${transcript}`,
      });

      res.json({ summarizedText: response.text });
    } catch (error: any) {
      console.error("Summarize transcript error:", error);
      res.status(500).json({ error: error.message || "Failed to summarize transcript." });
    }
  });

  app.post("/api/generate-post", async (req, res) => {
    const data = req.body;

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert PR and communications officer for a primary school in Cambodia, writing standard social media updates following Ministry of Education, Youth and Sport guidelines.
Please write a short, concise, but highly engaging and professional Facebook caption (Post) for a school meeting with the following details:
- Topic: ${data.topic}
- Date: ${data.date} (Lunar date: ${data.lunarDate})
- Time: ${data.startTime} to ${data.endTime}
- Location: ${data.location}
- Chaired by: ${data.chair}
- Content/Main Agenda: ${data.content}

The text must be entirely in Khmer. Keep the overall post short and brief. Follow a structured format with a brief introductory sentence, concise time/place details (using bullet points or clear formatting), a short summary of what was discussed, and a polite concluding remark. Use appropriate hashtags (e.g., #MoEYS #សាលាបឋមសិក្សាអូរតាប្រុក #OtarprokPrimarySchool ...). Make it sound professional, respectful, and standard. DO NOT use asterisks (*) for formatting.`,
      });

      res.json({ postText: response.text ? response.text.replace(/\*/g, '') : '' });
    } catch (error: any) {
      console.error("Generate post error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate post." });
    }
  });

  app.post("/api/refine-agenda", async (req, res) => {
    const { agenda } = req.body;
    
    if (!agenda) {
      return res.status(400).json({ error: "No agenda provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `អ្នកគឺជាអ្នកជំនាញខាងសរសេរឯកសាររដ្ឋបាល និងកិច្ចប្រជុំ។ សូមជួយកែសម្រួលអក្ខរាវិរុទ្ធ វេយ្យាករណ៍ និងបន្ថែមអត្ថន័យឱ្យកាន់តែច្បាស់លាស់ ផ្លូវការ និងមានភាពរលូន នៃរបៀបវារៈកិច្ចប្រជុំខាងក្រោម៖

"${agenda}"

សូមចេញលទ្ធផលជារបៀបវារៈដែលកែសម្រួលរួចប៉ុណ្ណោះ។ កុំសរសេរពាក្យផ្ដើម ឬពាក្យបញ្ចប់ផ្សេងៗ។ សូមកុំប្រើសញ្ញាផ្កាយ (*) ឱ្យសោះ។ រក្សាលេខរៀងឱ្យបានត្រឹមត្រូវ។`,
      });

      res.json({ refinedText: response.text ? response.text.replace(/\*/g, '') : '' });
    } catch (error: any) {
      console.error("Refine agenda error:", error);
      res.status(500).json({ error: error?.message || "Failed to refine agenda." });
    }
  });

  app.post("/api/generate-agenda", async (req, res) => {
    const { topic, content } = req.body;
    
    if (!topic && !content) {
      return res.status(400).json({ error: "No topic or content provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert meeting organizer. Please generate a professional meeting agenda in Khmer based on the following context.
- Meeting Topic: ${topic || 'Not provided'}
- Meeting Summary/Content: ${content || 'Not provided'}

The agenda should be a clear, numbered list of topics to be discussed. It should be concise and professional. Do NOT include introductory or concluding thoughts like 'Here is the agenda', just output the agenda items directly. DO NOT use asterisks (*) for formatting.`,
      });

      res.json({ agendaText: response.text ? response.text.replace(/\*/g, '') : '' });
    } catch (error: any) {
      console.error("Generate agenda error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate agenda." });
    }
  });

  app.post("/api/generate-content", async (req, res) => {
    const { topic, agenda, transcription } = req.body;
    
    if (!topic && !agenda) {
      return res.status(400).json({ error: "No topic or agenda provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert meeting documenter. Please generate a detailed and professional meeting content/summary in Khmer based on the meeting topic, agenda, and any provided transcription notes.
- Meeting Topic: ${topic || 'Not provided'}
- Meeting Agenda: ${agenda || 'Not provided'}
- Transcription/Notes: ${transcription || 'Not provided'}

Follow the agenda points and expand on them to create a coherent narrative of what transpired during the meeting. If there are transcription notes, incorporate them. Keep the formatting clear and professional. Use full sentences and clear paragraphs. It should be written formally in Khmer. DO NOT use asterisks (*) for formatting.`,
      });

      res.json({ contentText: response.text ? response.text.replace(/\*/g, '') : '' });
    } catch (error: any) {
      console.error("Generate content error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate content." });
    }
  });

  app.post("/api/refine-content", async (req, res) => {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "No content provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `អ្នកគឺជាអ្នកជំនាញខាងសរសេរឯកសាររដ្ឋបាល និងកិច្ចប្រជុំ។ សូមជួយកែសម្រួលអក្ខរាវិរុទ្ធ វេយ្យាករណ៍ និងបន្ថែមអត្ថន័យឱ្យកាន់តែច្បាស់លាស់ ផ្លូវការ និងមានភាពរលូន និងពិរោះស្តាប់ នៃខ្លឹមសារកិច្ចប្រជុំ ឬកំណត់ហេតុខាងក្រោម៖

"${content}"

សូមចេញលទ្ធផលតែខ្លឹមសារដែលកែសម្រួលរួចប៉ុណ្ណោះ។ កុំសរសេរពាក្យផ្ដើម ឬពាក្យបញ្ចប់ផ្សេងៗ។ សូមកុំប្រើសញ្ញាផ្កាយ (*) ឱ្យសោះ។`,
      });

      res.json({ refinedText: response.text ? response.text.replace(/\*/g, '') : '' });
    } catch (error: any) {
      console.error("Refine content error:", error);
      res.status(500).json({ error: error?.message || "Failed to refine content." });
    }
  });

  app.post("/api/generate-decision", async (req, res) => {
    const { topic, content } = req.body;
    
    if (!topic && !content) {
      return res.status(400).json({ error: "No topic or content provided" });
    }

    try {
      const ai = getAI(req);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert meeting documenter. Please generate a concise and professional meeting decision/resolution (សេចក្តីសម្រេច) in Khmer based on the meeting topic and content/summary provided.
- Meeting Topic: ${topic || 'Not provided'}
- Meeting Summary/Content: ${content || 'Not provided'}

Identify the key decisions made and action items agreed upon. Format it as a clear, bulleted or numbered list. It should be written formally in Khmer. DO NOT use asterisks (*) for formatting.`,
      });

      res.json({ decisionText: response.text ? response.text.replace(/\*/g, '') : '' });
    } catch (error: any) {
      console.error("Generate decision error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate decision." });
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
