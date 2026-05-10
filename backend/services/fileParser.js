const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

/**
 * Yüklenen dosyadan metin çıkarır (PDF veya DOCX)
 */
async function parseFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".pdf") {
    return await parsePDF(filePath);
  } else if (ext === ".docx" || ext === ".doc") {
    return await parseDOCX(filePath);
  } else if (ext === ".txt") {
    const fs = require("fs");
    const text = fs.readFileSync(filePath, "utf-8");
    return { success: true, text: text.substring(0, 5000) };
  } else {
    throw new Error(`Desteklenmeyen dosya formatı: ${ext}`);
  }
}

async function parsePDF(filePath) {
  const fs = require("fs");
  const dataBuffer = fs.readFileSync(filePath);
  
  try {
    const data = await pdf(dataBuffer);
    const text = data.text.replace(/\s+/g, " ").trim();
    return {
      success: true,
      text: text.substring(0, 5000),
      pages: data.numpages,
    };
  } catch (error) {
    throw new Error(`PDF okunamadı: ${error.message}`);
  }
}

async function parseDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value.replace(/\s+/g, " ").trim();
    return {
      success: true,
      text: text.substring(0, 5000),
    };
  } catch (error) {
    throw new Error(`DOCX okunamadı: ${error.message}`);
  }
}

module.exports = { parseFile };
