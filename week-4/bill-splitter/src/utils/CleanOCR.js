
export function cleanOCRText(raw) {
  return raw
    .replace(/\n\s*\n/g, "\n") 
    .trim();
}

export function extractItems(text) {
  const lines = text.split("\n").filter(l => l.trim() !== "");
  return lines.map((line, idx) => {
    const match = line.match(/(.+?)\s+(\d+(\.\d{1,2})?)$/);
    if (match) {
      return { id: idx, name: match[1].trim(), amount: parseFloat(match[2]) };
    }
    return { id: idx, name: line.trim(), amount: 0 };
  });
}
