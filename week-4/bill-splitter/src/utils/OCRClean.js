export function cleanOCRText(rawText) {
 
  let lines = rawText.split("\n").map(l => l.trim()).filter(l => l);


  let filtered = lines.filter(line =>
    /₹\s*\d+/.test(line) || /\d+\.\d{2}/.test(line)
  );

  filtered = filtered.filter(line => !/^[A-Za-z]{1,3}$/.test(line));

  return filtered.join("\n");
}
