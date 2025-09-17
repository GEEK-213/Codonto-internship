import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// OCR proxy route
app.post("/api/extract", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Convert file buffer to base64
    const base64Image = file.buffer.toString("base64");

    // Call OpenRouter API
    const response = await fetch("https://api.openrouter.ai/v1/engines/llama-2-7b-chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`
      },
      body: JSON.stringify({
        input: `Extract the items and prices from this receipt:\n${base64Image}`
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
