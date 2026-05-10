const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { scrapeUrl } = require("../services/scraper");
const { parseFile } = require("../services/fileParser");
const { generateInterviewQuestions } = require("../services/gemini");

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".docx", ".doc", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Sadece PDF, DOCX, DOC ve TXT dosyaları kabul edilir."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * POST /api/analyze
 * Şirket bilgisi topla ve mülakat soruları üret
 * Body: { companyName?, url?, text?, position }
 * Files: file (opsiyonel)
 */
router.post("/", upload.single("file"), async (req, res) => {
  const { companyName, url, text, position } = req.body;
  const uploadedFile = req.file;

  if (!position) {
    return res.status(400).json({ error: "Pozisyon bilgisi zorunludur." });
  }

  // En az bir bilgi kaynağı gerekli
  if (!companyName && !url && !text && !uploadedFile) {
    return res.status(400).json({ error: "En az bir şirket bilgisi kaynağı gereklidir." });
  }

  const infoParts = [];

  // 1. Şirket adı
  if (companyName) {
    infoParts.push(`Şirket Adı: ${companyName}`);
  }

  // 2. Ek metin bilgisi
  if (text && text.trim().length > 0) {
    infoParts.push(`Kullanıcı Notları:\n${text.trim().substring(0, 2000)}`);
  }

  // 3. URL scraping
  if (url && url.trim().length > 0) {
    try {
      console.log(`[Scraping] ${url}`);
      const scraped = await scrapeUrl(url.trim());
      if (scraped.success && scraped.text) {
        infoParts.push(`Web Sitesi İçeriği (${scraped.url}):\n${scraped.text}`);
      } else {
        infoParts.push(`Web sitesi tarandı fakat içerik alınamadı. URL: ${url}`);
      }
    } catch (err) {
      console.warn("[Scraping hatası]", err.message);
      infoParts.push(`Web sitesi URL'si: ${url} (içerik çekilemedi)`);
    }
  }

  // 4. Dosya parsing
  if (uploadedFile) {
    try {
      console.log(`[Dosya] ${uploadedFile.originalname}`);
      const parsed = await parseFile(uploadedFile.path, uploadedFile.originalname);
      infoParts.push(`Yüklenen Dosya (${uploadedFile.originalname}):\n${parsed.text}`);
    } catch (err) {
      console.warn("[Dosya hatası]", err.message);
    } finally {
      // Geçici dosyayı sil
      try { fs.unlinkSync(uploadedFile.path); } catch {}
    }
  }

  if (infoParts.length === 0) {
    return res.status(400).json({ error: "Şirket bilgisi işlenemedi. Lütfen tekrar deneyin." });
  }

  const companyInfo = infoParts.join("\n\n---\n\n");

  try {
    console.log(`[Gemini] Sorular üretiliyor... Pozisyon: ${position}`);
    const result = await generateInterviewQuestions(companyInfo, position);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[Gemini hatası]", err.message);
    res.status(500).json({ error: `Sorular üretilemedi: ${err.message}` });
  }
});

module.exports = router;
