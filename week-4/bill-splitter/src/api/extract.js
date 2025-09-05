// api/extract.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { base64Image } = req.body;

  try {
    const response = await fetch(
      "https://api.openrouter.ai/v1/engines/llama-2-7b-chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        },
        body: JSON.stringify({
          input: `Extract items and prices from this receipt: ${base64Image}`,
          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();
    const text = data?.output?.[0]?.content?.[0]?.text || "";

    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract text" });
  }
}
