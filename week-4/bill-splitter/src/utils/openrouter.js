// utils/openrouter.js
export async function extractTextFromImage(base64Image) {
  const API_KEY = "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";

  const response = await fetch("https://api.openrouter.ai/v1/engines/llama-2-7b-chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      input: `Extract the items and prices from this receipt image: ${base64Image}`,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
 
  return data?.output?.[0]?.content?.[0]?.text || "";
}
